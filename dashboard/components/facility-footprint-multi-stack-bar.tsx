"use client";

import { useEnrichedWasteRateSummariesWithRatios } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { EnrichedWasteRateSummaryWithRatios, SortConfig } from "@/lib/types";
import MultiStackBar from "@components/display/multi-stack-bar";
import MultiStackBarWithToggle from "@components/display/multi-stack-bar";
import { useState } from "react";

const FacilityFootprintMultiStackBar = () => {
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummariesWithRatios({
    filters: ["partner", "facility", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "facility",
      aggregate: false,
    },
  });

  if (summariesLoading) return <div>Loading...</div>;
  if (summariesError) return <div>Error: {summariesError}</div>;

  const totalAccountedForAllSummaries = summaries.reduce(
    (acc, curr) => acc + curr.accounted,
    0
  );

  const facilitySummaries = summaries.reduce<
    Record<string, { summaries: EnrichedWasteRateSummaryWithRatios[]; percentage: number }>
  >((acc, curr) => {
    acc[curr.group] ??= { summaries: [], percentage: 0 };
    acc[curr.group].summaries.push(curr);
    return acc;
  }, {});

  Object.keys(facilitySummaries).forEach((group) => {
    const groupTotalAccounted = facilitySummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.accounted,
      0
    );
    facilitySummaries[group].percentage = (groupTotalAccounted / totalAccountedForAllSummaries) * 100;
  });

  const largestPercentage = Math.max(
    ...Object.values(facilitySummaries).map(item => item.percentage)
  );

  return (
    <>
    
      {Object.values(facilitySummaries).map((item) => (
        console.log("item", item),
          <MultiStackBarWithToggle
            name={item.summaries[0].groupName}
            percentage={item.percentage}
            summaries={item.summaries}
            largestPercentage={largestPercentage}
            testprop={1}
          />
      ))}
    </>
  );
};

export default FacilityFootprintMultiStackBar;
