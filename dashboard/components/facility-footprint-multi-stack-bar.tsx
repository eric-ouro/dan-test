"use client";

import { useEnrichedWasteRateSummariesWithRatios } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { EnrichedWasteRateSummaryWithRatios, SortConfig } from "@/lib/types";

import MultiStackBar from "@components/display/multi-stack-bar";


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
    Record<string, { summaries: EnrichedWasteRateSummaryWithRatios[]; accountedPercentage: number; quantityPercentage: number }>
  >((acc, curr) => {
    acc[curr.group] ??= { summaries: [], accountedPercentage: 0, quantityPercentage: 0 };
    acc[curr.group].summaries.push(curr);
    return acc;
  }, {});

  Object.keys(facilitySummaries).forEach((group) => {
    const groupTotalAccounted = facilitySummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.accounted,
      0
    );
    facilitySummaries[group].accountedPercentage = (groupTotalAccounted / totalAccountedForAllSummaries) * 100;

    const groupTotalQuantity = facilitySummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    facilitySummaries[group].quantityPercentage = (groupTotalQuantity / totalAccountedForAllSummaries ) * 100;
  });
  

  const accountedPercentageLargest = Math.max(
    ...Object.values(facilitySummaries).map(item => item.accountedPercentage)
  );

  const quantityPercentageLargest = Math.max(
    ...Object.values(facilitySummaries).map(item => item.quantityPercentage)
  );

  return (
    <>
      {Object.values(facilitySummaries).map((item) => (
          <MultiStackBar
            name={item.summaries[0].groupName}
            accountedPercentage={item.accountedPercentage}
            quantityPercentage={item.quantityPercentage}
            summaries={item.summaries}
            accountedPercentageLargest={accountedPercentageLargest}
            quantityPercentageLargest={quantityPercentageLargest}
            showTableHeader={true}
            defaultTableDataVisible={Object.values(facilitySummaries).length === 1}
          />
      ))}
    </>
  );
};

export default FacilityFootprintMultiStackBar;
