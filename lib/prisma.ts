import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const isMysqlUrl = (value: string) => value.startsWith("mysql://")

const withMysqlDefaults = (url: string) => {
  if (!isMysqlUrl(url)) return url
  try {
    const parsed = new URL(url)
    // Keep defaults conservative for serverless MySQL without forcing SSL modes
    // that may close connections on some managed providers.
    if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", "5")
    if (!parsed.searchParams.has("connect_timeout")) parsed.searchParams.set("connect_timeout", "15")
    if (!parsed.searchParams.has("pool_timeout")) parsed.searchParams.set("pool_timeout", "15")
    return parsed.toString()
  } catch {
    return url
  }
}

const createClient = () => {
  const datasourceUrl = process.env.DATABASE_URL ? withMysqlDefaults(process.env.DATABASE_URL) : undefined
  return new PrismaClient({
    log: ["error", "warn"],
    ...(datasourceUrl ? { datasourceUrl } : {}),
  })
}

const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
