"use client";

import { useEffect, useState } from "react";
import { useSelectorFilters } from "@hooks/use-selector-filters";
import { useAppDispatch, useAppSelector } from "@hooks/store-hooks";
import { AsyncHookState, EnrichedWasteRate, EnabledFilters } from "@/lib/types";
import { fetchEnrichedWasteRatesIfEmpty } from "@store/slices/enriched-waste-rates-slice";

export const useEnrichedWasteRates = ({
  filters = [],
}: EnabledFilters): AsyncHookState<EnrichedWasteRate> => {
  const dispatch = useAppDispatch();
  const { data, error, status } = useAppSelector(
    (state) => state.enrichedWasteRates,
  );
  const [filteredData, setFilteredData] = useState<EnrichedWasteRate[]>([]);

  useEffect(() => {
    dispatch(fetchEnrichedWasteRatesIfEmpty());
  }, [dispatch]);

  const filterFn = useSelectorFilters<EnrichedWasteRate>({
    filterSpec: {
      lenses: {
        facility: filters.includes("facility")
          ? (item) => item.facility.id
          : undefined,
        partnerFacility: filters.includes("partnerFacility")
          ? (item) => item.partnerfacility.id
          : undefined,
        partner: filters.includes("partner")
          ? (item) => item.partnercompany.id
          : undefined,
        date: filters.includes("date") ? (item) => item.timerange : undefined,
        wasteType: filters.includes("wasteType")
          ? (item) => item.wastetype.id
          : undefined,
      },
    },
  });

  useEffect(() => {
    const filtered = data.filter(filterFn);
    setFilteredData(filtered);
  }, [data, filterFn]);

  return { data: filteredData, error, loading: status === "loading" };
};
