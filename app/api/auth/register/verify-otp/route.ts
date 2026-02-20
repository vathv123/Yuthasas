import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyOtp } from "@/lib/otp"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { getDeviceHash, getUserAgent } from "@/lib/device"
import { isLocalOnlyAuthMode } from "@/lib/localMode"
import { localStore } from "@/lib/localStore"

export const runtime = "nodejs"

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard

  const ip = getRequestIP(request)
  const deviceHash = getDeviceHash(request)
  const userAgent = getUserAgent(request)
  const rl = checkRateLimit(`${ip}:auth:register:verify`, 20, 60_000)
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

  if (!email || !code) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 })
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: "Invalid OTP format" }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }

  const verified = verifyOtp({ email, code })
  if (!verified.ok) {
    const errorByReason: Record<string, string> = {
      missing: "OTP not found. Request a new code.",
      expired: "OTP expired. Request a new code.",
      locked: "Too many invalid attempts. Request a new code.",
      invalid: "Invalid OTP code.",
    }
    return NextResponse.json({ ok: false, error: errorByReason[verified.reason] ?? "Invalid OTP" }, { status: 400 })
  }
  if (isLocalOnlyAuthMode()) {
    const now = new Date()
    const existing = localStore.getUserByEmail(verified.email)

    if (existing?.passwordHash) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 })
    }

    localStore.upsertUser({
      email: verified.email,
      name: existing?.name ?? verified.name,
      passwordHash: verified.passwordHash,
      emailVerified: existing?.emailVerified ?? now,
    })
    localStore.addSignupEvent({
      email: verified.email,
      ip,
      deviceHash,
      userAgent,
    })

    return NextResponse.json({ ok: true, updated: Boolean(existing) }, { status: existing ? 200 : 201 })
  }

  const db = prisma as any
  const now = new Date()
  const existing = await db.user.findUnique({ where: { email: verified.email } })

  if (existing?.passwordHash) {
    return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 })
  }

  if (existing && !existing.passwordHash) {
    await db.user.update({
      where: { email: verified.email },
      data: {
        name: existing.name ?? verified.name,
        passwordHash: verified.passwordHash,
        emailVerified: existing.emailVerified ?? now,
      },
    })
    await db.signupEvent.create({
      data: {
        email: verified.email,
        ip,
        deviceHash,
        userAgent,
      },
    })
    return NextResponse.json({ ok: true, updated: true }, { status: 200 })
  }

  const created = await db.user.create({
    data: {
      name: verified.name,
      email: verified.email,
      passwordHash: verified.passwordHash,
      emailVerified: now,
    },
  })
  await db.signupEvent.create({
    data: {
      email: created.email,
      ip,
      deviceHash,
      userAgent,
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
