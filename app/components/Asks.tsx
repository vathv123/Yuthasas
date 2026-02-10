"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface Question {
    id: number
    question: string
    options: string[]
}
interface AsksProps {
    onComplete?: (answers: Record<number, string>) => void
    forceOpen?: boolean
}

const Asks = ({ 
    onComplete = () => {}, 
    forceOpen = false,
}: AsksProps) => {
    const { data: session, status } = useSession()
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [selected, setSelected] = useState<string>("")
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [isCompleted, setIsCompleted] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(true)
    useEffect(() => {
        if (status !== "authenticated") {
            setIsVisible(false)
            return
        }
        const loadStatus = async () => {
            try {
                const res = await fetch("/api/asks", { method: "GET" })
                const data = await res.json()
                if (data?.answers && typeof data.answers === "object") {
                    setAnswers(data.answers as Record<number, string>)
                    setSelected((data.answers as Record<number, string>)[questions[0].id] || "")
                }
                if (forceOpen) {
                    setIsCompleted(false)
                    setIsVisible(true)
                } else {
                    const shouldShow = !data.completed && !!data.onboardingCompleted
                    setIsVisible(shouldShow)
                }
            } catch {
                setIsVisible(true)
            }
        }
        loadStatus()
    }, [status, forceOpen])

    const questions: Question[] = [
        {
            id: 1,
            question: "What is the size classification of your current Organization?",
            options: [
                "Sole Proprietorship / Micro Business",
                "Small-Scale Enterprise",
                "Mid-Size Enterprise",
                "Large-Scale Corporate"
            ]
        },
        {
            id: 2,
            question: "What is your business type?",
            options: [
                "Food & Beverage",
                "Retail / Trading",
                "Services",
                "Manufacturing",
                "Other"
            ]
        },
        {
            id: 3,
            question: "Do you often feel overwhelmed by disorganized finances and lack clear visibility into your business performance?",
            options: [
                "Always",
                "Often",
                "Sometimes",
                "Rarely",
                "Never"
            ]
        }
    ]

    const handleNext = (): void => {
        if (!selected) return
        
        const newAnswers = {
            ...answers,
            [questions[currentStep].id]: selected
        }
        setAnswers(newAnswers)

        if (currentStep < questions.length - 1) {
            const nextStep: number = currentStep + 1
            setCurrentStep(nextStep)
            setSelected(answers[questions[nextStep].id] || "")
        } else {
            const finalAnswers = {
                ...answers,
                [questions[currentStep].id]: selected
            }

            setAnswers(finalAnswers)
            setIsCompleted(true)
            fetch("/api/asks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: finalAnswers }),
            }).catch(() => {})

            // 🔥 SEND DATA UP
            onComplete(finalAnswers)
        }

    }

    const handlePrevious = (): void => {
        if (currentStep > 0) {
            setAnswers((prev: Record<number, string>) => ({
                ...prev,
                [questions[currentStep].id]: selected
            }))

            const prevStep: number = currentStep - 1
            setCurrentStep(prevStep)
            setSelected(answers[questions[prevStep].id] || "")
        }
    }

    const handleClose = (): void => {
        setIsVisible(false)
        fetch("/api/asks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
        }).catch(() => {})
    }

    const handleRestart = (): void => {
        setCurrentStep(0)
        setSelected("")
        setAnswers({})
        setIsCompleted(false)
    }

    const currentQuestion: Question = questions[currentStep]

    return (
        <>
            {isVisible && (
                <div className="w-full h-screen flex justify-center m-auto fixed z-50 bg-[#ffffffef] backdrop-blur-[12px]">
                    <div className="w-full px-4 bg-[#ffffffd3] backdrop-blur-[12px] h-screen font-[Gilroy-Medium] justify-center items-center flex fixed flex-col animate-fadeIn">

                        {!isCompleted ? (
                            // Survey Questions
                            <>
                                <p className="text-[24px]">Surveying</p>
                                <p className="mt-4 text-center px-4 max-w-[500px]">
                                    {currentQuestion.question}
                                </p>

                                <form className="flex w-[430px] flex-col justify-start mt-6 relative">
                                    {currentQuestion.options.map((option: string, index: number) => (
                                        <label 
                                            key={index} 
                                            className="mt-5 flex gap-3 items-center cursor-pointer hover:bg-[#ffffffb8] hover:backdrop-blur-[12px] p-2 rounded transition-colors"
                                        >
                                            <input 
                                                type="radio"
                                                name={`Q${currentQuestion.id}`} 
                                                id={`option-${index}`}
                                                className="w-4 h-4 ml-5"
                                                checked={selected === option}
                                                onChange={() => setSelected(option)}
                                            />
                                            <p className="select-none">{option}</p>
                                        </label>
                                    ))}
                                </form>

                                <div className="w-[420px] flex justify-between mt-8 px-4">
                                    {currentStep > 0 && (
                                        <button 
                                            onClick={handlePrevious}
                                            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            type="button"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
                                                <title>Previous</title>
                                                <path fill="#b3b3b3" d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 0 0 0 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8"/>
                                            </svg>
                                        </button>
                                    )}
                                    
                                    {currentStep === 0 && <div />}

                                    <button 
                                        onClick={handleNext}
                                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        type="button"
                                        disabled={!selected}
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="24" 
                                            height="24" 
                                            viewBox="0 0 1024 1024"
                                            className={!selected ? "opacity-30" : "opacity-100"}
                                        >
                                            <title>Next</title>
                                            <path fill="#b3b3b3" d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex gap-2 mb-6 mt-4">
                                    {questions.map((_: Question, index: number) => (
                                        <div 
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === currentStep ? "bg-black" : answers[questions[index].id] ? "bg-gray-400" : "bg-gray-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            // Completion Screen
                            <div className="flex w-full max-w-[90vw] flex-col items-center animate-fadeIn">
                                {/* <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div> */}
                                
                                <h2 className="text-[28px] font-bold mb-2">Thank You!</h2>
                                <p className="text-gray-600 text-center max-w-[400px] mb-8">
                                    Your responses have been recorded. We appreciate your time.
                                </p>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleClose}
                                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        Close Survey
                                    </button>
                                    
                                    <button 
                                        onClick={handleRestart}
                                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        Start Over
                                    </button>
                                </div>

                                {/* Summary of answers */}
                                <div className="mt-8 p-4 bg-gray-50 rounded-lg w-full max-w-[430px]">
                                    <p className="text-sm font-semibold mb-3 text-gray-700">Your Responses:</p>
                                    {questions.map((q: Question) => (
                                        <div key={q.id} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                                            <span className="text-gray-500">Q{q.id}:</span>
                                            <span className="text-gray-800 font-medium text-right max-w-[300px]">
                                                {answers[q.id] || "Not answered"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
        </>
    )
}
export { Asks }
export default Asks
