
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const Hero = () => {
    const router = useRouter()
    const { status } = useSession()
    const [nowLabel, setNowLabel] = useState("")
    const [countdown, setCountdown] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" })
    const [showPromo, setShowPromo] = useState(true)
    const [betaCount, setBetaCount] = useState<number | null>(null)
    const [betaLimit, setBetaLimit] = useState<number | null>(null)

    useEffect(() => {
        const target = new Date("2026-04-04T00:00:00")
        const tick = () => {
            const now = new Date()
            const diff = Math.max(0, target.getTime() - now.getTime())
            const totalSeconds = Math.floor(diff / 1000)
            const days = Math.floor(totalSeconds / 86400)
            const hours = Math.floor((totalSeconds % 86400) / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60
            const active = diff > 0
            setShowPromo(active)
            setCountdown({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
            })
            const formatter = new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
            })
            setNowLabel(formatter.format(now))
        }
        tick()
        const id = window.setInterval(tick, 1000)
        return () => window.clearInterval(id)
    }, [])

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
        const id = window.setInterval(load, 30000)
        return () => {
            ignore = true
            window.clearInterval(id)
        }
    }, [])
    const handleStartNow = () => {
        if (status === "authenticated") {
            router.push("/Enterprise")
            return
        }
        router.push("/authentications/signup")
    }
    return (
        <>
            <div className="w-full max-w-[90vw] flex flex-col items-center font-[Gilroy-Medium] justify-center gap-6 relative ">                
                <div className="w-full z-2 flex flex-col justify-center items-center text-black mt-[180px]">
                    <p className="text-[15px]">Work Smarter, Not Harder.</p>
                    <p className="text-[clamp(40px,4vw,60px)] max-w-[650px] leading-[1.1] text-center">Know your profits and manage your business in seconds.</p>
                    <div
                        className="w-[220px] cursor-pointer h-[50px] bg-black mt-4 flex  text-white justify-between items-center overflow-hidden rounded-2xl "
                        onClick={handleStartNow}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") handleStartNow()
                        }}
                    >
                        <span className="relative left-4">Start Now</span>
                        <button
                            type="button"
                            className="w-[90px] h-[40px] bg-white rounded-xl relative right-2 flex justify-center items-center  cursor-pointer"
                            onClick={handleStartNow}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><title>Arrow-right-outlined SVG Icon</title><path fill="#000" d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4"/></svg>
                        </button>
                    </div>
                </div>
                <div style={{
                    left: 0,
                    background: "linear-gradient( to right, rgba(255,255,255,1), rgba(255,255,255,0.6), rgba(255,255,255,0.2), transparent)",
                    position: "absolute",
                    top: 0,
                    width: "10vw",
                    height: "100%",
                    pointerEvents: "none",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 0 2px white, 0px 0px 2px white",
                    willChange: "backdrop-filter"
                }}></div>
                <div style={{
                    right: 0,
                    background: "linear-gradient( to left, rgba(255,255,255,1), rgba(255,255,255,0.6), rgba(255,255,255,0.2), transparent)",
                    position: "absolute",
                    top: 0,
                    width: "12vw",
                    height: "100%",
                    pointerEvents: "none",
                    backdropFilter: "blur(10px)",
                    boxShadow: "-0.3px 0 2px white, -0.2px 0px 0px white",
                    willChange: "backdrop-filter"
                }}></div>
                <div className="w-full h-[450px]">
                    <img src="/image/Hand_Shake.png" alt="Hand_Shake" className="w-full h-full object-cover" loading="lazy" width={1400} height={900} decoding="async"/>
                </div>
            </div>
            {showPromo && (
                <div className="fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-[320px] sm:bottom-6 sm:right-6 sm:w-auto">
                    <div className="bg-white/85 backdrop-blur-md border border-black/10 rounded-2xl px-4 py-3 shadow-lg font-[Gilroy-Medium]">
                        <p className="text-[12px] uppercase tracking-[0.2em] text-black/40">Free Premium Plan</p>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="text-[12px] text-black/60">{nowLabel}</div>
                            <div className="w-[1px] h-4 bg-black/10"></div>
                            <div className="text-[14px] text-black">{countdown.days}:{countdown.hours}:{countdown.minutes}:{countdown.seconds}</div>
                        </div>
                        <p className="text-[11px] text-black/40 mt-1">
                            Countdown
                            {betaCount !== null && betaLimit !== null ? ` | ${betaCount}/${betaLimit}` : ""}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
export default Hero

