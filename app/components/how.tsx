const How  = () => {
    return (
        <>
            <div className="w-full font-[Gilroy-Medium] rounded-[30px_30px_0_0] flex flex-wrap" 
            style={{
                backgroundImage: "url(https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg)",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}>
                <div className="text-white w-full p-12">
                    <p className="text-2xl">20% Discount</p>
                    <p className="text-[#8d8d8d]">Get 20% off your first recharge when you upgrade to the Premium version.</p>
                </div>
                <div className="w-full flex flex-wrap ">
                    <div className="flex-[1_1_450px] flex h-[250px] relative flex-col justify-end items-center gap-4">
                        <div className="flex gap-2 flex-wrap justify-center">
                            <button type="button" className="text-black p-[5px_40px] transform-[rotate(-12deg)] bg-white rounded-[16px]">Reliability</button>
                            <button type="button" className="text-black p-[5px_40px] transform-[rotate(5deg)] bg-white rounded-[16px]">Efficiency</button>
                            <button type="button" className="text-black p-[5px_40px] transform-[rotate(-5deg)] bg-white rounded-[16px]">Lower Cost</button>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-center">
                            <button type="button" className="text-black p-[5px_40px] transform-[rotate(-6deg)] bg-white rounded-[16px]">Future Plans</button>
                            <button type="button" className="text-black p-[5px_40px] transform-[rotate(2deg)] bg-white rounded-[16px]">Savings</button>
                            <button type="button" className="text-black p-[5px_40px] transform-[rotate(4deg)] bg-white rounded-[16px]">Long-term goals</button>
                        </div>
                    </div>
                    <div className="flex-[1_1_150px] rounded-[24px_0_0_0] h-[280px] border border-white overflow-hidden p-6" style={{
                        
                    }}>
                        <img src="https://images.pexels.com/photos/9775901/pexels-photo-9775901.jpeg" className="w-full h-full object-cover" alt="" />
                    </div>
                </div>
            </div>
            
        </>
    )
}
export default How
