import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { getDeviceHash } from "@/lib/device"

export const runtime = "nodejs"

const ACCOUNT_LIMIT_PER_DEVICE = 2

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")?.trim().toLowerCase()
  const ip = getRequestIP(request)
  const deviceHash = getDeviceHash(request)
  const rl = checkRateLimit(`${ip}:auth:register:device-limit`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }

  const db = prisma as any
  const deviceEvents = await db.signupEvent.findMany({
    where: { ip, deviceHash },
    distinct: ["email"],
    select: { email: true },
    orderBy: { email: "asc" },
  })
  const accounts = deviceEvents.map((e: { email: string }) => e.email)

  const blockedForRequest =
    accounts.length >= ACCOUNT_LIMIT_PER_DEVICE && (!email || !accounts.includes(email))

  return NextResponse.json(
    {
      ok: true,
      blocked: blockedForRequest,
      limit: ACCOUNT_LIMIT_PER_DEVICE,
      accounts,
    },
    { status: 200 }
  )
}
