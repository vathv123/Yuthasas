"use client"

import { useEffect, useState } from "react"
import { isPromoActive } from "@/lib/promo"

interface PricingProps {
    onGetStarted?: () => void
}


const Pricing = ({ onGetStarted =() => {}}: PricingProps) => {
    const [isMonthly, setIsMonthly] = useState(true)
    const freePrice = "$0"
    const premiumPrice = isMonthly ? "$4.99" : "$37.78"
    const periodLabel = isMonthly ? "Per member, per monthly" : "Per member, per yearly"
    const [promoActive, setPromoActive] = useState(isPromoActive())
    const [betaCount, setBetaCount] = useState<number | null>(null)
    const [betaLimit, setBetaLimit] = useState<number | null>(null)

    useEffect(() => {
        let ignore = false
        const load = async () => {
            try {
                const res = await fetch("/api/beta-status")
                const data = await res.json()
                if (ignore) return
                setBetaCount(typeof data?.count === "number" ? data.count : null)
                setBetaLimit(typeof data?.limit === "number" ? data.limit : null)
            } catch {
                // ignore
            }
        }
        load()
        return () => {
            ignore = true
        }
    }, [])

    useEffect(() => {
        const id = window.setInterval(() => setPromoActive(isPromoActive()), 60000)
        return () => window.clearInterval(id)
    }, [])
    return (
        <>
            <div id="pricing" className="w-full justify-center font-[Gilroy-Medium] items-center rounded-2xl flex flex-col">
                <div className="text-[40px]">
                    <div className="text-center">Our Price is Simple With no  <span className="bg-[#f4f4f4] text-[#636363] p-1 max-[950px]:hidden">hidden fees</span> <p className="bg-[#f4f4f4] text-[#636363] p-1 max-[920px]:block hidden">hidden fees</p></div>
                </div>
                <p className="text-[16px] mt-4 text-center text-[#858585]">Yuthasas has two features which is free tier and premium tier.</p>
                <div className="flex gap-4 mt-24">
                    <p>Monthly</p>
                    <div
                        className="w-[80px] h-[30px] rounded-full bg-black/80 overflow-hidden flex cursor-pointer items-center"
                        onClick={() => setIsMonthly((v) => !v)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setIsMonthly((v) => !v)
                        }}
                    >
                        <div
                            className={`w-[30px] h-[40px] rounded-full bg-[#d5d5d5] transition-transform duration-300 ${
                                isMonthly ? "translate-x-0" : "translate-x-[50px]"
                            }`}
                        ></div>
                    </div>
                    <p>Yearly</p>
                </div>
                {promoActive && (
                    <p className="text-[16px] mt-4 text-[#858585]">
                        Get 30% OFF for the first signup
                        {betaCount !== null && betaLimit !== null ? ` • ${betaCount}/${betaLimit}` : ""}
                    </p>
                )}
                <div className="flex flex-wrap w-full justify-center gap-4 mt-5 ">
                    <div className="w-[560px] border border-black/70 rounded-[24px] p-4 items-center justify-center gap-4 flex flex-col">
                        <div className="w-full justify-between flex h-full gap-4">
                            <div className="flex-[1_1_auto] flex flex-col justify-between">
                                <div className="flex justify-center w-[120px] items-center h-[30px] bg-[#dadada] rounded-full">
                                    Free Plan
                                </div>
                                <div className="flex flex-col ">
                                    <p className="text-[52px]">{freePrice}</p>
                                    <p className="text-[16px] text-[#858585]">{periodLabel}</p>
                                </div>
                            </div>
                            <div className="flex-[1_1_auto] flex flex-col gap-6">
                                <p>Free Elements</p>
                                <div className="flex gap-1 flex-col">
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Free essential calculation</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Quick & Time savings</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Export as Png, Jpeg, or Pdf</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Limited to 3 calculation /day</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-center items-center bg-black/90 text-white rounded-[34px] h-[50px]" onClick={onGetStarted}>
                            Start for free
                        </div>
                    </div>
                    

                    <div className="w-[560px] border bg-black/90 border-black/70 rounded-[24px] p-4 items-center justify-center gap-4 flex flex-col">
                        <div className="w-full justify-between flex h-full gap-4">
                            <div className="flex-[1_1_auto] flex flex-col justify-between">
                                <div className="flex justify-center w-[120px] items-center h-[30px] text-white bg-[#262626] rounded-full">
                                    Premium Plan
                                </div>
                                <div className="flex flex-col ">
                                    <p
                                        className={`text-[52px] text-lime-300 ${
                                            promoActive ? "line-through decoration-2 decoration-lime-300/60" : ""
                                        }`}
                                    >
                                        {premiumPrice}
                                    </p>
                                    <p className="text-[16px] text-[#858585]">{periodLabel}</p>
                                    {promoActive && (
                                        <p className="text-[12px] text-lime-300/90 mt-1">
                                            Beta limited to 100 users
                                            {betaCount !== null && betaLimit !== null ? ` • ${betaCount}/${betaLimit}` : ""}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-[1_1_auto] flex flex-col gap-6 text-white">
                                <p>Premium Elements</p>
                                <div className="flex gap-1 flex-col">
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Free essential calculation</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Quick & Time savings</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Export as Png, Jpeg, or Pdf</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><title>Circle-tick SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25"/><path d="m5.75 7.75l2.5 2.5l6-6.5"/></g></svg>
                                        <p>Limited to 3 calculation /day</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-center relative items-center bg-lime-300  text-black rounded-[34px] h-[50px]">
                            <p>Get Started</p>
                            <div className="w-[60px] h-[90%] rounded-full border absolute right-[2px]  border-black/22 flex justify-center items-center"
                                style={{
                                    boxShadow: "0 2px 3px black"
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><title>Arrow-right-outlined SVG Icon</title><path fill="currentColor" d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export { Pricing }
export default Pricing
