"use client";

import { useCallback } from "react";
import { useEnrichedWasteRateSummaries } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/store-hooks";
import { toggleFacility } from "@store/slices/selected-facilities-slice";
import { Facility } from "@/lib/types";
import WasteRateSummary from "./display/waste-rate-summary";

const FacilityFootprintSimple = () => {
  const dispatch = useAppDispatch();
  const selectedFacilities = useAppSelector(
    (state) => state.selectedFacilities.selected,
  );
  const {
    data: filteredSummaries,
    loading: filteredSummariesLoading,
    error: filteredSummariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["partner", "facility", "partnerFacility", "wasteType"],
    groupConfig: {
      group: "facility",
      aggregate: true,
    },
  });
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["partner", "partnerFacility", "wasteType"],
    groupConfig: {
      group: "facility",
      aggregate: true,
    },
  });

  const colorForFacility = useCallback(
    (facility: Facility) => {
      return selectedFacilities.some(
        (selectedFacility) => selectedFacility.id === facility.id,
      )
        ? "#523D28"
        : "#d4d4d4";
    },
    [selectedFacilities],
  );

  if (filteredSummariesLoading || summariesLoading)
    return <div>Loading...</div>;
  if (filteredSummariesError || summariesError)
    return <div>Error: {filteredSummariesError ?? summariesError}</div>;

  return (
    <WasteRateSummary
      name="Facility Footprint"
      summaries={summaries}
      filteredSummaries={filteredSummaries}
      onSelectItem={(item) => dispatch(toggleFacility(item))}
      colorForItem={colorForFacility}
    />
  );
};

export default FacilityFootprintSimple;
