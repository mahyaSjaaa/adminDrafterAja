import { poppinsSB } from "@/fonts/font"

type handleCard = {
    url: string,
    labelAatas: string,
}

export default function Card ({url, labelAatas,}: handleCard) {
    return(
        <div className="w-[50%] lg:h-[80px] md:h-[80px] sm:h-[80px] h-[80px] flex mb-2 ">
        <div className="bg-[#4F2916] text-[#FEF0D5] h-full w-full rounded-md">
            <div className="flex items-center text-center mx-10 h-full py-2 gap-2 md:gap-5">
                <h3 className={`${poppinsSB.className} text-[20px] md:text-[24px]`}>{url}</h3>
                <p className={`${poppinsSB.className} text-[12px] md:text-[16px]`}>{labelAatas}</p>
            </div>
        </div>
        </div>
    )
}