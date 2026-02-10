import { NextResponse } from "next/server"

export const isSameOrigin = (request: Request) => {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  const base =
    process.env.NEXTAUTH_URL ??
    (request.url ? new URL(request.url).origin : "")

  if (!origin && !referer) return true
  if (origin && base && origin.startsWith(base)) return true
  if (referer && base && referer.startsWith(base)) return true
  return false
}

export const rejectIfNotSameOrigin = (request: Request) => {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 })
  }
  return null
}

