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

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState("materials");

  const dispatch = useAppDispatch();
  const showVariant = useAppSelector((state) => state.accountedToggle.showVariant);

  return (
    <div>
        <div className="responsive-padding bg-background sticky pt-3 pb-2 top-0 z-20 flex flex-col justify-start items-left gap-4">
       
            <div className="flex flex-row items-center gap-3 sans text-lg mt-2  ">
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
            <DropdownFilter />
            <div className="flex items-center bg-gray-200 rounded-md p-1 text-xs tracking-tight w-fit "
              onClick={() => dispatch(toggleAccountedVariant())}
            >
              <button
                className={`px-4 py-3 rounded-md transition-colors duration-300 ${
                  !showVariant ? "bg-white text-black" : "text-gray-500"
                }`}
              >
                Tracked
              </button>
              <button
                className={`px-4 py-3 rounded-md transition-colors duration-300 ${
                  showVariant ? "bg-white text-black" : "text-gray-500"
                }`}
              >
                All
              </button>
            </div>
            <div className="flex flex-col gap-5 mt-5 responsive-padding">
        <div>
          <TotalAccountedSummary />
        </div>
        {activeTab === "materials" && (
          <>
            <div>
              <PlasticFootprintSimple />
            </div>
            <div>
              <PlasticFootprintMultiStackBar />
            </div>
          </>
        )}

        {activeTab === "partners" && (
          <>
            <div>
              <PartnerFootprintSimple />
            </div>
            <div>
              <PartnerFootprintMultiStackBar />
            </div>
          </>
        )}

        {activeTab === "facilities" && (
          <>
            <div>
              <FacilityFootprintSimple />
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