import { NextResponse } from "next/server"

export const isSameOrigin = (request: Request) => {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  const runtimeOrigin = request.url ? new URL(request.url).origin : ""
  const configuredOrigin = process.env.NEXTAUTH_URL ?? ""
  const allowedOrigins = [runtimeOrigin, configuredOrigin].filter(Boolean)

  if (!origin && !referer) return true
  if (origin && allowedOrigins.some((allowed) => origin.startsWith(allowed))) return true
  if (referer && allowedOrigins.some((allowed) => referer.startsWith(allowed))) return true
  return false
}

export const rejectIfNotSameOrigin = (request: Request) => {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 })
  }
  return null
}
