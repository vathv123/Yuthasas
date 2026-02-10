import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { buildHashString, signHash, toReqTime } from "@/lib/payway"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"

export const runtime = "nodejs"

const getPaywayConfig = () => {
  const merchantId = process.env.PAYWAY_MERCHANT_ID
  const publicKey = process.env.PAYWAY_PUBLIC_KEY
  const baseUrl =
    process.env.PAYWAY_API_URL ??
    "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments"
  const hashMode = (process.env.PAYWAY_HASH_MODE as "concat" | "kv") ?? "concat"

  if (!merchantId || !publicKey) {
    throw new Error("Missing PayWay configuration")
  }

  return { merchantId, publicKey, baseUrl, hashMode }
}

const checkTransaction = async (tranId: string) => {
  const config = getPaywayConfig()
  const reqTime = toReqTime()
  const params = {
    req_time: reqTime,
    merchant_id: config.merchantId,
    tran_id: tranId,
  }
  const hashString = buildHashString(params, ["req_time", "merchant_id", "tran_id"], config.hashMode)
  const hash = signHash(hashString, config.publicKey)
  const response = await fetch(`${config.baseUrl}/check-transaction-2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, hash }),
  })
  return response.json().catch(() => ({}))
}

export async function GET(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:payway:status`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tranId = searchParams.get("tran_id")
  if (!tranId) {
    return NextResponse.json({ ok: false, error: "Missing tran_id" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const db = prisma as any
  const payment = await db.payment.findFirst({
    where: { tranId, userId: user.id },
  })

  if (!payment) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  let verifyResult: any = null
  try {
    verifyResult = await checkTransaction(tranId)
  } catch {
    verifyResult = null
  }

  const paymentStatus =
    verifyResult?.data?.payment_status ||
    verifyResult?.data?.paymentStatus ||
    payment.status ||
    "PENDING"

  const isApproved =
    paymentStatus === "APPROVED" ||
    paymentStatus === "SUCCESS" ||
    paymentStatus === "PAID" ||
    verifyResult?.status?.code === "00"

  await db.payment.update({
    where: { tranId },
    data: {
      status: isApproved ? "APPROVED" : String(paymentStatus),
      rawResponse: verifyResult ?? payment.rawResponse,
    },
  })

  if (isApproved) {
    await db.userProfile.upsert({
      where: { userId: user.id },
      update: { isPremium: true, premiumSince: new Date(), premiumSource: "payway" },
      create: {
        userId: user.id,
        isPremium: true,
        premiumSince: new Date(),
        premiumSource: "payway",
      },
    })
  }

  return NextResponse.json(
    {
      ok: true,
      status: isApproved ? "APPROVED" : String(paymentStatus),
    },
    { status: 200 }
  )
}
