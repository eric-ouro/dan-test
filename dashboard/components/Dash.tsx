"use client";
import React from "react";
import PlasticFootPrint from "./PlasticFootprint";
import useGetTheData from "@/app/hooks/useGetTheData";
import StorePrinter from "./StorePrinter";
import PlasticFootprintPie from "./PlasticFootprintPie";
import Navbar from "./Navbar";
import PlasticFootprintMultiStackedBar from "./PlasticFootprintMultiStackedBar"
import PlasticFootprintSimple from "./PlasticFootprintSimple";
import PartnerFootprint from "./PartnerFootprint";
import MixedPlasticFootprint from "./MixedPlasticFootprint";
import MixedPlasticFootprintSimple from "./MixedPlasticFootprintSimple";
import MixedPlasticFootprintMultiStackedBar from "./MixedPlasticFootprintMultiStackedBar";
import FacilityFootprint from "./FaciltyFootprint";
const Dash = () => {
  
  useGetTheData();

  const [activeTab, setActiveTab] = React.useState('plastic');

  return (
    <div className="responsive-padding min-h-screen flex flex-col gap-8">
      <Navbar />
    
      <div className="flex flex-col gap-4">
      <PlasticFootprintSimple />
      <PlasticFootprintMultiStackedBar />
      <MixedPlasticFootprintSimple />
      <MixedPlasticFootprintMultiStackedBar />
      <PartnerFootprint />
      <FacilityFootprint />
      </div>
    </div>
  );
};

export default Dash;
