type DeleteOtpEntry = {
  email: string
  code: string
  ip: string
  expiresAt: number
  attempts: number
}

const TTL_MS = 10 * 60_000
const MAX_ATTEMPTS = 5

const getStore = () => {
  const g = globalThis as unknown as { __deleteOtpStore?: Map<string, DeleteOtpEntry> }
  if (!g.__deleteOtpStore) g.__deleteOtpStore = new Map<string, DeleteOtpEntry>()
  return g.__deleteOtpStore
}

const keyFor = (email: string) => email.trim().toLowerCase()

export const issueDeleteOtp = (input: { email: string; ip: string }) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const now = Date.now()
  const key = keyFor(input.email)
  getStore().set(key, {
    email: key,
    code,
    ip: input.ip,
    expiresAt: now + TTL_MS,
    attempts: 0,
  })
  return { code, expiresAt: now + TTL_MS }
}

export const verifyDeleteOtp = (input: { email: string; ip: string; code: string }) => {
  const key = keyFor(input.email)
  const store = getStore()
  const entry = store.get(key)
  if (!entry) return { ok: false as const, reason: "missing" as const }
  if (entry.ip !== input.ip) return { ok: false as const, reason: "ip_mismatch" as const }
  if (entry.expiresAt < Date.now()) {
    store.delete(key)
    return { ok: false as const, reason: "expired" as const }
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key)
    return { ok: false as const, reason: "locked" as const }
  }
  if (entry.code !== input.code.trim()) {
    entry.attempts += 1
    store.set(key, entry)
    return { ok: false as const, reason: "invalid" as const }
  }
  store.delete(key)
  return { ok: true as const, email: entry.email }
}

