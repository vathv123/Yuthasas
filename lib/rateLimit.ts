type Entry = { count: number; resetAt: number }

const getStore = (): Map<string, Entry> => {
  const g = globalThis as unknown as { __rateLimit?: Map<string, Entry> }
  if (!g.__rateLimit) g.__rateLimit = new Map()
  return g.__rateLimit
}

export const getRequestIP = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()
  return "unknown"
}

export const checkRateLimit = (key: string, limit = 60, windowMs = 60_000) => {
  const store = getStore()
  const now = Date.now()
  const entry = store.get(key)
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs }
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt }
  }
  entry.count += 1
  store.set(key, entry)
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

