"use client"

import { useState } from "react"

interface PricingPlan {
  name: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
}

interface PricingProps {
  onNext?: (tier: string) => void
  onClose?: () => void
}

const Pricing = ({ onNext = () => {}, onClose = () => {} }: PricingProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const plans: PricingPlan[] = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      features: [
        "Basic business analytics",
        "Up to 1 location",
        "Email support",
        "Monthly reports"
      ]
    },
    {
      name: "Premium",
      price: "$29",
      period: "Per month",
      features: [
        "Advanced analytics",
        "Up to 5 locations",
        "Priority support",
        "Real-time reports",
        "Custom branding",
        "Team collaboration"
      ],
      highlighted: true
    },
  ]

  return (
    <div className="w-full h-screen flex justify-center items-center fixed z-50 bg-[#ffffffef] backdrop-blur-[12px]">
      <div className="w-full px-4 bg-transparent justify-center items-center flex fixed flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="flex flex-col gap-2 items-center mb-12">
          <p className="text-[32px] font-bold">Simple, Transparent Pricing</p>
          <p className="text-[#888888] text-[16px]">Choose the perfect plan for your business</p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-wrap gap-6 justify-center max-w-[1200px] mb-12">
          {plans.map((plan: PricingPlan, index: number) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-[300px] rounded-2xl p-8 transition-all cursor-pointer ${
                selectedIndex === index
                  ? "ring-2 ring-black"
                  : ""
              } ${
                plan.highlighted
                  ? "bg-black text-white shadow-lg scale-105"
                  : "bg-white text-black border border-[#e0e0e0] hover:border-[#888888]"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-green-500 text-white text-[12px] font-semibold px-3 py-1 rounded-full w-fit mb-4">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-[20px] font-semibold mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <p className="text-[36px] font-bold">{plan.price}</p>
                <p className={`text-[14px] ${plan.highlighted ? "text-gray-300" : "text-[#888888]"}`}>
                  {plan.period}
                </p>
              </div>

              <button
                onClick={() => setSelectedIndex(index)}
                className={`w-full py-3 rounded-lg font-semibold mb-6 transition-colors ${
                  plan.highlighted
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-[#f0f0f0] text-black hover:bg-[#e0e0e0]"
                }`}
              >
                Get Started
              </button>

              <div className="flex flex-col gap-3">
                {plan.features.map((feature: string, i: number) => (
                  <div key={i} className="flex gap-2 items-start">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill={plan.highlighted ? "#4ade80" : "#22c55e"}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-[14px] ${plan.highlighted ? "text-gray-200" : "text-[#666666]"}`}>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-[#d0cccc] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium"
          >
            Skip
          </button>
          <button
            onClick={() => onNext(plans[selectedIndex ?? 0].name)}
            disabled={selectedIndex === null}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pricing
