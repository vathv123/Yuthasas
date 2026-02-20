import { NextResponse } from "next/server"
import { isPromoActive } from "@/lib/promo"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:beta:get`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ active: false }, { status: 429 })
  }
  const active = isPromoActive()
  return NextResponse.json(
    { active },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  )
}
