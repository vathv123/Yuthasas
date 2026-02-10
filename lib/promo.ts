export const PROMO_END_AT = new Date("2026-04-04T00:00:00Z")

export const isPromoActive = (now: Date = new Date()) =>
  now.getTime() < PROMO_END_AT.getTime()

