"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"
const Nav = () => {
    const [typeOfBiz, setTypeOfBiz] = useState(false)
    const { status } = useSession()
    return (
        <>
            <div className="fixed w-full max-w-[90vw] z-[50] bg-white">
                <div className="w-full font-[Gilroy-Medium] flex justify-between items-center">
                    <div className="flex items-center" >
                        <img src="/image/Yuthasas.png" alt="Yuthasas logo" width={90} height={90} />
                        <span className="relative -left-4">Yuthasas</span>
                    </div>
                    <div className="flex gap-12 max-[1020px]:hidden" >
                        <Link href="/" className="cursor-pointer">Home</Link>
                        <div className="relative">
                            <span className="flex items-center cursor-pointer" onClick={() => setTypeOfBiz(!typeOfBiz)}>
                                <span>Business</span>
                                <svg className="top-[1px] relative" width="16" height="16" viewBox="0 0 20 20"><title>Arrow-down-alt2 SVG Icon</title><path fill="currentColor" d="m5 6l5 5l5-5l2 1l-7 7l-7-7z"/></svg>
                            </span>
                            {
                                typeOfBiz && 
                                <div className="w-[250px] bg-[#ffffff3c] backdrop-blur-[12px] absolute top-0 -left-15 mt-9 flex flex-col border border-[#e7e7e7] rounded-[12px] " onClick={() => setTypeOfBiz(!typeOfBiz)}>
                                    <Link href="/businesses?type=street" className="p-1 border border-transparent hover:border-l-[black]  rounded-tl-[12px] rounded-tr-[12px]  transition-colors duration-100 py-2 flex items-center cursor-pointer gap-3 relative text-[14px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><title>Shop SVG Icon</title><path fill="currentColor" d="M6.123 7.25L6.914 2H2.8L1.081 6.5C1.028 6.66 1 6.826 1 7c0 1.104 1.15 2 2.571 2c1.31 0 2.393-.764 2.552-1.75M10 9c1.42 0 2.571-.896 2.571-2c0-.041-.003-.082-.005-.121L12.057 2H7.943l-.51 4.875A2.527 2.527 0 0 0 7.429 7c0 1.104 1.151 2 2.571 2m5 1.046V14H5v-3.948c-.438.158-.92.248-1.429.248c-.195 0-.384-.023-.571-.049V16.6c0 .77.629 1.4 1.398 1.4H15.6c.77 0 1.4-.631 1.4-1.4v-6.348a4.297 4.297 0 0 1-.571.049A4.155 4.155 0 0 1 15 10.046M18.92 6.5L17.199 2h-4.113l.79 5.242C14.03 8.232 15.113 9 16.429 9C17.849 9 19 8.104 19 7c0-.174-.028-.34-.08-.5"/></svg>
                                        Street Food Vendor
                                    </Link>
                                    <Link href="/businesses?type=small" className="p-1 border border-transparent hover:border-l-[black] transition-colors duration-100 py-2 flex items-center cursor-pointer gap-3 relative text-[14px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 1024 1024"><title>Shop-filled SVG Icon</title><path fill="currentColor" d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0 0 14.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h274V736h128v176h274c17.7 0 32-14.3 32-32V535a175 175 0 0 0 15.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9m-72 568H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4c22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c3-1.3 6-2.6 9-4v242.2zm0-568.1H214v-88h596z"/></svg>
                                        Small and Medium Enterprise 
                                    </Link>
                                    <Link href="/businesses?type=medium" className="p-1 border border-transparent hover:border-l-[black] transition-colors duration-100 py-2 flex items-center cursor-pointer gap-3 relative text-[14px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 1024 1024"><title>Shop-twotone SVG Icon</title><path fill="currentColor" fillOpacity=".15" d="M839.5 344h-655c-.3 0-.5.2-.5.5v91.2c0 59.8 49 108.3 109.3 108.3c40.7 0 76.2-22 95.1-54.7c2.9-5.1 8.4-8.3 14.3-8.3s11.3 3.2 14.3 8.3c18.8 32.7 54.3 54.7 95 54.7c40.8 0 76.4-22.1 95.1-54.9c2.9-5 8.2-8.1 13.9-8.1h.6c5.8 0 11 3.1 13.9 8.1c18.8 32.8 54.4 54.9 95.2 54.9C791 544 840 495.5 840 435.7v-91.2c0-.3-.2-.5-.5-.5"/><path fill="currentColor" d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0 0 14.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h676c17.7 0 32-14.3 32-32V535a175 175 0 0 0 15.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9M214 184h596v88H214zm362 656.1H448V736h128zm234.4 0H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c3-1.3 6-2.6 9-4zM840 435.7c0 59.8-49 108.3-109.3 108.3c-40.8 0-76.4-22.1-95.2-54.9c-2.9-5-8.1-8.1-13.9-8.1h-.6c-5.7 0-11 3.1-13.9 8.1A109.24 109.24 0 0 1 512 544c-40.7 0-76.2-22-95-54.7c-3-5.1-8.4-8.3-14.3-8.3s-11.4 3.2-14.3 8.3a109.63 109.63 0 0 1-95.1 54.7C233 544 184 495.5 184 435.7v-91.2c0-.3.2-.5.5-.5h655c.3 0 .5.2.5.5z"/></svg>
                                        Small and Medium Enterprise 
                                    </Link>
                                    <Link href="/businesses?type=large" className="p-1 border border-transparent hover:border-l-[black]  rounded-bl-[12px]  transition-colors duration-100 py-2 flex items-center cursor-pointer gap-3 relative text-[14px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 16 16"><title>Shop SVG Icon</title><path fill="currentColor" d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8A2.37 2.37 0 0 1 8 7.083A2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0a.5.5 0 0 1 1 0a1.375 1.375 0 0 0 2.75 0a.5.5 0 0 1 1 0a1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0a.5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z"/></svg>
                                        Enterprise / Corporation
                                    </Link>
                                </div>
                            }
                        </div>
                        <Link href="/features" className="flex cursor-pointer">
                            <span>Features</span>
                            <div className="w-[33px] text-[10px] relative left-1 flex justify-center items-center h-[14px] bg-[#bbf451] text-black">New</div>
                        </Link>
                        <Link href="/#pricing" className="cursor-pointer">Pricing</Link>

                        <Link href="/contact" className="cursor-pointer max-[1162px]:hidden">Contact</Link>
                        <Link href="/about" className="cursor-pointer">About Us</Link>
                    </div>
                    <div className="flex gap-4 items-center">
                        {status === "authenticated" ? (
                            <Link href="/Enterprise">
                                <button type="button" className="p-[6px_30px] rounded-sm cursor-pointer bg-black text-white">
                                    My Account
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/authentications/signup" className="max-[1162px]:hidden">
                                    <span>Sign in</span>
                                </Link>
                                <Link href="/authentications/signup">
                                    <button type="button" className="p-[6px_30px] rounded-sm cursor-pointer bg-black text-white">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Nav
