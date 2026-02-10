"use client"

import { useState } from "react"

type Step = 0 | 1 | 2

const questions = [
  {
    id: 1,
    question: "What is the size classification of your current Organization?",
    options: ["Sole Proprietorship / Micro Business", "Small-Scale Enterprise", "Mid-Size Enterprise", "Large-Scale Corporate"]
  },
  {
    id: 2,
    question: "What is your business type?",
    options: ["Food & Beverage", "Retail / Trading", "Services", "Manufacturing", "Other"]
  },
  {
    id: 3,
    question: "Do you often feel overwhelmed by disorganized finances?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
  }
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever",
    features: ["Basic calculation", "Quick & Time savings", "Limited 3/day"],
    // Free tier locks analysis, report, and exports except PNG
    lockedFeatures: ["analysis", "report", "export_json", "export_csv", "export_excel", "export_docx", "export_pdf"]
  },
  {
    name: "Premium",
    price: "$37.78",
    period: "Per year",
    features: ["Advanced analytics", "Unlimited calculations", "Priority support"],
    highlighted: true,
    lockedFeatures: []
  }
]

interface OnboardingModalProps {
  onComplete?: (answers: Record<number, string | string[]>) => void
}

const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState<Step>(0)
  const [surveyStep, setSurveyStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [open, setOpen] = useState(true)

  const close = () => {
    setOpen(false)
  }

  const handleFinish = () => {
    if (selectedPlan === null) return
    const finalAnswers = { 
      ...answers, 
      [questions[surveyStep].id]: selectedAnswer,
      4: pricingPlans[selectedPlan].name, // Add pricing tier (Free/Premium)
      5: pricingPlans[selectedPlan].lockedFeatures // Add locked features based on plan
    }
    close()
    onComplete?.(finalAnswers)
  }

  if (!open) return null

  const progressSteps = ["Survey", "Pricing", "Business"]

  const handleSurveyNext = () => {
    if (surveyStep < questions.length - 1) {
      const newAnswers = { ...answers, [questions[surveyStep].id]: selectedAnswer }
      setAnswers(newAnswers)
      setSurveyStep(surveyStep + 1)
      setSelectedAnswer("")
    } else {
      const finalAnswers = { ...answers, [questions[surveyStep].id]: selectedAnswer }
      setAnswers(finalAnswers)
      setStep(1 as Step)
      setSurveyStep(0)
    }
  }

  const handleBack = () => {
    if (step === 0 && surveyStep > 0) {
      setSurveyStep(surveyStep - 1)
      const prevAnswer = answers[questions[surveyStep - 1].id]
      setSelectedAnswer(typeof prevAnswer === "string" ? prevAnswer : "")
    } else if (step > 0) {
      setStep(((step - 1) as unknown) as Step)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e0e0e0] px-8 py-6 flex items-center justify-between">
          <div className="flex gap-8">
            {progressSteps.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm  ${i === step ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === step ? ' text-black' : 'text-gray-500'}`}>{label}</span>
              </div>
            ))}
          </div>
          <button onClick={close} className="text-gray-400 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {step === 0 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl  mb-2">Survey</h2>
              <p className="text-gray-600 mb-8">Question {surveyStep + 1} of {questions.length}</p>
              <p className="text-lg mb-6">{questions[surveyStep].question}</p>
              <div className="space-y-3">
                {questions[surveyStep].options.map((option, i) => (
                  <label key={i} className="flex items-center p-4 border border-[#e0e0e0] rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="survey" checked={selectedAnswer === option} onChange={() => setSelectedAnswer(option)} className="mr-3 accent-black" />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl  mb-2">Choose Your Plan</h2>
              <p className="text-gray-600 mb-8">Pick the plan that works for your business</p>
              <div className="grid grid-cols-2 gap-6">
                {pricingPlans.map((plan, i) => (
                  <div key={i} onClick={() => setSelectedPlan(i)} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === i && plan.highlighted
                      ? 'border-[#e0e0e0] bg-black text-white ring-2 ring-black'
                      : selectedPlan === i
                      ? 'border-black bg-white text-black'
                      : plan.highlighted
                      ? 'border-black bg-black text-white hover:ring-2 hover:ring-black'
                      : 'border-gray-200 hover:border-gray-400 bg-white text-black'
                  }`}>
                    <h3 className=" mb-1">{plan.name}</h3>
                    <p className="text-3xl  mb-1">{plan.price}</p>
                    <p className={`text-sm mb-6 ${selectedPlan === i || (plan.highlighted && selectedPlan !== i) ? 'text-gray-300' : 'text-gray-600'}`}>{plan.period}</p>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex gap-2">
                          <span>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl  mb-2">Business Setup</h2>
              <p className="text-gray-600 mb-8">
                Business Type: {Array.isArray(answers[2]) ? answers[2].join(", ") : (answers[2] || "")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#e0e0e0] px-8 py-6 flex justify-between gap-4">
          <button onClick={handleBack} disabled={step === 0 && surveyStep === 0} className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Back
          </button>
          <button
            onClick={() =>
              step === 2
                ? handleFinish()
                : step === 0
                ? handleSurveyNext()
                : setStep(((step + 1) as unknown) as Step)
            }
            disabled={(step === 0 && !selectedAnswer) || (step === 1 && selectedPlan === null)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 2 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal
