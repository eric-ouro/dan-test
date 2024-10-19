"use client";

import { useMemo } from "react";
import { useWasteRateSummaries } from "@/lib/hooks/use-waste-rate-summaries";
import DashboardDisplayHeader from "@components/dashboard-display-header";

const PlasticFootprintSimple = () => {
  const { data: summaries, loading, error } = useWasteRateSummaries();

  const totalQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [summaries]);

  const clickableSummaries = useMemo(() => {
    return summaries.filter((item) => item.quantity > 0);
  }, [summaries]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashcomponent">
      <div className="flex flex-col gap-3 overflow-hidden h-full">
        <DashboardDisplayHeader headerText="Plastic Footprint" />
        <div className="flex-grow flex gap-1 h-[128px]">
          {summaries.map((item, index) => {
            const totalWidthPercentage = (item.quantity / totalQuantity) * 100;
            const processingLossRate = item.percentage;
            // TODO: include whether a waste type is mixed, and pull from db into data layer
            const displayLabel = item.label;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center min-w-[40px] w-full text-white font-regular"
                style={{ width: `${totalWidthPercentage.toFixed(1)}%` }}
              >
                <div
                  className={`flex-grow flex-col items-end justify-left w-full min-h-[24px] rounded-sm bg-neutral-300`}
                  style={{
                    height: `${processingLossRate.toFixed(1)}%`,
                    transition:
                      "height 200ms ease, background-color 200ms ease",
                  }}
                >
                  <div className="p-2 flex flex-col justify-between overflow-hidden sm:flex-row">
                    <div>{displayLabel}</div>
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
            const displayLabel = item.label;
            return (
              <div
                key={index}
                className={`flex items-end justify-left min-w-[40px] text-white rounded-sm text-sm font-regular cursor-pointer bg-neutral-300`}
                onClick={() => {
                  // TODO: click behavior
                }}
                style={{
                  width: `${footprintPercentage}%`,
                  transition: "background-color 200ms ease",
                }}
              >
                <div className="p-2 w-0 ">
                  {displayLabel} {footprintPercentage.toFixed(1)}%
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
