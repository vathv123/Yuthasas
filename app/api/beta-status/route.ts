import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isPromoActive } from "@/lib/promo"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { withPrismaRetry } from "@/lib/prismaRetry"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:beta:get`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ count: 0, limit: 100, full: false, active: false }, { status: 429 })
  }
  const limit = 100
  const active = isPromoActive()
  const db = prisma as any

  try {
    const count = await withPrismaRetry<number>(
      () =>
        db.userProfile.count({
          where: { isPremium: true },
        }),
      1
    )

    return NextResponse.json(
      {
        count,
        limit,
        full: active ? count >= limit : false,
        active,
      },
      { status: 200 }
    )
  } catch {
    // Keep UI functional when DB is temporarily unavailable.
    return NextResponse.json(
      {
        count: 0,
        limit,
        full: false,
        active,
      },
      { status: 200 }
    )
  }
}
