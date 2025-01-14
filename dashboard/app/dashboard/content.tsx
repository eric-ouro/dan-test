'use client'
import { useState } from "react";

import PlasticFootprintSimple from "@/components/plastic-footprint-simple";
import PlasticFootprintMultiStackBar from "@/components/plastic-footprint-multi-stack-bar";
import PartnerFootprintSimple from "@/components/partner-footprint-simple";
import PartnerFootprintMultiStackBar from "@/components/partner-footprint-multi-stack-bar";
import FacilityFootprintSimple from "@/components/facility-footprint-simple";
import FacilityFootprintMultiStackBar from "@/components/facility-footprint-multi-stack-bar";

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState("plastics");

  return (
    <div>
        <div className="border-b border-neutral-400 sticky top-0 bg-accent z-20">
            <div className="tabs [&>*:not(:first-child)]:pl-6 responsive-padding">
                <button 
                    onClick={() => setActiveTab("plastics")} 
                    className={activeTab === "plastics" ? "text-foreground" : "opacity-50"}
                >
                    Plastics
                </button>
                <button 
                    onClick={() => setActiveTab("partners")} 
                    className={activeTab === "partners" ? "text-foreground" : "opacity-50"}
                >
                    Partners
                </button>
                <button 
                    onClick={() => setActiveTab("facilities")} 
                    className={activeTab === "facilities" ? "text-foreground" : "opacity-50"}
                >
                    Facilities
                </button>
            </div>
         </div>

      {activeTab === "plastics" && (
        <div className="responsive-padding">
          <PlasticFootprintSimple />
          <PlasticFootprintMultiStackBar />
        </div>
      )}

      {activeTab === "partners" && (
        <div className="responsive-padding">
          <PartnerFootprintSimple />
          <PartnerFootprintMultiStackBar />
        </div>
      )}

      {activeTab === "facilities" && (
        <div className="responsive-padding">
          <FacilityFootprintSimple />
          <FacilityFootprintMultiStackBar />
        </div>
      )}
    </div>
  );
};

export default (DashboardContent);
