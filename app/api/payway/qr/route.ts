import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { signHash, toBase64, toReqTime } from "@/lib/payway"
import { isPromoActive } from "@/lib/promo"
import { checkRateLimit, getRequestIP } from "@/lib/rateLimit"

export const runtime = "nodejs"

const getPaywayConfig = () => {
  const merchantId = process.env.PAYWAY_MERCHANT_ID
  const apiKey = process.env.PAYWAY_API_KEY
  const qrUrl =
    process.env.PAYWAY_QR_URL ??
    "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr"
  const callbackUrl =
    process.env.PAYWAY_CALLBACK_URL ??
    (process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/payway/callback` : "")
  const currency = process.env.PAYWAY_CURRENCY ?? "USD"
  const paymentOption = process.env.PAYWAY_PAYMENT_OPTION ?? "abapay_khqr"
  const qrTemplate = process.env.PAYWAY_QR_TEMPLATE ?? "template3_color"
  const amount = Number(process.env.PAYWAY_PREMIUM_AMOUNT ?? "4.99")

  if (!merchantId || !apiKey || !callbackUrl) {
    throw new Error("Missing PayWay configuration")
  }

  return {
    merchantId,
    apiKey,
    qrUrl,
    callbackUrl,
    currency,
    paymentOption,
    qrTemplate,
    amount,
  }
}

export async function POST(request: Request) {
  const ip = getRequestIP(request)
  const rl = checkRateLimit(`${ip}:payway:qr`, 10, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true },
  })

  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 })
  }

  if (!isPromoActive()) {
    return NextResponse.json(
      { ok: false, error: "Premium is coming soon. Please check back later." },
      { status: 409 }
    )
  }

  const db = prisma as any
  const existingPremium = await db.userProfile.findUnique({
    where: { userId: user.id },
    select: { isPremium: true },
  })

  if (existingPremium?.isPremium) {
    return NextResponse.json({ ok: false, error: "Already premium." }, { status: 409 })
  }

  const premiumCount = await db.userProfile.count({
    where: { isPremium: true },
  })
  if (premiumCount >= 100) {
    return NextResponse.json(
      { ok: false, error: "Premium beta is full. Please wait for the next release." },
      { status: 403 }
    )
  }

  let config
  try {
    config = getPaywayConfig()
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }

  const reqTime = toReqTime()
  const tranId = `${reqTime}${Math.floor(10 + Math.random() * 90)}`
  const sanitizeName = (value: string) => value.replace(/[^\x20-\x7E]/g, "").trim()
  const [rawFirstName, ...lastParts] = (user.name || "Customer").split(" ")
  const firstName = sanitizeName(rawFirstName) || "Customer"
  const lastName = sanitizeName(lastParts.join(" ")) || "User"

  const amountValue = Number(config.amount.toFixed(2))
  const amountForHash = amountValue.toFixed(2)

  const itemsJson = JSON.stringify([
    { name: "Premium Plan", quantity: 1, price: amountForHash },
  ])

  const payload = {
    req_time: reqTime,
    merchant_id: config.merchantId,
    tran_id: tranId,
    first_name: firstName,
    last_name: lastName,
    email: user.email ?? "",
    phone: "012345678",
    amount: amountValue,
    purchase_type: "purchase",
    payment_option: config.paymentOption,
    items: toBase64(itemsJson),
    currency: config.currency,
    callback_url: toBase64(config.callbackUrl),
    return_deeplink: "",
    custom_fields: "",
    return_params: "",
    payout: "",
    lifetime: 6,
    qr_image_template: config.qrTemplate,
  }

  const hashOrder = [
    "req_time",
    "merchant_id",
    "tran_id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "amount",
    "purchase_type",
    "payment_option",
    "items",
    "currency",
    "callback_url",
    "return_deeplink",
    "custom_fields",
    "return_params",
    "payout",
    "lifetime",
    "qr_image_template",
  ]

  const hashString = hashOrder
    .map((key) => {
      const value = (payload as Record<string, unknown>)[key]
      if (key === "amount") return amountForHash
      if (value === null || value === undefined) return ""
      return String(value)
    })
    .join("")

  const hash = signHash(hashString, config.apiKey)

  const response = await fetch(config.qrUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, hash }),
  })

  const rawText = await response.text()
  let data: any = {}
  try {
    data = rawText ? JSON.parse(rawText) : {}
  } catch {
    data = { raw: rawText }
  }

  const qrString = data?.qr_string ?? data?.qrString ?? null
  const qrImage = data?.qr_image ?? data?.qrImage ?? null

  await db.payment.create({
    data: {
      userId: user.id,
      provider: "payway",
      plan: "premium",
      tranId,
      amount: config.amount,
      currency: config.currency,
      status: "PENDING",
      qrString,
      qrImage,
      rawRequest: payload as unknown as object,
      rawResponse: data as unknown as object,
    },
  })

  return NextResponse.json(
    {
      ok: response.ok,
      tran_id: tranId,
      qr_string: qrString,
      qr_image: qrImage,
      message: data?.status?.message ?? data?.message ?? data?.raw ?? null,
      debug: response.ok || process.env.NODE_ENV === "production"
        ? undefined
        : { payload, requestUrl: config.qrUrl, hashString },
    },
    { status: response.ok ? 200 : 400 }
  )
}
