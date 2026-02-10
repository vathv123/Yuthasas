const Count = () => {
    return (
        <>
            <div className="w-full flex flex-wrap gap-4 mt-6 font-[Gilroy-Medium]">
                <div className="flex-[1_1_250px] h-[120px]  flex justify-center items-center gap-4 relative -left-4">
                    {/* <svg width="54" height="54" viewBox="0 0 1024 1024"><title>User-outlined SVG Icon</title><path fill="#000" d="M858.5 763.6a374 374 0 0 0-80.6-119.5a375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1c-.4.2-.8.3-1.2.5c-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8c2-77.2 33-149.5 87.8-204.3c56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2M512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534"/></svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 1024 1024"><title>Contacts-filled SVG Icon</title><path fill="white" stroke="black" strokeWidth="16px"  d="M928 224H768v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H548v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H328v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H96c-17.7 0-32 14.3-32 32v576c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V256c0-17.7-14.3-32-32-32M661 736h-43.9c-4.2 0-7.6-3.3-7.9-7.5c-3.8-50.6-46-90.5-97.2-90.5s-93.4 40-97.2 90.5c-.3 4.2-3.7 7.5-7.9 7.5H363a8 8 0 0 1-8-8.4c2.8-53.3 32-99.7 74.6-126.1a111.8 111.8 0 0 1-29.1-75.5c0-61.9 49.9-112 111.4-112c61.5 0 111.4 50.1 111.4 112c0 29.1-11 55.5-29.1 75.5c42.7 26.5 71.8 72.8 74.6 126.1c.4 4.6-3.2 8.4-7.8 8.4M512 474c-28.5 0-51.7 23.3-51.7 52s23.2 52 51.7 52c28.5 0 51.7-23.3 51.7-52s-23.2-52-51.7-52"/></svg>
                    <div>
                        <p className="text-[30px]">10, 000+</p>
                        <p className="text-[18px]">Users Using</p>
                    </div>
                </div>
                <div className="flex-[1_1_250px] h-[120px]  flex justify-center items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 48 48"><title>Cleantimer SVG Icon</title><circle cx="24" cy="25.548" r="17.952" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M24 25.548V16.88M16.571 4.5H31.43m5.037 8.13l2.482-2.482l2.476 2.476l-2.68 2.68"/></svg>
                    <div>
                        <p className="text-[30px]">2. 00x</p>
                        <p className="text-[18px]">More Time Saving</p>
                    </div>
                </div>
                <div className="flex-[1_1_250px] h-[120px]  flex justify-center items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 48 48"><title>Finance-manager SVG Icon</title><path fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" d="M37.51 25.906a1.86 1.86 0 0 1-1.86 1.86h0a1.86 1.86 0 0 1-1.86-1.86h0a1.86 1.86 0 0 1 1.86-1.86h0a1.86 1.86 0 0 1 1.86 1.86"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M43.5 30.662a5 5 0 0 1-.423.018h-8.233a4.62 4.62 0 0 1-4.63-4.61v-.54a4.62 4.62 0 0 1 4.61-4.63h8.253q.215 0 .423.02"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.08 12.253h37.263c.64 0 1.157.517 1.157 1.158v26.786c0 .64-.516 1.157-1.157 1.157H5.657A1.155 1.155 0 0 1 4.5 40.201V13.308c0-1.228 1.866-1.883 3.33-2.132l26.23-4.465c2.528-.43 4.674 1.31 5.34 3.787l.45 1.676"/></svg>
                    <div>
                        <p className="text-[30px]">10. 000x</p>
                        <p className="text-[18px]">Better Management</p>
                    </div>
                </div>
                <div className="flex-[1_1_250px] h-[120px]  flex justify-center items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><title>Blackplayer SVG Icon</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M31.46 22.39v1.36m-13.64-5.97v3.7a.6.6 0 0 0 .34.54l3 1.44a.6.6 0 0 1 0 1.08l-3 1.44a.6.6 0 0 0-.34.54v3.7a1.2 1.2 0 0 0 1.72 1.08l14.16-6.76a.6.6 0 0 0 0-1.08L19.54 16.7a1.2 1.2 0 0 0-1.72 1.08m8.11 1.97v4m2.76 0v-2.68"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M24.86 2.52a21.48 21.48 0 0 0-22 17.79a1 1 0 0 0 .56 1.06l4.37 2.09a.6.6 0 0 1 0 1.08L3.4 26.63a1 1 0 0 0-.56 1.06a21.49 21.49 0 1 0 22-25.17Z"/></svg>
                    <div>
                        <p className="text-[30px]">20. 000+</p>
                        <p className="text-[18px]">Businesses Plan Out</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Count
