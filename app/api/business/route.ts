import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { withPrismaRetry } from "@/lib/prismaRetry"
import { isLocalOnlyAuthMode } from "@/lib/localMode"
import { localStore } from "@/lib/localStore"

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

  const email = String(session.user.email).trim().toLowerCase()
  if (isLocalOnlyAuthMode()) {
    const profile = localStore.getOnboarding(email)
    if (!profile?.isPremium) {
      return NextResponse.json({ data: null }, { status: 200 })
    }
    return NextResponse.json({ data: localStore.getBusiness(email) }, { status: 200 })
  }

  const sessionName = session.user?.name ? String(session.user.name).trim() : undefined
  const user = await withPrismaRetry<any>(
    () =>
      db.user.upsert({
        where: { email },
        update: {
          name: sessionName,
          emailVerified: new Date(),
        },
        create: {
          email,
          name: sessionName || "User",
          emailVerified: new Date(),
        },
        select: { id: true },
      }),
    1
  )

  if (!user) {
    return NextResponse.json({ data: null }, { status: 200 })
  }

  const profile = await withPrismaRetry<any>(
    () =>
      db.userProfile.findUnique({
        where: { userId: user.id },
        select: { isPremium: true },
      }),
    1
  )
  if (!profile?.isPremium) {
    return NextResponse.json({ data: null }, { status: 200 })
  }

  const business = await withPrismaRetry(
    () =>
      db.userBusiness.findUnique({
    where: { userId: user.id },
  }),
    1
  )

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

  const email = String(session.user.email).trim().toLowerCase()
  if (isLocalOnlyAuthMode()) {
    const profile = localStore.getOnboarding(email)
    if (!profile?.isPremium) {
      return NextResponse.json({ ok: true, persisted: false }, { status: 200 })
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

    localStore.setBusiness(email, {
      businessName: businessName ?? null,
      businessType: businessType ?? null,
      businessScale: businessScale ?? null,
      financialStress: financialStress ?? null,
      items: safeItems,
      costs: safeCosts,
    })

    return NextResponse.json({ ok: true, persisted: true }, { status: 200 })
  }

  const sessionName = session.user?.name ? String(session.user.name).trim() : undefined
  const user = await withPrismaRetry<any>(
    () =>
      db.user.upsert({
        where: { email },
        update: {
          name: sessionName,
          emailVerified: new Date(),
        },
        create: {
          email,
          name: sessionName || "User",
          emailVerified: new Date(),
        },
        select: { id: true },
      }),
    1
  )

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const profile = await withPrismaRetry<any>(
    () =>
      db.userProfile.findUnique({
        where: { userId: user.id },
        select: { isPremium: true },
      }),
    1
  )
  if (!profile?.isPremium) {
    // Free users can use calculator, but business persistence is premium-only.
    return NextResponse.json({ ok: true, persisted: false }, { status: 200 })
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

  await withPrismaRetry(
    () =>
      db.userBusiness.upsert({
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
  }),
    1
  )

  return NextResponse.json({ ok: true, persisted: true }, { status: 200 })
}
