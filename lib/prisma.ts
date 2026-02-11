import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const isMysqlUrl = (value: string) => value.startsWith("mysql://")

const withMysqlDefaults = (url: string) => {
  if (!isMysqlUrl(url)) return url
  try {
    const parsed = new URL(url)
    if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", "1")
    if (!parsed.searchParams.has("connect_timeout")) parsed.searchParams.set("connect_timeout", "30")
    if (!parsed.searchParams.has("pool_timeout")) parsed.searchParams.set("pool_timeout", "30")
    if (!parsed.searchParams.has("sslaccept")) parsed.searchParams.set("sslaccept", "strict")
    return parsed.toString()
  } catch {
    return url
  }
}

const isClosedConnectionError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return normalized.includes("server has closed the connection") || (normalized.includes("connection") && normalized.includes("closed"))
}

const createClient = () => {
  const datasourceUrl = process.env.DATABASE_URL ? withMysqlDefaults(process.env.DATABASE_URL) : undefined
  const client = new PrismaClient({
    log: ["error", "warn"],
    ...(datasourceUrl ? { datasourceUrl } : {}),
  })

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          try {
            return await query(args)
          } catch (error) {
            if (!isClosedConnectionError(error)) {
              throw error
            }
            await client.$disconnect().catch(() => null)
            await client.$connect().catch(() => null)
            return query(args)
          }
        },
      },
    },
  }) as PrismaClient
}

const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
