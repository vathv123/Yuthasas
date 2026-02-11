import { createHash } from "crypto"

export const getUserAgent = (request: Request) =>
  request.headers.get("user-agent")?.trim() ?? "unknown"

export const getDeviceHash = (request: Request) => {
  const ua = getUserAgent(request)
  const secUa = request.headers.get("sec-ch-ua") ?? ""
  const lang = request.headers.get("accept-language") ?? ""
  return createHash("sha256").update(`${ua}|${secUa}|${lang}`).digest("hex")
}

