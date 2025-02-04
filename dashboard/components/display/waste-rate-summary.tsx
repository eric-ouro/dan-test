"use client";

import { useMemo } from "react";
import DashboardDisplayHeader from "@components/dashboard-display-header";
import { DbObject, EnrichedWasteRateSummary } from "@/lib/types";
import { useAppSelector } from "@/lib/hooks/store-hooks";
import { RootState } from "@/lib/store/configuration";

interface WasteRateSummaryProps<T extends DbObject> {
  name: string | null;
  summaries: EnrichedWasteRateSummary[];
  filteredSummaries: EnrichedWasteRateSummary[];
  onSelectItem: (item: T) => void;
  colorForItem: (item: T) => string;
}

const WasteRateSummary = <T extends DbObject>({
  name,
  summaries,
  filteredSummaries,
  onSelectItem,
  colorForItem,
}: WasteRateSummaryProps<T>) => {
  const showVariant = useAppSelector((state: RootState) => state.accountedToggle.showVariant);

  const totalQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [summaries]);

  const totalAccountedQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.accounted, 0);
  }, [summaries]);

  const totalFilteredQuantity = useMemo(() => {
    return filteredSummaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredSummaries]);

  const totalFilteredAccountedQuantity = useMemo(() => {
    return filteredSummaries.reduce((acc, curr) => acc + curr.accounted, 0);
  }, [filteredSummaries]);

  const clickableSummaries = useMemo(() => {
    return summaries.filter((item) => item.quantity > 0);
  }, [summaries]);
  
  

  return (
    <div className="dashcomponent">
      <div className="flex flex-col gap-1 overflow-hidden h-full">
        {name && <DashboardDisplayHeader headerText={name} />}
        <div className="flex-grow flex gap-1 h-[128px]">
          {filteredSummaries.map((item, index) => {
            const totalWidthPercentage = showVariant
              ? (item.quantity / totalFilteredQuantity) * 100
              : (item.accounted / totalFilteredAccountedQuantity) * 100;
            const processingLossRate = item.percentage;
            // TODO: include whether a waste type is mixed, and pull from db into data layer
            return (
              <div
                key={index}
                className="relative flex flex-col items-center min-w-[40px] w-full text-white font-regular"
                style={{ width: `${totalWidthPercentage.toFixed(1)}%` }}
              >
                <div
                  className={`flex-grow flex-col items-end justify-left w-full min-h-[24px] rounded-sm`}
                  style={{
                    height: `${processingLossRate.toFixed(1)}%`,
                    transition:
                      "height 200ms ease, background-color 200ms ease",
                    background: colorForItem(item.label as T),
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
            const footprintPercentage = showVariant
              ? (item.quantity / totalQuantity) * 100
              : (item.accounted / totalAccountedQuantity) * 100;
            // TODO: include whether a waste type is mixed, and pull from db into data layer
            return (
              <div
                key={index}
                className={`flex items-end justify-left min-w-[40px] text-white rounded-sm text-sm font-regular cursor-pointer`}
                onClick={() => {
                  onSelectItem(item.label as T);
                }}
                style={{
                  width: `${footprintPercentage}%`,
                  transition: "background-color 200ms ease",
                  background: colorForItem(item.label as T),
                  opacity: 0.9
                }}
              >
                <div className="p-2 w-0 flex flex-row">
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

export default WasteRateSummary;
