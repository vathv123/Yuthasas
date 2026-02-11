import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { getDeviceHash, getUserAgent } from "@/lib/device"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard

  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:auth:register:device-register`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }

  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const deviceHash = getDeviceHash(request)
  const userAgent = getUserAgent(request)
  const db = prisma as any

  const existing = await db.signupEvent.findFirst({
    where: { email, ip, deviceHash },
    select: { id: true },
  })

  if (!existing) {
    await db.signupEvent.create({
      data: { email, ip, deviceHash, userAgent },
    })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

