"use client"

import { useState } from "react"

const Comment = () => {
    const comments = [
        {
            title: "\"The calculation is precise\"",
            body: "I am a drink owner in Phnom Penh. I used Yuthasas to calculate profit/loss and it saved me hours. The results are accurate and the price is reasonable.",
            name: "Sok Pisey"
        },
        {
            title: "\"Clear and simple\"",
            body: "I finally understand my daily revenue and costs. The dashboard is clean and the numbers make sense. It feels built for real businesses.",
            name: "Dara Kim"
        },
        {
            title: "\"Saved me time\"",
            body: "I used to track everything in spreadsheets. With Yuthasas, I get answers fast and can focus on customers instead of calculations.",
            name: "Chanthy Vann"
        },
        {
            title: "\"Great for small teams\"",
            body: "Our small shop now shares the same reports. We can see profit trends and make better decisions each month.",
            name: "Lina Sok"
        },
        {
            title: "\"Worth the upgrade\"",
            body: "The premium features help us analyze costs quickly. Exporting reports is smooth and professional.",
            name: "Vuthy Heng"
        },
        {
            title: "\"Reliable insights\"",
            body: "The calculations match my manual checks. It gives me confidence when planning budgets and inventory.",
            name: "Piseth Mon"
        },
    ]

    const [index, setIndex] = useState(0)
    const handlePrev = () => setIndex((i) => (i - 1 + comments.length) % comments.length)
    const handleNext = () => setIndex((i) => (i + 1) % comments.length)
    const faqs = [
        {
            q: "How can it help your business?",
            a: "Yuthasas automates profit/loss calculations and gives you clear visibility so you can make faster, smarter decisions."
        },
        {
            q: "How many businesses can Yuthasas help you with?",
            a: "You can manage multiple business types in one place, from small stalls to larger enterprises."
        },
        {
            q: "What makes Yuthasas stand out?",
            a: "It’s designed for real operators with simple inputs, fast results, and practical exports for reporting."
        },
        {
            q: "Is the calculation precise?",
            a: "Yes. The system follows consistent formulas and real inputs, so results match manual checks."
        },
    ]
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const toggleFaq = (i: number) => {
        setOpenFaq((prev) => (prev === i ? null : i))
    }

    return (
        <>
            <div className="w-full min-h-[70vh] font-[Gilroy-Medium] flex flex-col justify-center items-center gap-12 relative relative">
                <div className="w-full max-w-[550px] text-center flex flex-col gap-6 items-center justify-center overflow-hidden">
                    <div
                        className="flex w-full transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {comments.map((c, i) => (
                            <div key={i} className="w-full shrink-0 flex flex-col gap-6 items-center justify-center px-4">
                                <p className="text-[22px]">{c.title}</p>
                                <div>{c.body}</div>
                                <div className="flex gap-1 items-center">
                                    <div className="w-[50px] h-[50px] rounded-full">
                                        <img src="/image/Yuthasas.png" alt="UserComment" className="w-full h-full object-cover" width={50} height={50} loading="lazy" decoding="async" />
                                    </div>
                                    <p>{c.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full flex gap-1 justify-center items-center">
                    {comments.map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all ${i === index ? "w-[30px] h-[9px] bg-black/90" : "w-[9px] h-[9px] bg-black/10"}`}
                        ></div>
                    ))}
                </div>

                <div className="max-w-[550px] relative w-full">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute bottom-8 left-6 w-10 h-10 rounded-full cursor-pointer transition flex items-center justify-center"
                        aria-label="Previous comment"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                            <title>Chevron-left SVG Icon</title>
                            <path fill="currentColor" fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="absolute bottom-8 right-6 w-10 h-10 rounded-full cursor-pointer transition flex items-center justify-center"
                        aria-label="Next comment"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <title>Chevron-right SVG Icon</title>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 4l8 8l-8 8"/>
                        </svg>
                    </button>

                </div>
            </div>
            <div className="w-full flex-wrap font-[Gilroy-Medium] flex mt-32 ">
                <div className="flex-[1_1_450px] text-[50px] ">
                    <div className="max-[1000px]:hidden">
                        <p>Frequently</p>
                        <p>Asked</p>
                        <p>questions</p>
                    </div>
                    <div className="max-[1001px]:block hidden">
                        <p>FAQs</p>
                    </div>
                </div>
                <div className="flex-[1_1_450px] flex flex-col items-center">
                    {faqs.map((f, i) => (
                        <div key={i} className={`w-full ${i === 0 ? "max-[1000px]:mt-12" : "mt-5"}`}>
                            <button
                                type="button"
                                onClick={() => toggleFaq(i)}
                                className="w-full text-left text-[22px] flex items-center justify-between border-b border-black/10 pb-3 cursor-pointer"
                            >
                                <span>{f.q}</span>
                                <span className="text-black/40">{openFaq === i ? "−" : "+"}</span>
                            </button>
                            {openFaq === i && (
                                <p className="text-black/40 mt-5">{f.a}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Comment
