import Link from "next/link"

const footer = () => {
    return (
        <>
            <div className="w-full h-[50vh] bg-black/90 flex justify-center items-center relative text-white font-[Gilroy-Medium] mt-32">
                <img src="https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg" className="object-cover w-full h-full brightness-[0.5]" alt="" loading="lazy" width={1600} height={900} decoding="async" />
                <div className="absolute w-full flex justify-center flex-col items-center gap-6">
                    <p className="text-[34px] text-center">Get ready and Plan your business ahead with Us</p>
                    <div className="text-white/70 text-center">
                        <p className="max-[750px]:max-w-[370px] max-w-[450px]">Register now with a free 30% discount on your first account created. Know your business earnings and prepare your business better starting now.</p>
                    </div>
                    <Link href="/authentications/signup">
                        <button type="button" className="w-[250px] h-[40px] bg-white/90 cursor-pointer rounded-[24px] text-black">Get Started</button>
                    </Link>
                </div>
            </div>
            <div className="w-full flex mt-6">
                <div className="w-full flex flex-wrap gap-5">
                    <div className="flex-[1_1_450px] ">
                        <img src="/image/Yuthasas.png" alt="YuthasasLogo" className="w-[90px] h-[90px] relative -left-5" />
                        <div className="flex gap-24">
                            <div className="flex flex-col gap-2">
                                <Link href="/businesses" className="block">Businesses</Link>
                                <Link href="/features" className="block">Feature</Link>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div>Blog Guide</div>
                                <Link href="/blog" className="block">Blog</Link>
                                <Link href="/guide" className="block">Guide</Link>
                                <Link href="/#pricing" className="block">Pricing</Link>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href="/services" className="block">Services</Link>
                                <Link href="/about" className="block">About Us</Link>
                                <Link href="/contact" className="block">Contact Us</Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex-[1_1_250px] flex flex-col justify-center  gap-6 mt-[80px]">
                        <form method="post" encType="text/plain" className="flex flex-col gap-6">
                            <div className="w-full flex gap-6 ">
                                <div className="flex flex-col">
                                    <label htmlFor="footerFirstName" className="text-[13px]">First Name</label>
                                    <input id="footerFirstName" name="firstName" type="text" className="focus:outline-0 w-[130px] border-b border-black mt-2" />
                                </div>
                                <div className="flex flex-col ">
                                    <label htmlFor="footerLastName" className="text-[13px]">Last Name</label>
                                    <input id="footerLastName" name="lastName" type="text" className="focus:outline-0 border-b w-[250px] border-black mt-2" />
                                </div>
                            </div>
                            <div className="w-full flex flex-col">
                                <label htmlFor="footerEmail" className="text-[13px]">Email (required) </label>
                                <input id="footerEmail" name="email" type="email" className="focus:outline-0 border-b border-black mt-2" />
                            </div>
                            <div className="w-full flex flex-col gap-5">
                                <label htmlFor="footerComment" className="text-[13px]">Comment </label>
                                <div className="w-full">
                                    <textarea id="footerComment" name="comment" className="border w-[450px] max-[490px]:w-[90vw] border-black rounded-2xl resize-y focus:outline-0 p-6"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="w-full border border-dashed border-[#777777] mt-5">

            </div>
            <div className="w-full font-[Gilroy-Medium] flex flex-wrap justify-between mt-4 pb-3 gap-y-5">
                <div className="flex gap-12">
                    <Link href="/cookie-policy">Cookies Policy</Link>
                    <Link href="/legal-terms">Legal Terms</Link>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                </div>
                <div className="flex gap-x-5 flex-wrap">
                    <p>Connect: </p>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                </div>
            </div>
        </>
    )
}
export default footer
