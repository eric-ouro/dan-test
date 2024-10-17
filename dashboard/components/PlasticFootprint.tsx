"use client";
import React from "react";
import { MAPPING_DARK, MAPPING_LIGHT } from "../common/colors";
import {  RecyclingRecord, MixedPlasticRecyclingData, RecyclingData } from "../common/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { setToItems } from "@/app/store/selectedPlasticsSlice";
import DashboardDisplayHeader from "@/components/DashboardDisplayHeader";
import { calculateSummaries } from "@/app/utils/calculateSummaries";
import { calculateItemRatios } from "@/app/utils/calculateItemRatios";

const PlasticFootprint = () => {
  const selectedPlastics = useSelector(
    (state: RootState) => state.selectedPlastics.selectedPlastics
  );
  const selectedPartners = useSelector(
    (state: RootState) => state.selectedPartners.selectedPartners
  );
  const selectedFacilities = useSelector(
    (state: RootState) => state.selectedFacilities.selectedFacilities
  );
  const selectedPartnerFacilities = useSelector(
    (state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities
  );

  const plastics = useSelector((state: RootState) => state.recyclingRecords);

  const dispatch = useDispatch();

  if (plastics.status === "loading") {
    return <div className="bg-neutral-100 rounded-lg border shadow-sm p-6 mr-6 h-[344px]">
    <div className="h4 w-[140px] rounded-full bg-neutral-300">&nbsp;</div>
  </div>;
  }

  if (plastics.status === "failed") {
    return <div>{`ERROR: ${plastics.error}`}</div>;
  }

  const { records } = plastics;

  const filteredRecords = records.filter((record: RecyclingRecord) => {
    const partnerMatch = selectedPartners.some(partner => partner.CompanyID === record.PartnerCompanyID);
    const facilityMatch = selectedFacilities.some(facility => facility.facilityID === record.FacilityID);
    const partnerFacilityMatch = selectedPartnerFacilities.some(partnerFacility => partnerFacility.facilityID === record.PartnerFacilityID);
    return partnerMatch && facilityMatch && partnerFacilityMatch;
  });

  const summaries = calculateSummaries(filteredRecords);

  const totalQuantity = summaries.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const selectedData = summaries.filter(
    (item) => selectedPlastics.includes(item.label) && item.quantity > 0,
  );

  const clickySummaries = summaries.filter(
    (item) => item.quantity > 0
  );

  const totalSelectedQuantity = selectedData.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const sortedSelectedData = [...selectedData].sort((a, b) => b.quantity - a.quantity);

  const sortedClickySummaries = [...clickySummaries].sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="dashcomponent">
      <div className="flex flex-col gap-1 overflow-hidden h-full">
      <DashboardDisplayHeader
        headerText="Plastic Footprint & Recycle Rates"
      />
        <div className="flex-grow flex gap-1 h-[300px]">
          {sortedSelectedData.map((item, index) => {
            const totalWidthPercentage =
              (item.quantity / totalSelectedQuantity) * 100;
            const rates = calculateItemRatios(item);
            const recycleRate = rates.get('recycleRate');
            const recyclingLossRate = rates.get('recyclingLossRate');
            const processingLossRate = rates.get('processingLossRate');
            const recyclingLossQuantity = rates.get('recyclingLossQuantity');
            const processingLoss = rates.get('processingLoss');

            return (
               <div
                key={index}
                className="relative flex flex-col items-center min-w-28 w-full text-white text-xs font-regular"
                style={{ width: `${totalWidthPercentage.toFixed(1)}%` }}
              >
                <div
                  className={`flex-grow flex-col items-end justify-left w-full min-h-[28px] rounded-t-sm bg-neutral-500`}
                  style={{
                    height: `${processingLossRate.toFixed(1)}%`,
                    transition: "height 200ms ease, background-color 200ms ease",
                  }}
                >
                  <div className="p-3 flex flex-col justify-between overflow-hidden sm:flex-row">
                    <div>
                      {item.quantity > 0
                        ? (<><svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M1 6h22" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                        {processingLossRate.toFixed(1)}% 
                        </>)
                        : "N/A"}
                    </div>
                  
                    <div>
                    {processingLoss.toFixed(1)}/{item.quantity.toFixed(1)}tn 
                    </div>
                  </div>
                </div>
                
                
                
                <div
                  className={`flex-grow flex-col items-end justify-left w-full min-h-[28px] ${MAPPING_DARK[item.label]}`}
                  style={{
                    height: `${recyclingLossRate.toFixed(1)}%`,
                    transition: "height 200ms ease, background-color 200ms ease",
                  }}
                >
                  <div className="p-3 flex flex-col justify-between overflow-hidden sm:flex-row">
                    <div>
                      {item.quantity > 0
                        ? (<><svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M1 6h22" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                        {recyclingLossRate.toFixed(1)}% 
                        </>)
                        : "N/A"}
                    </div>
                  
                    <div>
                    {recyclingLossQuantity.toFixed(1)}/{item.quantity.toFixed(1)}tn 
                    </div>
                  </div>
                </div>
                
                
                
                <div
                  className={`flex-grow flex-col items-end justify-left w-full rounded-b-sm min-h-[28px] ${MAPPING_LIGHT[item.label]}`}
                  style={{
                    height: `${recycleRate.toFixed(1)}%`,
                    transition: "height 200ms ease, background-color 200ms ease",
                  }}
                >
                  <div className="p-3 flex flex-col justify-between overflow-hidden sm:flex-row">
                    <div>
                    {item.quantity > 0
                      ? (<><svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.38-3.36L23 10M1 14l5.09 5.09A9 9 0 0020.49 15" /></svg>
                      {recycleRate.toFixed(1)}% </>)
                      : "N/A"}
                    </div>
                    <div>
                    {item.recycled.toFixed(1)}/{item.quantity.toFixed(1)}tn 
                    </div>
                 </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 overflow-hidden ">
          {sortedClickySummaries.map((item, index) => (
            <div
              key={index}
              className={`flex items-end justify-left min-w-28 text-white rounded-sm text-sm font-regular cursor-pointer ${
                selectedPlastics.includes(item.label)
                  ? MAPPING_LIGHT[item.label]
                  : "bg-neutral-300"
              }`}
              onClick={() => {
                const newSelectedPlastics = selectedPlastics.includes(item.label)
                  ? selectedPlastics.filter((plastic) => plastic !== item.label)
                  : [...selectedPlastics, item.label];
                dispatch(setToItems(newSelectedPlastics));
              }}
              style={{
                width: `${(item.quantity / totalQuantity) * 100}%`,
                transition: "background-color 200ms ease",
              }}
            >
              <div className="p-2 w-0 ">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
);
};

export default PlasticFootprint;
