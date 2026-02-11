type OtpEntry = {
  email: string
  name: string
  passwordHash: string
  code: string
  expiresAt: number
  attempts: number
}

const OTP_TTL_MS = 10 * 60_000
const MAX_ATTEMPTS = 5

const getStore = () => {
  const g = globalThis as unknown as { __otpStore?: Map<string, OtpEntry> }
  if (!g.__otpStore) g.__otpStore = new Map<string, OtpEntry>()
  return g.__otpStore
}

const keyForEmail = (email: string) => email.trim().toLowerCase()

export const issueOtp = (input: { email: string; name: string; passwordHash: string }) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const now = Date.now()
  const key = keyForEmail(input.email)

  getStore().set(key, {
    email: key,
    name: input.name,
    passwordHash: input.passwordHash,
    code,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
  })

  return { code, expiresAt: now + OTP_TTL_MS }
}

export const verifyOtp = (input: { email: string; code: string }) => {
  const key = keyForEmail(input.email)
  const store = getStore()
  const entry = store.get(key)

  if (!entry) {
    return { ok: false as const, reason: "missing" as const }
  }

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
  return {
    ok: true as const,
    email: entry.email,
    name: entry.name,
    passwordHash: entry.passwordHash,
  }
}
