import { NextResponse } from "next/server"
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

const parseBody = async (request: Request) => {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return await request.json()
  }
  const text = await request.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    const params = new URLSearchParams(text)
    return Object.fromEntries(params.entries())
  }
}

const extractTranId = (payload: Record<string, unknown>) => {
  return (
    (payload.tran_id as string) ||
    (payload.tranId as string) ||
    (payload.transaction_id as string) ||
    (payload.merchant_ref as string) ||
    ""
  )
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

export async function POST(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:payway:callback`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }
  let payload: Record<string, unknown> = {}
  try {
    payload = (await parseBody(request)) as Record<string, unknown>
  } catch {
    payload = {}
  }

  const tranId = extractTranId(payload)
  if (!tranId) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const db = prisma as any
  const payment = await db.payment.findUnique({ where: { tranId } })
  if (!payment) {
    return NextResponse.json({ ok: true }, { status: 200 })
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
    payload.payment_status ||
    payload.status ||
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
      rawResponse: verifyResult ?? (payload as unknown as object),
    },
  })

  if (isApproved) {
    await db.userProfile.upsert({
      where: { userId: payment.userId },
      update: { isPremium: true, premiumSince: new Date(), premiumSource: "payway" },
      create: {
        userId: payment.userId,
        isPremium: true,
        premiumSince: new Date(),
        premiumSource: "payway",
      },
    })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
