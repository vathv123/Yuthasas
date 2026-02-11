import prisma from "@/lib/prisma"

const isClosedConnectionError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    normalized.includes("server has closed the connection") ||
    normalized.includes("connection") && normalized.includes("closed")
  )
}

export async function withPrismaRetry<T>(operation: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && isClosedConnectionError(error)) {
      await prisma.$disconnect().catch(() => null)
      await prisma.$connect().catch(() => null)
      return withPrismaRetry(operation, retries - 1)
    }
    throw error
  }
}
