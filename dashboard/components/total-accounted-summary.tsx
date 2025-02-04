"use client";

import { useAppSelector } from "@/lib/hooks/store-hooks";
import { useEnrichedWasteRateSummaries } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { useCallback } from "react";

const TotalAccountedSummary = () => {
  const {
    data: filteredSummaries,
    loading: filteredSummariesLoading,
    error: filteredSummariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["partner", "facility", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "none",
      aggregate: false,
    },
  });

  const totalQuantity = filteredSummaries?.reduce(
    (acc, summary) => acc + summary.quantity,
    0
  ) || 0;

  const accountedQuantity = filteredSummaries?.reduce(
    (acc, summary) => acc + summary.accounted,
    0
  ) || 0;

  const calculateAccountedPercentage = useCallback(() => {
    return totalQuantity ? (accountedQuantity / totalQuantity) * 100 : 0;
  }, [totalQuantity, accountedQuantity]);

  const accountedPercentage = calculateAccountedPercentage();

  const showVariant = useAppSelector((state) => state.accountedToggle.showVariant);

  if (filteredSummariesLoading) return <div>Loading...</div>;
  if (filteredSummariesError)
    return <div>Error: {filteredSummariesError}</div>;

  return (
    <div>
      {showVariant ? (
        <div>
          <div className="tracking-tight text-xs uppercase opacity-50">
          {totalQuantity}kg tracked
          </div>
          <div className="flex w-full rounded-sm overflow-hidden ">
            <div
              className="bg-foreground/80 dark:bg-foreground/80"
              style={{
              width: "100%",
              height: "3px",
            }}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="tracking-tight text-xs uppercase opacity-50">
            {accountedPercentage.toFixed(2)}% Accounted •&nbsp;
            {accountedQuantity}kg / {totalQuantity}kg tracked
          </div>
          <div className="flex w-full rounded-sm overflow-hidden ">
            <div
              className="bg-foreground/80 dark:bg-foreground/80"
              style={{
                width: `${accountedPercentage}%`,
                height: "3px",
              }}
            />
            <div
              className="bg-foreground/20 dark:bg-foreground/20"
              style={{
                width: `${100 - accountedPercentage}%`,
                height: "3px",
                }}
            />
          </div>
          </div>
      )}
    </div>
  );
};

export default TotalAccountedSummary;