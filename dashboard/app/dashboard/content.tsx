'use client'
import { useState } from "react";

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

  return (
    <div>
        <div className="responsive-padding border-b border-b-foreground/20 bg-background sticky pt-[37px] pb-[15px] top-0 z-20 flex flex-col justify-start items-left  gap-4">
            <div className="flex flex-row items-center gap-4 sans text-3xl  ">
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
    
  );
};

export default (DashboardContent);
