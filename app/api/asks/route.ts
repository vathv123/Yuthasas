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
  const rl = checkRateLimit(`${ip}:asks:get`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ completed: false }, { status: 200 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ completed: false }, { status: 200 })
  }

  const [profile, survey] = await Promise.all([
    db.userProfile.findUnique({
      where: { userId: user.id },
      select: { asksCompleted: true, onboardingCompleted: true },
    }),
    db.userSurvey.findUnique({
      where: { userId: user.id },
      select: { answers: true },
    }),
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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

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

  await db.userProfile.upsert({
    where: { userId: user.id },
    update: { asksCompleted: true, askedAt: new Date() },
    create: { userId: user.id, asksCompleted: true, askedAt: new Date() },
  })

  if (answers) {
    await db.userSurvey.upsert({
      where: { userId: user.id },
      update: { answers },
      create: { userId: user.id, answers },
    })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
