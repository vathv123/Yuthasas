import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

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
      // Keep OAuth callback DB-free so transient DB failures cannot break login.
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
      return `${baseUrl}/Enterprise`
    },
  },
}
