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
  const localOnboardingKey = "yuthasas:onboarding"

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
        try {
          const raw = localStorage.getItem(localOnboardingKey)
          if (raw) {
            const local = JSON.parse(raw) as {
              answers?: Record<number, string | string[]>
              tier?: string
            }
            const answers = local?.answers
            if (answers && typeof answers === "object") {
              const scale = toAnswerString(answers[1])
              const type = toAnswerString(answers[2])
              const stress = toAnswerString(answers[3])
              if (scale) setBusinessScale(scale)
              if (type) setBusinessType(type)
              if (stress) setFinancialStress(stress)
            }
            if (local?.tier) setTier(local.tier)
            setShowOnboarding("hide")
            return
          }
        } catch {
          // ignore local parse errors
        }
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
    const promoActiveNow = isPromoActive()
    const selectedPremiumDuringPromo = selectedPlan === "Premium" && promoActiveNow
    setTier(selectedPremiumDuringPromo ? "Premium" : selectedPlan)

    // Optimistic local persistence so onboarding is one-time even if DB is briefly unavailable.
    try {
      localStorage.setItem(
        localOnboardingKey,
        JSON.stringify({
          answers,
          tier: selectedPlan,
          ts: Date.now(),
        })
      )
    } catch {
      // ignore storage failures
    }

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
        // Fallback: let user proceed and keep trying in the background.
        setOnboardingError("Database temporarily unavailable. Continuing with local data.")
        if (selectedPremiumDuringPromo) {
          setTier("Premium")
        } else {
          setTier("Free")
        }
        setShowOnboarding("hide")
        window.setTimeout(async () => {
          await fetch("/api/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
          }).catch(() => null)
        }, 2500)
        return
      }
      if (data?.isPremium) {
        setTier("Premium")
      } else if (selectedPremiumDuringPromo) {
        // During promo window, selecting Premium should unlock Premium immediately.
        setTier("Premium")
      } else if (!promoActiveNow && selectedPlan === "Premium") {
        setTier("Free")
        window.location.href = "/Enterprise?payway=1"
      } else {
        setTier("Free")
      }
    } catch {
      setOnboardingError("Database temporarily unavailable. Continuing with local data.")
      setShowOnboarding("hide")
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
