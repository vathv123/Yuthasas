import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { isPromoActive } from "@/lib/promo"
import { withPrismaRetry } from "@/lib/prismaRetry"

const db = prisma as any

export const runtime = "nodejs"

const resolveUserFromSession = async (session: { user?: { email?: string | null; name?: string | null } }) => {
  const email = String(session.user?.email ?? "").trim().toLowerCase()
  if (!email) return null
  const sessionName = session.user?.name ? String(session.user.name).trim() : undefined

  const existing = await withPrismaRetry<any>(
    () =>
      db.user.findUnique({
        where: { email },
        select: { id: true },
      }),
    3
  )
  if (existing) return existing

  try {
    return await withPrismaRetry<any>(
      () =>
        db.user.create({
          data: {
            email,
            name: sessionName || "User",
            emailVerified: new Date(),
          },
          select: { id: true },
        }),
      3
    )
  } catch {
    return withPrismaRetry<any>(
      () =>
        db.user.findUnique({
          where: { email },
          select: { id: true },
        }),
      3
    )
  }
}

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
  await prisma.$connect().catch(() => null)

  const user = await resolveUserFromSession(session)

  if (!user) {
    return NextResponse.json({ completed: false, answers: null }, { status: 200 })
  }

  const [profile, onboarding]: [any, any] = await Promise.all([
    withPrismaRetry(() => db.userProfile.findUnique({
      where: { userId: user.id },
      select: { onboardingCompleted: true, isPremium: true },
    }), 3),
    withPrismaRetry(() => db.userOnboarding.findUnique({
      where: { userId: user.id },
      select: { answers: true },
    }), 3),
  ])

  return NextResponse.json(
    {
      completed: (profile?.onboardingCompleted ?? false) || Boolean(onboarding?.answers),
      answers: onboarding?.answers ?? null,
      isPremium: profile?.isPremium ?? false,
    },
    { status: 200 }
  )
}

export async function POST(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:onboarding:post`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  await prisma.$connect().catch(() => null)

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

  try {
    const user = await resolveUserFromSession(session)

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 })
    }

    const promoActive = isPromoActive()
    const desiredPlan =
      answers && typeof answers === "object" ? (answers as Record<number, string | string[]>)[4] : null
    const wantsPremium = String(desiredPlan ?? "").toLowerCase() === "premium"

    let grantPremium = false
    if (promoActive && wantsPremium) {
      const existingProfile = await withPrismaRetry<any>(
        () =>
          db.userProfile.findUnique({
            where: { userId: user.id },
            select: { isPremium: true },
          }),
        5
      )
      const alreadyPremium = Boolean(existingProfile?.isPremium)
      if (alreadyPremium) {
        grantPremium = true
      } else {
        const premiumCount = await withPrismaRetry<number>(
          () =>
            db.userProfile.count({
              where: { isPremium: true },
            }),
          5
        )
        if (premiumCount < 100) grantPremium = true
      }
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
      5
    )

    if (answers) {
      await withPrismaRetry(
        () =>
          db.userOnboarding.upsert({
            where: { userId: user.id },
            update: { answers },
            create: { userId: user.id, answers },
          }),
        5
      )
    }

    return NextResponse.json({ ok: true, isPremium: grantPremium, promoActive }, { status: 200 })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Database temporarily unavailable. Please try again." },
      { status: 503 }
    )
  }
}
