import styles from "./gridBackground.module.css"
const inDept = () => {
    return (
        <>
            <div className="w-full font-[Gilroy-Medium] py-12 gap-16 flex flex-col">
                <div className="w-full flex justify-start items-center">
                    <div className="w-[50vw] h-[1px] bg-gray-500"></div>
                </div>
                <div className="w-full flex justify-between flex-wrap">
                    <p className="text-[60px] flex-[1_1_550px]">What is Yuthasas?</p>
                    <div className="text-[24px] flex flex-col gap-6 flex-[1_1_550px] mt-6 text-[#787878]">
                        <p>Yuthasas is a comprehensive business management platform that streamlines financial operations for enterprises of all sizes. We specialize in calculation management and systematic record-keeping of earnings and losses across monthly and yearly reporting cycles.</p>
                        <p>From daily cash flow tracking to annual financial reporting, Yuthasas converts complex data into clear, actionable insights—enabling smarter decision-making and sustainable financial growth for startups, SMEs, and large corporations alike, ranging from small to big enterprises.</p>
                    </div>
                </div>
                <div className="w-full flex justify-end items-center">
                    <div className="w-[50vw] h-[1px] bg-gray-500"></div>
                </div>
                <div className="w-full flex justify-between flex-wrap  max-[1223px]:flex-wrap-reverse ">
                    <div className="text-[24px] flex flex-col gap-6 flex-[1_1_550px] mt-6 text-[#787878]">
                        <p>Businesses need Yuthasas because financial blind spots destroy companies—our platform eliminates them by automating calculations, centralizing records, and delivering real-time visibility into earnings and losses. Without it, you waste hours on error-prone spreadsheets, miss profit leaks, and scramble during audits. Yuthasas transforms chaos into clarity, enabling smarter decisions and sustainable growth at any scale.</p>
                    </div>
                    <div className="text-[60px] flex-[1_1_550px] flex flex-col items-end">
                        <div className="w-full flex items-center justify-end text-end">
                            <div>
                                <p className="flex gap-4 text-end justify-end">Why must you <span className="max-[606px]:hidden block"> need</span></p> 
                                <span className="hidden max-[606px]:block">need Yuthasas?</span>
                            </div>
                        </div>
                        <p className="max-[606px]:hidden block">Yuthasas?</p>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="w-[50vw] h-[1px] bg-gray-500"></div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="w-[250px] h-[50px]  bg-lime-300 rounded-full flex justify-center items-center">Guidance Platform</div>
                    <div className="text-[30px]">
                        <p>Let us show you how we drive</p>
                        <p>your brand to new heights</p>
                    </div>
                    <div className="w-full min-[920px]:max-w-[40vw] text-[#9a9a9a] text-[22px] ">
                        <p>Stop drowning in spreadsheets. Yuthasas transforms your costs, workforce fees, and earnings into clear growth signals. Start free with instant calculations, upgrade to AI-powered insights and historical tracking as you scale. Here's how we drive your revenue forward.</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><title>Arrow-right-outlined SVG Icon</title><path fill="currentColor" d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4"/></svg>
                    </div>
                </div>
                <div className={`w-full flex flex-col relative overflow-hidden py-6  sm:gap-0 gap-6 ${styles.magicpattern}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1500" viewBox="0 0 100 100" className="absolute max-[640px]:hidden">
                    <path 
                        d="M 90 30 Q 190 -5 40 20 A -25 10 0 1 0 90 65 A 120 120 0 1 0 120 70" 
                        fill="none" 
                        stroke="#bbf451" 
                        strokeWidth="0.2" 
                        strokeLinecap="round"
                    />
                    </svg>
                    <div className="w-full flex justify-center sm:justify-end z-5">
                        <div className="w-[340px] h-[390px] bg-[#fefefe] rounded-[24px] sm:transform-[rotate(-8deg)] p-7 flex flex-col justify-between"
                            style={{
                                boxShadow: "0px 2px 4px #dbdbdb"
                            }}
                        >
                            <div className="w-full h-[50px] flex items-center justify-center">
                                <div className="bg-[#e5e5e5] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                                    <div className="bg-[#222222] rounded-full w-[18px] h-[18px]"
                                        style={{
                                            boxShadow: "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-full h-[270px] bg-[#f0f0f0] rounded-[12px] p-5 flex flex-col gap-6 justify-center items-start">
                                <p className="text-[32px]">01</p>
                                <p className="text-[24px]">Instant Business Intelligence </p>
                                <p>Input your costs, workforce fees, and earnings; we calculate the rest with precision.</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center sm:justify-start z-5">
                        <div className="w-[340px] h-[390px] bg-[#fefefe] rounded-[24px] sm:transform-[rotate(8deg)] p-7 flex flex-col justify-between"
                            style={{
                                boxShadow: "0px 2px 4px #dbdbdb"
                            }}
                        >
                            <div className="w-full h-[50px] flex items-center justify-center">
                                <div className="bg-[#e5e5e5] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                                    <div className="bg-[#222222] rounded-full w-[18px] h-[18px]"
                                        style={{
                                            boxShadow: "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-full h-[270px] bg-[#f0f0f0] rounded-[12px] p-5 flex flex-col gap-6 justify-center items-start">
                                <p className="text-[32px]">02</p>
                                <p className="text-[24px]">Freemium Flexibility </p>
                                <p> Start free with essential calculations, upgrade to AI-powered insights as you scale</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center sm:justify-end z-5">
                        <div className="w-[340px] h-[430px] bg-[#fefefe] rounded-[24px] sm:transform-[rotate(-8deg)] p-7 flex flex-col justify-between"
                            style={{
                                boxShadow: "0px 2px 4px #dbdbdb"
                            }}
                        >
                            <div className="w-full h-[50px] flex items-center justify-center">
                                <div className="bg-[#e5e5e5] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                                    <div className="bg-[#222222] rounded-full w-[18px] h-[18px]"
                                        style={{
                                            boxShadow: "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-full h-[340px] bg-[#f0f0f0] rounded-[12px] p-5 flex flex-col gap-6 justify-center items-start">
                                <p className="text-[32px]">03</p>
                                <p className="text-[24px]">Predictive Revenue Growth </p>
                                <p> Pro-tier AI identifies profit patterns and forecasts opportunities before competitors see them</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center sm:justify-start z-5">
                        <div className="w-[340px] h-[390px] bg-[#fefefe] rounded-[24px] sm:transform-[rotate(8deg)] p-7 flex flex-col justify-between"
                            style={{
                                boxShadow: "0px 2px 4px #dbdbdb"
                            }}
                        >
                            <div className="w-full h-[50px] flex items-center justify-center">
                                <div className="bg-[#e5e5e5] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                                    <div className="bg-[#222222] rounded-full w-[18px] h-[18px]"
                                        style={{
                                            boxShadow: "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-full h-[270px] bg-[#f0f0f0] rounded-[12px] p-5 flex flex-col gap-6 justify-center items-start">
                                <p className="text-[32px]">04</p>
                                <p className="text-[24px]">Historical Momentum Tracking </p>
                                <p> Monthly and yearly data archives reveal exactly what's driving your growth</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}
export default inDept
