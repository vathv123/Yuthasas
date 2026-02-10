"use client"

import { useState } from "react"
import Pricing from "./pricing"
import Biz from "./biz"

type FlowStep = "asks" | "pricing" | "biz"

interface OnboardingFlowProps {
  bizType?: string
}

const OnboardingFlow = ({ bizType: initialBizType }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>("pricing")
  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, string>>({})
  const [selectedTier, setSelectedTier] = useState("Free")
  const [isFlowComplete, setIsFlowComplete] = useState(false)

  const handlePricingNext = (tier: string) => {
    setSelectedTier(tier)
    setCurrentStep("biz")
  }

  const handlePricingClose = () => {
    setIsFlowComplete(true)
  }

  const handleBizClose = () => {
    setIsFlowComplete(true)
  }

  const businessScale = surveyAnswers[1] || "Small"
  const businessType = surveyAnswers[2] || "General"
  const financialStress = surveyAnswers[3] || "Moderate"

  if (isFlowComplete) {
    return null
  }

  return (
    <>
      {currentStep === "pricing" && (
        <Pricing onNext={(tier: string) => handlePricingNext(tier)} onClose={handlePricingClose} />
      )}
      
      {currentStep === "biz" && (
        <div className="w-full relative">
          {/* Semi-transparent overlay with close button */}
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={handleBizClose}
              className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-md transition-colors cursor-pointer"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <Biz businessType={businessType} businessScale={businessScale} financialStress={financialStress} tier={selectedTier} />
        </div>
      )}
    </>
  )
}

export default OnboardingFlow
