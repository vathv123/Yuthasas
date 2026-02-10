import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"

const db = prisma as any

export const runtime = "nodejs"

export async function GET(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:business:get`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ data: null }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ data: null }, { status: 200 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ data: null }, { status: 200 })
  }

  const business = await db.userBusiness.findUnique({
    where: { userId: user.id },
  })

  return NextResponse.json({ data: business }, { status: 200 })
}

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:business:post`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  let payload: any = null
  try {
    payload = await request.json()
  } catch {
    payload = null
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const {
    businessName,
    businessType,
    businessScale,
    financialStress,
    items,
    costs,
  } = payload

  const safeItems = Array.isArray(items)
    ? items
        .filter((item: any) => item && typeof item === "object")
        .map((item: any) => ({
          id: String(item.id ?? ""),
          name: String(item.name ?? ""),
          price: Number(item.price ?? 0),
          soldPerDay: Number(item.soldPerDay ?? 0),
          profitMargin: Number(item.profitMargin ?? 0),
        }))
    : []

  const safeCosts =
    costs && typeof costs === "object"
      ? Object.fromEntries(
          Object.entries(costs).map(([key, value]) => [key, Number(value ?? 0)])
        )
      : {}

  await db.userBusiness.upsert({
    where: { userId: user.id },
    update: {
      businessName: businessName ?? null,
      businessType: businessType ?? null,
      businessScale: businessScale ?? null,
      financialStress: financialStress ?? null,
      items: safeItems,
      costs: safeCosts,
    },
    create: {
      userId: user.id,
      businessName: businessName ?? null,
      businessType: businessType ?? null,
      businessScale: businessScale ?? null,
      financialStress: financialStress ?? null,
      items: safeItems,
      costs: safeCosts,
    },
  })

  return NextResponse.json({ ok: true }, { status: 200 })
}
