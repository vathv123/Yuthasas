import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"
import { rejectIfNotSameOrigin } from "@/lib/security"
import { withPrismaRetry } from "@/lib/prismaRetry"

const db = prisma as any

export const runtime = "nodejs"

export async function GET(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:asks:get`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ completed: false }, { status: 200 })
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
    return NextResponse.json({ completed: false }, { status: 200 })
  }

  const [profile, survey]: [any, any] = await Promise.all([
    withPrismaRetry(() => db.userProfile.findUnique({
      where: { userId: user.id },
      select: { asksCompleted: true, onboardingCompleted: true },
    }), 1),
    withPrismaRetry(() => db.userSurvey.findUnique({
      where: { userId: user.id },
      select: { answers: true },
    }), 1),
  ])

  return NextResponse.json(
    {
      completed: profile?.asksCompleted ?? false,
      onboardingCompleted: profile?.onboardingCompleted ?? false,
      answers: survey?.answers ?? null,
    },
    { status: 200 }
  )
}

export async function POST(request: Request) {
  const originGuard = rejectIfNotSameOrigin(request)
  if (originGuard) return originGuard
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:asks:post`, 30, 60_000)
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

  await withPrismaRetry(
    () =>
      db.userProfile.upsert({
    where: { userId: user.id },
    update: { asksCompleted: true, askedAt: new Date() },
    create: { userId: user.id, asksCompleted: true, askedAt: new Date() },
  }),
    1
  )

  if (answers) {
    await withPrismaRetry(
      () =>
        db.userSurvey.upsert({
      where: { userId: user.id },
      update: { answers },
      create: { userId: user.id, answers },
    }),
      1
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
