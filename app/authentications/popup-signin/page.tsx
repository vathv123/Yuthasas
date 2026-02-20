"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"

export default function PopupSignin() {
  useEffect(() => {
    const callbackUrl =
      new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("callbackUrl") ||
      "/Enterprise"
    signIn("google", { callbackUrl, redirect: true }).catch(() => null)
  }, [])

  return (
    <div className="flex h-screen items-center justify-center font-[Gilroy-Medium] text-black/60">
      Redirecting to Google...
    </div>
  )
}
