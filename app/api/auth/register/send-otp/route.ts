import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { issueOtp } from "@/lib/otp"
import { sendSignupOtpEmail } from "@/lib/email"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { getDeviceHash } from "@/lib/device"
import { withPrismaRetry } from "@/lib/prismaRetry"

export const runtime = "nodejs"
const ACCOUNT_LIMIT_PER_DEVICE = 2

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isStrongPassword = (password: string) =>
  password.length >= 10 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password)

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard

  const ip = getRequestIP(request)
  const deviceHash = getDeviceHash(request)
  const globalLimit = checkRateLimit(`${ip}:auth:register:otp`, 6, 60_000)
  if (!globalLimit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }

  let body: any = null
  try {
    body = await request.json()
  } catch {
    body = null
  }

  const name = String(body?.name ?? "").trim()
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")

  if (!name || !email || !password) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 })
  }
  if (name.length > 40) {
    return NextResponse.json({ ok: false, error: "Username is too long" }, { status: 400 })
  }
  if (name.length < 3) {
    return NextResponse.json({ ok: false, error: "Username must be at least 3 characters" }, { status: 400 })
  }
  if (email.length > 254) {
    return NextResponse.json({ ok: false, error: "Email is too long" }, { status: 400 })
  }
  if (password.length > 128) {
    return NextResponse.json({ ok: false, error: "Password is too long" }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }
  if (!isStrongPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Password must include upper, lower, number, symbol and be 10+ chars" },
      { status: 400 }
    )
  }

  const db = prisma as any
  try {
    await prisma.$connect().catch(() => null)
    const existing = await withPrismaRetry<any>(
      () => db.user.findUnique({ where: { email } }),
      2
    )
    if (existing?.passwordHash) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 })
    }

    let uniqueEmails: string[] = []
    try {
      const deviceEvents = await withPrismaRetry<Array<{ email: string }>>(
        () =>
          db.signupEvent.findMany({
            where: { ip, deviceHash },
            distinct: ["email"],
            select: { email: true },
            orderBy: { email: "asc" },
          }),
        1
      )
      uniqueEmails = deviceEvents.map((e: { email: string }) => e.email)
    } catch {
      // Keep OTP flow running if optional device-tracking table is unavailable.
      uniqueEmails = []
    }

    if (uniqueEmails.length >= ACCOUNT_LIMIT_PER_DEVICE && !uniqueEmails.includes(email)) {
      return NextResponse.json(
        {
          ok: false,
          code: "ACCOUNT_LIMIT_EXCEEDED",
          error: "This device has reached the max of 2 accounts. Remove one account to continue.",
          accounts: uniqueEmails,
        },
        { status: 409 }
      )
    }

    const existingName = await withPrismaRetry<any>(
      () => db.user.findFirst({ where: { name } }),
      2
    )
    if (existingName && existingName.email !== email) {
      return NextResponse.json({ ok: false, error: "Username already exists" }, { status: 409 })
    }

    const passwordHash = hashPassword(password)
    const otp = issueOtp({ email, name, passwordHash })

    try {
      await sendSignupOtpEmail(email, otp.code)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send OTP email"
      return NextResponse.json(
        { ok: false, error: message.includes("SMTP") ? message : "Unable to send OTP email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, expiresAt: otp.expiresAt }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false, error: "Signup service temporarily unavailable" }, { status: 503 })
  }
}
