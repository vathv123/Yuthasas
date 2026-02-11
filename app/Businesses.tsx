"use client"
import { useEffect, useState } from "react"
import OnboardingModal from "./components/OnboardingModal"
import Biz from "./components/biz"
import { useSession } from "next-auth/react"
import { isPromoActive } from "@/lib/promo"

const Businesses = ({ forceOnboarding = false }: { forceOnboarding?: boolean }) => {
  const { status, data: session } = useSession()
  const [showOnboarding, setShowOnboarding] = useState<"unknown" | "show" | "hide">("unknown")
  const [businessScale, setBusinessScale] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [financialStress, setFinancialStress] = useState("")
  const [tier, setTier] = useState("Free")
  const [onboardingError, setOnboardingError] = useState("")

  const toAnswerString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value.join(", ") : (value || "")

  useEffect(() => {
    if (status !== "authenticated") return
    if (forceOnboarding) {
      setShowOnboarding("show")
      return
    }
    const loadStatus = async () => {
      try {
        const email = session?.user?.email?.trim().toLowerCase()
        if (email) {
          const limitRes = await fetch(`/api/auth/register/device-limit?email=${encodeURIComponent(email)}`, {
            method: "GET",
          })
          const limitData = await limitRes.json().catch(() => null)
          if (limitRes.ok && limitData?.blocked) {
            // Do not leave the page in an unresolved state.
            // Account limiting is enforced during signup/signin flows.
            setShowOnboarding("show")
          }
        }

        await fetch("/api/auth/register/device-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }).catch(() => null)

        const res = await fetch("/api/onboarding", { method: "GET" })
        const data = await res.json()
        const answers = data?.answers && typeof data.answers === "object" ? (data.answers as Record<number, string | string[]>) : null
        if (answers) {
          const scale = toAnswerString(answers[1])
          const type = toAnswerString(answers[2])
          const stress = toAnswerString(answers[3])
          if (scale) setBusinessScale(scale)
          if (type) setBusinessType(type)
          if (stress) setFinancialStress(stress)
        }
        if (data?.isPremium) {
          setTier("Premium")
        } else if (answers) {
          const answerTier = toAnswerString(answers[4])
          if (answerTier) setTier(answerTier)
        }
        setShowOnboarding(data.completed ? "hide" : "show")
      } catch {
        setShowOnboarding("show")
      }
    }
    loadStatus()
  }, [status, session?.user?.email, forceOnboarding])

  const handleOnboardingComplete = async (answers: Record<number, string | string[]>) => {
    setOnboardingError("")
    setBusinessScale(toAnswerString(answers[1]))
    setBusinessType(toAnswerString(answers[2]))
    setFinancialStress(toAnswerString(answers[3]))
    const selectedPlan = toAnswerString(answers[4]) || "Free"
    setTier(selectedPlan === "Premium" ? "Free" : selectedPlan)
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }).catch(() => null)
    try {
      if (!res) {
        setOnboardingError("Unable to save onboarding. Please try again.")
        setShowOnboarding("show")
        return
      }
      const raw = await res.text()
      let data: any = null
      try {
        data = raw ? JSON.parse(raw) : null
      } catch {
        data = { error: raw || "Unable to save onboarding. Please try again." }
      }
      if (!res?.ok) {
        setOnboardingError(data?.error || "Unable to save onboarding. Please try again.")
        setShowOnboarding("show")
        return
      }
      if (data?.isPremium) {
        setTier("Premium")
      } else if (selectedPlan === "Premium" && isPromoActive()) {
        setTier("Free")
        setOnboardingError("Premium slot not granted. Please try again.")
      } else if (!isPromoActive() && selectedPlan === "Premium") {
        setTier("Free")
        window.location.href = "/Enterprise?payway=1"
      } else {
        setTier("Free")
      }
    } catch {
      setOnboardingError("Unable to save onboarding. Please try again.")
      setShowOnboarding("show")
      return
    }
    setShowOnboarding("hide")
  }

  return (
    <>
      {showOnboarding === "show" && status === "authenticated" && (
        <>
          <OnboardingModal onComplete={handleOnboardingComplete} />
          {onboardingError ? (
            <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700 font-[Gilroy-Medium]">
              {onboardingError}
            </div>
          ) : null}
        </>
      )}
      {showOnboarding === "hide" && (
        <Biz businessScale={businessScale} businessType={businessType} financialStress={financialStress} tier={tier} />
      )}
      {showOnboarding === "unknown" && status === "authenticated" && (
        <div className="min-h-[50vh] flex items-center justify-center text-black/60 font-[Gilroy-Medium]">
          Loading your workspace...
        </div>
      )}
    </>
  )
}

export default Businesses
