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

  // group summaries by partner and render a multi stack bar for each partner
  const partnerSummaries = summaries.reduce<
    Record<string, EnrichedWasteRateSummaryWithRatios[]>
  >((acc, curr) => {
    acc[curr.group] ??= [];
    acc[curr.group].push(curr);
    return acc;
  }, {});

  return (
    <>
      {Object.values(partnerSummaries).map((summaries) => (
        <MultiStackBar
        name={summaries[0].groupName}
        summaries={summaries}
        showTableHeader={true}
        />
      ))}
    </>
  );
};

export default PartnerFootprintMultiStackBar;
