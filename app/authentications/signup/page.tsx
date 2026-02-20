"use client"

import { useEffect, useMemo } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const Signup = () => {
  const router = useRouter()
  const { status } = useSession()
  const errorCode =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("error") : null

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/Enterprise")
    }
  }, [status, router])

  const authError = useMemo(() => {
    const error = errorCode
    if (!error) return ""
    if (error === "OAuthCallback") return "Unable to sign in with Google. Please try again."
    if (error === "AccessDenied") return "Access denied by Google."
    return "Sign in failed. Please try again."
  }, [errorCode])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 font-[Gilroy-Medium]">
      <div className="w-full max-w-[420px] rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="text-3xl text-black">Sign In</h1>
        <p className="mt-2 text-sm text-black/60">
          Continue with Google. Your session is JWT-based and runs without database dependency.
        </p>

        {authError ? <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{authError}</p> : null}

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/Enterprise", redirect: true })}
          className="mt-6 flex h-[50px] w-full items-center justify-center gap-3 rounded-2xl border border-black/20 bg-white text-[16px] text-black hover:bg-black/[0.02]"
        >
          <img src="/image/Google.png" alt="Google" className="h-6 w-6" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  )
}

export default Signup
