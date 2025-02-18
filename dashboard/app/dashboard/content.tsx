'use client'
import { useState } from "react";
import { useAppDispatch, useAppSelector } from '@/lib/hooks/store-hooks';
import { toggleAccountedVariant } from '@/lib/store/slices/toggle-slice';

import PlasticFootprintSimple from "@/components/plastic-footprint-simple";
import PlasticFootprintMultiStackBar from "@/components/plastic-footprint-multi-stack-bar";
import PartnerFootprintSimple from "@/components/partner-footprint-simple";
import PartnerFootprintMultiStackBar from "@/components/partner-footprint-multi-stack-bar";
import FacilityFootprintSimple from "@/components/facility-footprint-simple";
import FacilityFootprintMultiStackBar from "@/components/facility-footprint-multi-stack-bar";
import DropdownFilter from "@/components/ui/dropdown-filter";
import TotalAccountedSummary from "@/components/total-accounted-summary";
import MapComponent from "@/components/map";
import PlasticFootprintSimplePie from "@/components/plastic-footprint-simple-pie";
import FacilityFootprintSimplePie from "@/components/facility-footprint-simple-pie";
import PartnerFootprintSimplePie from "@/components/partner-footprint-simple-pie";

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState("materials");

  return (
    <div>
        <div className="bg-background sticky pt-1 pb-2 top-0 z-20 flex flex-col justify-start items-left gap-5">
        <DropdownFilter />
            <div className="flex flex-row items-center gap-3 sans text-lg mt-3 ">
              <button
                onClick={() => setActiveTab("materials")}
                className={`${activeTab === "materials" ? "text-foreground" : "opacity-30"} tracking-tight`}
              >
                Materials
              </button>
              <button
                onClick={() => setActiveTab("partners")}
                className={`${activeTab === "partners" ? "text-foreground" : "opacity-30"} tracking-tight`}
              >
                Partners
              </button>
              <button
                onClick={() => setActiveTab("facilities")}
                className={`${activeTab === "facilities" ? "text-foreground" : "opacity-30"} tracking-tight`}
              >
                Facilities
              </button>
            </div>
            
            <div className="flex flex-col gap-5 mt-3">
        <div>
          <TotalAccountedSummary />
        </div>
        {activeTab === "materials" && (
          <>
          <div className="flex flex-row gap-5 max-h-[254px]">
            <div className="w-full">
              <PlasticFootprintSimple />
            </div>
            <div className="">
              <PlasticFootprintSimplePie />
            </div>
          </div>
          <div>
              <PlasticFootprintMultiStackBar />
            </div>
          </>
        )}

        {activeTab === "partners" && (
          <>
            <div className="flex flex-row gap-5 max-h-[254px] ">
              <div className="w-full">
                <PartnerFootprintSimple />
              </div>
              <div className="">
                <PartnerFootprintSimplePie />
              </div>
            </div>
            <div>
              <PartnerFootprintMultiStackBar />
            </div>
          </>
        )}

        {activeTab === "facilities" && (
          <>
            <div className="flex flex-row gap-5 max-h-[254px]">
              <div className="w-full">
                <FacilityFootprintSimple />
              </div>
              <div className="">
                <FacilityFootprintSimplePie />
              </div>
            </div>
            <div>
              <FacilityFootprintMultiStackBar />
            </div>
          </>
        )}
        <div className="h-[100px]"></div>
      </div>
    
        </div>
    </div>
  );
};

export default DashboardContent;