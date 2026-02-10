import crypto from "crypto"

type PaywayParams = Record<string, string | number | null | undefined>

const pad = (n: number) => String(n).padStart(2, "0")

export const toReqTime = (date = new Date()) =>
  [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("")

const toStringValue = (value: PaywayParams[string]) => {
  if (value === null || value === undefined) return ""
  return String(value)
}

export const buildHashString = (params: PaywayParams, order?: string[], mode: "concat" | "kv" = "concat") => {
  const keys = order && order.length > 0 ? order : Object.keys(params).sort()
  if (mode === "kv") {
    return keys.map((key) => `${key}=${toStringValue(params[key])}`).join("&")
  }
  return keys.map((key) => toStringValue(params[key])).join("")
}

export const signHash = (hashString: string, publicKey: string, encoding: "base64" | "hex" = "base64") => {
  return crypto.createHmac("sha512", publicKey).update(hashString).digest(encoding)
}

export const signWithRsa = (
  hashString: string,
  privateKey: string,
  encoding: "base64" | "hex" = "base64",
  algorithm: "RSA-SHA256" | "RSA-SHA512" = "RSA-SHA256"
) => {
  const sign = crypto.createSign(algorithm)
  sign.update(hashString)
  sign.end()
  return sign.sign(privateKey, encoding)
}

export const toBase64 = (value: string) => Buffer.from(value, "utf8").toString("base64")
