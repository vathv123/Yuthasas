import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { isPromoActive } from "@/lib/promo"
import { withPrismaRetry } from "@/lib/prismaRetry"

const db = prisma as any

export const runtime = "nodejs"

export async function GET(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:onboarding:get`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ completed: false, answers: null }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ completed: false, answers: null }, { status: 200 })
  }

  const email = String(session.user.email).trim().toLowerCase()
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
    return NextResponse.json({ completed: false, answers: null }, { status: 200 })
  }

  const [profile, onboarding]: [any, any] = await Promise.all([
    withPrismaRetry(() => db.userProfile.findUnique({
      where: { userId: user.id },
      select: { onboardingCompleted: true, isPremium: true },
    }), 1),
    withPrismaRetry(() => db.userOnboarding.findUnique({
      where: { userId: user.id },
      select: { answers: true },
    }), 1),
  ])

  return NextResponse.json(
    {
      completed: profile?.onboardingCompleted ?? false,
      answers: onboarding?.answers ?? null,
      isPremium: profile?.isPremium ?? false,
    },
    { status: 200 }
  )
}

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:onboarding:post`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const email = String(session.user.email).trim().toLowerCase()
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

  let answers: unknown = null
  try {
    const body = await request.json()
    answers = body?.answers ?? null
  } catch {
    answers = null
  }
  if (answers !== null && typeof answers !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 })
  }

  const db = prisma as any
  const promoActive = isPromoActive()
  const desiredPlan =
    answers && typeof answers === "object" ? (answers as Record<number, string | string[]>)[4] : null
  const wantsPremium = String(desiredPlan ?? "").toLowerCase() === "premium"

  let grantPremium = false
  if (promoActive && wantsPremium) {
    const premiumCount = await withPrismaRetry<number>(() => db.userProfile.count({
      where: { isPremium: true },
    }), 1)
    if (premiumCount < 100) grantPremium = true
  }

  await withPrismaRetry(
    () =>
      db.userProfile.upsert({
    where: { userId: user.id },
    update: {
      onboardingCompleted: true,
      onboardingAt: new Date(),
      isPremium: grantPremium ? true : undefined,
      premiumSince: grantPremium ? new Date() : undefined,
      premiumSource: grantPremium ? "promo" : undefined,
    },
    create: {
      userId: user.id,
      onboardingCompleted: true,
      onboardingAt: new Date(),
      isPremium: grantPremium,
      premiumSince: grantPremium ? new Date() : undefined,
      premiumSource: grantPremium ? "promo" : undefined,
    },
  }),
    1
  )

  if (answers) {
    await withPrismaRetry(
      () =>
        db.userOnboarding.upsert({
      where: { userId: user.id },
      update: { answers },
      create: { userId: user.id, answers },
    }),
      1
    )
  }

  return NextResponse.json({ ok: true, isPremium: grantPremium, promoActive }, { status: 200 })
}
