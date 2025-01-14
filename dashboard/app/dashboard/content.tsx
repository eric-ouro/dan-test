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
    <>
      <div className="tabs [&>*:not(:first-child)]:pl-6">
        <button onClick={() => setActiveTab("plastics")}>Plastics</button>
        <button onClick={() => setActiveTab("partners")}>Partners</button>
        <button onClick={() => setActiveTab("facilities")}>Facilities</button>
      </div>

      {activeTab === "plastics" && (
        <>
          <PlasticFootprintSimple />
          <PlasticFootprintMultiStackBar />
        </>
      )}

      {activeTab === "partners" && (
        <>
          <PartnerFootprintSimple />
          <PartnerFootprintMultiStackBar />
        </>
      )}

      {activeTab === "facilities" && (
        <>
          <FacilityFootprintSimple />
          <FacilityFootprintMultiStackBar />
        </>
      )}
    </>
  );
};

export default (DashboardContent);
