import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./prisma"
import { verifyPassword } from "./password"
import { withPrismaRetry } from "./prismaRetry"

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/authentications/signup",
    error: "/authentications/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase()
        const password = String(credentials?.password ?? "")
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) return null
        const valid = verifyPassword(password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true
      const email = String(user?.email ?? "").trim().toLowerCase()
      if (!email) return false

      const db = prisma as any
      const savedUser = await withPrismaRetry<any>(
        () =>
          db.user.upsert({
            where: { email },
            update: {
              name: user?.name ? String(user.name).trim() : undefined,
              emailVerified: new Date(),
            },
            create: {
              email,
              name: user?.name ? String(user.name).trim() : "User",
              emailVerified: new Date(),
            },
          }),
        1
      )

      ;(user as { id?: string }).id = String(savedUser.id)
      return true
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        ;(session.user as { id?: string }).id = token.sub
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      try {
        const target = new URL(url)
        if (target.origin === baseUrl) return url
      } catch {
        // ignore and fallback
      }
      return `${baseUrl}/authentications/signup`
    },
  },
}
