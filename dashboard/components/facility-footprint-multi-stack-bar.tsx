"use client";

import { useEnrichedWasteRateSummariesWithRatios } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { EnrichedWasteRateSummaryWithRatios } from "@/lib/types";
import MultiStackBar from "@components/display/multi-stack-bar";

const FacilityFootprintMultiStackBar = () => {
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummariesWithRatios({
    filters: ["partner", "facility", "partnerFacility", "wasteType"],
    groupConfig: {
      group: "facility",
      aggregate: false,
    },
  });

  if (summariesLoading) return <div>Loading...</div>;
  if (summariesError) return <div>Error: {summariesError}</div>;

  // group summaries by facility and render a multi stack bar for each facility
  const facilitySummaries = summaries.reduce<
    Record<string, EnrichedWasteRateSummaryWithRatios[]>
  >((acc, curr) => {
    acc[curr.group] ??= [];
    acc[curr.group].push(curr);
    return acc;
  }, {});

  return (
    <>
      {Object.values(facilitySummaries).map((summaries) => (
        <MultiStackBar name={summaries[0].groupName} summaries={summaries} />
      ))}
    </>
  );
};

export default FacilityFootprintMultiStackBar;
