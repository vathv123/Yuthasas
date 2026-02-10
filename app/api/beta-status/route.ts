import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isPromoActive } from "@/lib/promo"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:beta:get`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ count: 0, limit: 100, full: false, active: false }, { status: 429 })
  }
  const limit = 100
  const db = prisma as any
  const count = await db.userProfile.count({
    where: { isPremium: true },
  })
  const active = isPromoActive()
  return NextResponse.json(
    {
      count,
      limit,
      full: active ? count >= limit : false,
      active,
    },
    { status: 200 }
  )
}
