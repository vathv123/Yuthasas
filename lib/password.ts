import { randomBytes, scryptSync, timingSafeEqual } from "crypto"

const KEY_LEN = 64

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex")
  return `${salt}:${hash}`
}

export const verifyPassword = (password: string, stored: string) => {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const derived = scryptSync(password, salt, KEY_LEN)
  const storedHash = Buffer.from(hash, "hex")
  if (storedHash.length !== derived.length) return false
  return timingSafeEqual(storedHash, derived)
}

