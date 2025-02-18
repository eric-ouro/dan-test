"use client";

import { useCallback } from "react";
import { useEnrichedWasteRateSummaries } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/store-hooks";
import { toggleWasteType } from "@store/slices/selected-waste-types-slice";
import { WasteType } from "@/lib/types";
import WasteRateSummaryPie from "@components/display/waste-rate-summary-pie";

const PlasticFootprintSimplePie = () => {
  const dispatch = useAppDispatch();
  const selectedWasteTypes = useAppSelector(
    (state) => state.selectedWasteTypes.selected,
  );
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
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["partner", "facility", "partnerFacility", "date"],
    groupConfig: {
      group: "none",
      aggregate: false,
    },
  });

  const colorForWasteType = useCallback(
    (wasteType: WasteType) => {
      return selectedWasteTypes.some(
        (selectedWasteType) => selectedWasteType.id === wasteType.id,
      )
        ? `#${wasteType.display_color}`
        : "#d4d4d4";
    },
    [selectedWasteTypes],
  );

  if (filteredSummariesLoading || summariesLoading)
    return <div>Loading...</div>;
  if (filteredSummariesError || summariesError)
    return <div>Error: {filteredSummariesError ?? summariesError}</div>;

  return (
    <WasteRateSummaryPie
      name=""
      summaries={summaries}
      filteredSummaries={filteredSummaries}
      onSelectItem={(item) => dispatch(toggleWasteType(item))}
      colorForItem={colorForWasteType}
    />
  );
};

export default PlasticFootprintSimplePie;
