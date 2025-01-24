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
    filters: ["partner", "facility", "partnerFacility", "wasteType", "date"],
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
    filters: ["partner", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "facility",
      aggregate: true,
    },
  });


  
  const colorForFacility = useCallback(
    (facility: Facility) => {
      // Define the base lightness value for the color, which serves as the starting point for color calculation
      const baseColor = 56.83;
      // Define the decrement value, which is used to reduce the lightness for each subsequent facility in the list
      const decrement = 20;
      // Find the index of the facility in the selectedFacilities array by matching the facility's id
      // The findIndex method iterates over the selectedFacilities array and returns the index of the first element that satisfies the provided testing function
      // If the facility is found, facilityIndex will be the position of the facility in the array; otherwise, it will be -1
      const facilityIndex = selectedFacilities.findIndex(
        (selectedFacility) => selectedFacility.id === facility.id,
      );
      // Reverse the index to calculate the lightness value by subtracting the product of the reversed index and decrement from baseColor
      // This calculation adjusts the lightness based on the facility's position in the selectedFacilities array, but in reverse order
      const reversedIndex = selectedFacilities.length - 1 - facilityIndex;
      const lightness = baseColor - reversedIndex * decrement;
      // Return a color in the oklch color space format if the facility is found in the selectedFacilities array
      // If the facilityIndex is not -1, it means the facility is selected, and a specific color is returned
      // Otherwise, return a default gray color "#d4d4d4" if the facility is not found
      return facilityIndex !== -1
        ? `oklch(${lightness}% 0.1812 267.38)`
        : "#d4d4d4";
    },
    // Specify selectedFacilities as a dependency for the useCallback hook
    // This ensures that the function is re-created only when selectedFacilities changes
    [selectedFacilities],
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
      onSelectItem={(item) => dispatch(toggleFacility(item))}
      colorForItem={colorForFacility}
    />
  );
};

export default FacilityFootprintSimple;
