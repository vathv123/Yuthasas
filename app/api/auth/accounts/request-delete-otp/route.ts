import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { getDeviceHash } from "@/lib/device"
import { issueDeleteOtp } from "@/lib/accountOtp"
import { sendDeleteOtpEmail } from "@/lib/email"
import { isLocalOnlyAuthMode } from "@/lib/localMode"
import { localStore } from "@/lib/localStore"

export const runtime = "nodejs"

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard

  const ip = getRequestIP(request)
  const deviceHash = getDeviceHash(request)
  const rl = checkRateLimit(`${ip}:auth:delete-otp`, 8, 60_000)
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
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }

  if (isLocalOnlyAuthMode()) {
    const linked = localStore.getSignupAccounts(ip, deviceHash).includes(email)
    if (!linked) {
      return NextResponse.json({ ok: false, error: "Email is not linked to this device context" }, { status: 403 })
    }
    const user = localStore.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ ok: false, error: "Account not found" }, { status: 404 })
    }

    const otp = issueDeleteOtp({ email, ip })
    try {
      await sendDeleteOtpEmail(email, otp.code)
    } catch {
      return NextResponse.json({ ok: false, error: "Unable to send OTP email" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, expiresAt: otp.expiresAt }, { status: 200 })
  }

  const db = prisma as any
  const linked = await db.signupEvent.findFirst({ where: { ip, deviceHash, email } })
  if (!linked) {
    return NextResponse.json({ ok: false, error: "Email is not linked to this device context" }, { status: 403 })
  }

  const user = await db.user.findUnique({ where: { email }, select: { id: true } })
  if (!user) {
    return NextResponse.json({ ok: false, error: "Account not found" }, { status: 404 })
  }

  const otp = issueDeleteOtp({ email, ip })
  try {
    await sendDeleteOtpEmail(email, otp.code)
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to send OTP email" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, expiresAt: otp.expiresAt }, { status: 200 })
}
