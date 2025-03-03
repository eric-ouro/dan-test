"use client";

import CandyCode from "@/public/candy_code.svg";
import CandyGlobe from "@/public/candy_globe.svg";
import CandyJapan from "@/public/candy_japan.svg";
import CandyRecycle from "@/public/candy_recycle.svg";

export default function CandyImages() {
  return (
    <div className=" bg-white opacity-75 border-black z-0 w-1/2 max-w-[600px] min-w-[470px] h-1/3 border-2 absolute left-1/2 top-[280px] transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
      <CandyGlobe className=" absolute top-2 left-2 m-2 h-[46px] fill-[#1c1c1c]" />
      <CandyRecycle className="absolute top-2 right-2 m-2 h-[46px] fill-[#1c1c1c] " />
      <CandyCode className="absolute bottom-2 left-2 m-2 h-[46px] fill-[#1c1c1c]" />
      <CandyJapan className="absolute bottom-2 right-2 m-2 h-[46px] fill-[#1c1c1c]" />
    </div>
  );
}