type LocalUser = {
  id: string
  email: string
  name?: string
  passwordHash?: string
  emailVerified?: Date
}

type LocalSignupEvent = {
  email: string
  ip: string
  deviceHash: string
  userAgent?: string
}

type LocalOnboarding = {
  completed: boolean
  answers: Record<number, string | string[]>
  isPremium: boolean
  onboardingAt: Date
}

type LocalBusiness = {
  businessName?: string | null
  businessType?: string | null
  businessScale?: string | null
  financialStress?: string | null
  items?: unknown
  costs?: unknown
}

type LocalPayment = {
  tranId: string
  email: string
  status: string
  rawRequest?: unknown
  rawResponse?: unknown
}

const g = globalThis as unknown as {
  __localUsers?: Map<string, LocalUser>
  __localEvents?: LocalSignupEvent[]
  __localOnboarding?: Map<string, LocalOnboarding>
  __localBusiness?: Map<string, LocalBusiness>
  __localPayments?: Map<string, LocalPayment>
}

const users = g.__localUsers ?? new Map<string, LocalUser>()
const events = g.__localEvents ?? []
const onboarding = g.__localOnboarding ?? new Map<string, LocalOnboarding>()
const business = g.__localBusiness ?? new Map<string, LocalBusiness>()
const payments = g.__localPayments ?? new Map<string, LocalPayment>()

if (!g.__localUsers) g.__localUsers = users
if (!g.__localEvents) g.__localEvents = events
if (!g.__localOnboarding) g.__localOnboarding = onboarding
if (!g.__localBusiness) g.__localBusiness = business
if (!g.__localPayments) g.__localPayments = payments

const newId = () => `local_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`

export const localStore = {
  getUserById(id: string) {
    for (const user of users.values()) {
      if (user.id === id) return user
    }
    return null
  },
  getUserByEmail(email: string) {
    return users.get(email.toLowerCase()) ?? null
  },
  upsertUser(input: { email: string; name?: string; passwordHash?: string; emailVerified?: Date }) {
    const email = input.email.toLowerCase()
    const existing = users.get(email)
    if (existing) {
      const next: LocalUser = {
        ...existing,
        name: input.name ?? existing.name,
        passwordHash: input.passwordHash ?? existing.passwordHash,
        emailVerified: input.emailVerified ?? existing.emailVerified,
      }
      users.set(email, next)
      return next
    }
    const created: LocalUser = {
      id: newId(),
      email,
      name: input.name,
      passwordHash: input.passwordHash,
      emailVerified: input.emailVerified,
    }
    users.set(email, created)
    return created
  },
  getUsersByName(name: string) {
    const wanted = name.trim().toLowerCase()
    return [...users.values()].filter((u) => String(u.name ?? "").trim().toLowerCase() === wanted)
  },
  deleteUserByEmail(email: string) {
    const normalized = email.toLowerCase()
    users.delete(normalized)
    onboarding.delete(normalized)
    business.delete(normalized)
    const kept = events.filter((event) => event.email.toLowerCase() !== normalized)
    events.length = 0
    events.push(...kept)
  },
  addSignupEvent(event: LocalSignupEvent) {
    events.push(event)
  },
  getSignupAccounts(ip: string, deviceHash: string) {
    const set = new Set(
      events
        .filter((e) => e.ip === ip && e.deviceHash === deviceHash)
        .map((e) => e.email.toLowerCase())
    )
    return [...set.values()].sort()
  },
  setOnboarding(email: string, data: LocalOnboarding) {
    onboarding.set(email.toLowerCase(), data)
  },
  getOnboarding(email: string) {
    return onboarding.get(email.toLowerCase()) ?? null
  },
  premiumCount() {
    let count = 0
    for (const value of onboarding.values()) {
      if (value.isPremium) count += 1
    }
    return count
  },
  getBusiness(email: string) {
    return business.get(email.toLowerCase()) ?? null
  },
  setBusiness(email: string, data: LocalBusiness) {
    business.set(email.toLowerCase(), data)
  },
  setPayment(data: LocalPayment) {
    payments.set(data.tranId, data)
  },
  getPayment(tranId: string) {
    return payments.get(tranId) ?? null
  },
  getPaymentForEmail(tranId: string, email: string) {
    const payment = payments.get(tranId)
    if (!payment) return null
    return payment.email === email.toLowerCase() ? payment : null
  },
  updatePayment(tranId: string, data: Partial<LocalPayment>) {
    const existing = payments.get(tranId)
    if (!existing) return null
    const next = { ...existing, ...data }
    payments.set(tranId, next)
    return next
  },
}
