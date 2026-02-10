import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"

export const runtime = "nodejs"

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:auth:register`, 10, 60_000)
  if (!rl.ok) {
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
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 })
  }

  const db = prisma as any
  const existing = await db.user.findUnique({ where: { email } })
  const passwordHash = hashPassword(password)
  if (existing) {
    if (!existing.passwordHash) {
      await db.user.update({
        where: { email },
        data: { passwordHash, name: existing.name ?? name },
      })
      return NextResponse.json({ ok: true, updated: true }, { status: 200 })
    }
    return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 })
  }

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
