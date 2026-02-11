import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { verifyDeleteOtp } from "@/lib/accountOtp"
import { getDeviceHash } from "@/lib/device"

export const runtime = "nodejs"

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard

  const ip = getRequestIP(request)
  const deviceHash = getDeviceHash(request)
  const rl = checkRateLimit(`${ip}:auth:delete-confirm`, 20, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }

  let body: any = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  const email = String(body?.email ?? "").trim().toLowerCase()
  const code = String(body?.code ?? "").trim()

  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: "Invalid email or OTP code" }, { status: 400 })
  }

  const verified = verifyDeleteOtp({ email, ip, code })
  if (!verified.ok) {
    return NextResponse.json({ ok: false, error: "Invalid or expired OTP" }, { status: 400 })
  }

  const db = prisma as any
  const linked = await db.signupEvent.findFirst({ where: { ip, deviceHash, email } })
  if (!linked) {
    return NextResponse.json({ ok: false, error: "Email is not linked to this device context" }, { status: 403 })
  }

  await db.user.deleteMany({ where: { email } })
  await db.signupEvent.deleteMany({ where: { email } })

  return NextResponse.json({ ok: true }, { status: 200 })
}

