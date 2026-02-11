"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, useSession } from "next-auth/react"
import Businesses from "../Businesses"
import PopupHandler from "./PopupHandler"

export default function Page() {
  const { status } = useSession()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [forceOnboarding, setForceOnboarding] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setForceOnboarding(params.get("edit") === "1")
  }, [])

  useEffect(() => {
    let active = true
    const check = async () => {
      if (status === "authenticated") {
        setAuthChecked(true)
        return
      }
      if (status === "loading") return
      // give the session a brief grace period to hydrate
      const session = await getSession()
      if (!active) return
      if (session) {
        setAuthChecked(true)
        return
      }
      setTimeout(async () => {
        const sessionAgain = await getSession()
        if (!active) return
        if (!sessionAgain) {
          router.replace("/authentications/signup")
          return
        }
        setAuthChecked(true)
      }, 1200)
    }
    check()
    return () => {
      active = false
    }
  }, [status, router])

  if (status === "loading" || !authChecked) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-[Gilroy-Medium] text-slate-500">
        Loading...
      </div>
    )
  }

  return (
    <>
      <PopupHandler />
      {status === "authenticated" && <Businesses forceOnboarding={forceOnboarding} />}
    </>
  )
}
