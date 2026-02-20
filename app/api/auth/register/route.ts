import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { isLocalOnlyAuthMode } from "@/lib/localMode"
import { localStore } from "@/lib/localStore"

export const runtime = "nodejs"

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
  if (isLocalOnlyAuthMode()) {
    const existing = localStore.getUserByEmail(email)
    const existingName = localStore.getUsersByName(name)
    if (existingName.some((user) => user.email !== email)) {
      return NextResponse.json({ ok: false, error: "Username already exists" }, { status: 409 })
    }

    const passwordHash = hashPassword(password)
    if (existing) {
      if (!existing.passwordHash) {
        localStore.upsertUser({
          email,
          name: existing.name ?? name,
          passwordHash,
        })
        return NextResponse.json({ ok: true, updated: true }, { status: 200 })
      }
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 })
    }

    localStore.upsertUser({
      name,
      email,
      passwordHash,
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const db = prisma as any
  const existing = await db.user.findUnique({ where: { email } })
  const existingName = await db.user.findFirst({ where: { name } })
  if (existingName && existingName.email !== email) {
    return NextResponse.json({ ok: false, error: "Username already exists" }, { status: 409 })
  }
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
