"use client";

import { useCallback } from "react";
import { useEnrichedWasteRateSummaries } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/store-hooks";
import { togglePartner } from "@store/slices/selected-partners-slice";
import { Company } from "@/lib/types";
import WasteRateSummary from "./display/waste-rate-summary";

const PartnerFootprintSimple = () => {
  const dispatch = useAppDispatch();
  const selectedPartners = useAppSelector(
    (state) => state.selectedPartners.selected,
  );
  const {
    data: filteredSummaries,
    loading: filteredSummariesLoading,
    error: filteredSummariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["partner", "facility", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "partner",
      aggregate: true,
    },
  });
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummaries({
    filters: ["facility", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "partner",
      aggregate: true,
    },
  });

  const colorForPartner = useCallback(
    (partner: Company) => {
      const baseColor = 56.83; // Base lightness value
      const decrement = 20; // Decrement value for each consecutive partner
      const partnerIndex = selectedPartners.findIndex(
        (selectedPartner) => selectedPartner.id === partner.id,
      );
      const lightness = baseColor - partnerIndex * decrement;
      return partnerIndex !== -1
        ? `oklch(${lightness}% 0.1812 267.38)`
        : "#d4d4d4";
    },
    [selectedPartners],
  );

  if (filteredSummariesLoading || summariesLoading)
    return <div>Loading...</div>;
  if (filteredSummariesError || summariesError)
    return <div>Error: {filteredSummariesError ?? summariesError}</div>;

  return (
    <WasteRateSummary
      name=""
      summaries={summaries}
      filteredSummaries={filteredSummaries}
      onSelectItem={(item) => dispatch(togglePartner(item))}
      colorForItem={colorForPartner}
    />
  );
};

export default PartnerFootprintSimple;
