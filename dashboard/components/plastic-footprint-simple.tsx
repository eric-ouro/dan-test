"use client";

import { useCallback, useMemo } from "react";
import { useEnrichedWasteRateSummaries } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import DashboardDisplayHeader from "@components/dashboard-display-header";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/store-hooks";
import { toggleWasteType } from "@store/slices/selected-waste-types-slice";
import { WasteType } from "@/lib/types";

const PlasticFootprintSimple = () => {
  const dispatch = useAppDispatch();
  const selectedWasteTypes = useAppSelector(
    (state) => state.selectedWasteTypes.selected,
  );
  const {
    data: filteredSummaries,
    loading: filteredSummariesLoading,
    error: filteredSummariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["partner", "facility", "partnerFacility", "wasteType"],
  });
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["partner", "facility", "partnerFacility"],
  });

  const totalQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [summaries]);

  const clickableSummaries = useMemo(() => {
    return summaries.filter((item) => item.quantity > 0);
  }, [summaries]);

  const colorForWasteType = useCallback(
    (wasteType: WasteType) => {
      return selectedWasteTypes.some(
        (selectedWasteType) => selectedWasteType.id === wasteType.id,
      )
        ? "bg-red-500"
        : "bg-neutral-300";
    },
    [selectedWasteTypes],
  );

  if (filteredSummariesLoading || summariesLoading)
    return <div>Loading...</div>;
  if (filteredSummariesError || summariesError)
    return <div>Error: {filteredSummariesError ?? summariesError}</div>;

  return (
    <div className="dashcomponent">
      <div className="flex flex-col gap-3 overflow-hidden h-full">
        <DashboardDisplayHeader headerText="Plastic Footprint" />
        <div className="flex-grow flex gap-1 h-[128px]">
          {filteredSummaries.map((item, index) => {
            const totalWidthPercentage = (item.quantity / totalQuantity) * 100;
            const processingLossRate = item.percentage;
            // TODO: include whether a waste type is mixed, and pull from db into data layer
            return (
              <div
                key={index}
                className="relative flex flex-col items-center min-w-[40px] w-full text-white font-regular"
                style={{ width: `${totalWidthPercentage.toFixed(1)}%` }}
              >
                <div
                  className={`flex-grow flex-col items-end justify-left w-full min-h-[24px] rounded-sm ${colorForWasteType(item.label)}`}
                  style={{
                    height: `${processingLossRate.toFixed(1)}%`,
                    transition:
                      "height 200ms ease, background-color 200ms ease",
                  }}
                >
                  <div className="p-2 flex flex-col justify-between overflow-hidden sm:flex-row">
                    <div>{item.label.name}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 overflow-hidden">
          {clickableSummaries.map((item, index) => {
            const footprintPercentage =
              totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
            // TODO: include whether a waste type is mixed, and pull from db into data layer
            return (
              <div
                key={index}
                className={`flex items-end justify-left min-w-[40px] text-white rounded-sm text-sm font-regular cursor-pointer ${colorForWasteType(item.label)}`}
                onClick={() => {
                  dispatch(toggleWasteType(item.label));
                }}
                style={{
                  width: `${footprintPercentage}%`,
                  transition: "background-color 200ms ease",
                }}
              >
                <div className="p-2 w-0 ">
                  {item.label.name} {footprintPercentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlasticFootprintSimple;
