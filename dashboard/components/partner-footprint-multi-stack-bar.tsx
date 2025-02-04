"use client";

import { useEnrichedWasteRateSummariesWithRatios } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { EnrichedWasteRateSummaryWithRatios } from "@/lib/types";
import MultiStackBar from "@components/display/multi-stack-bar";

const PartnerFootprintMultiStackBar = () => {
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummariesWithRatios({
    filters: ["partner", "facility", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "partner",
      aggregate: false,
    },
  });

  if (summariesLoading) return <div>Loading...</div>;
  if (summariesError) return <div>Error: {summariesError}</div>;

  // Calculate total accounted for all summaries
  const totalAccountedForAllSummaries = summaries.reduce(
    (acc, curr) => acc + curr.accounted,
    0
  );

  // Group summaries by partner and calculate percentage
  const partnerSummaries = summaries.reduce<
    Record<string, { summaries: EnrichedWasteRateSummaryWithRatios[]; accountedPercentage: number; quantityPercentage: number }>
  >((acc, curr) => {
    acc[curr.group] ??= { summaries: [], accountedPercentage: 0, quantityPercentage: 0 };
    acc[curr.group].summaries.push(curr);
    return acc;
  }, {});

  // Calculate percentage for each partner group
  Object.keys(partnerSummaries).forEach((group) => {
    const groupTotalAccounted = partnerSummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.accounted,
      0
    );
    partnerSummaries[group].accountedPercentage = (groupTotalAccounted / totalAccountedForAllSummaries) * 100;

    const groupTotalQuantity = partnerSummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    partnerSummaries[group].quantityPercentage = (groupTotalQuantity / totalAccountedForAllSummaries) * 100;
  });

  // Find the largest percentage
  const accountedPercentageLargest = Math.max(
    ...Object.values(partnerSummaries).map(item => item.accountedPercentage)
  );

  const quantityPercentageLargest = Math.max(
    ...Object.values(partnerSummaries).map(item => item.quantityPercentage)
  );

  return (
    <>
      {Object.values(partnerSummaries).map((item) => (
        <MultiStackBar
          name={item.summaries[0].groupName}
          accountedPercentage={item.accountedPercentage}
          quantityPercentage={item.quantityPercentage}
          summaries={item.summaries}
          accountedPercentageLargest={accountedPercentageLargest}
          quantityPercentageLargest={quantityPercentageLargest}
          showTableHeader={true}
          defaultTableDataVisible={Object.values(partnerSummaries).length === 1}
        />
      ))}
    </>
  );
};

export default PartnerFootprintMultiStackBar;
