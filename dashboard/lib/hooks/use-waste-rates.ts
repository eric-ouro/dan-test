"use client";

import { createClient } from "@utils/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/store-hooks";
import { fetchDatesIfEmpty } from "@store/slices/selected-date-slice";
import { fetchFacilitiesIfEmpty } from "@store/slices/selected-facilities-slice";
import { fetchPartnersIfEmpty } from "@store/slices/selected-partners-slice";
import { fetchPartnerFacilitiesIfEmpty } from "@store/slices/selected-partner-facilities-slice";
import { fetchWasteTypesIfEmpty } from "@store/slices/selected-waste-types-slice";
import { AsyncHookState, WasteRate } from "@/lib/types";

const useWasteRateData = (): AsyncHookState<WasteRate> => {
  const [data, setData] = useState<WasteRate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("wasterates_monthly_facilitypartner")
        .select();

      if (error) {
        setError(error.message);
      } else {
        setData(data as WasteRate[]);
      }
      if (loading) {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return { data, error, loading };
};

export const useWasteRates = (): AsyncHookState<WasteRate> => {
  const dispatch = useAppDispatch();
  const { data, error, loading } = useWasteRateData();
  const [filteredData, setFilteredData] = useState<WasteRate[]>([]);

  const selectedFacilities = useAppSelector(
    (state) => state.selectedFacilities,
  );
  const selectedPartnerFacilities = useAppSelector(
    (state) => state.selectedPartnerFacilities,
  );
  const selectedPartners = useAppSelector((state) => state.selectedPartners);
  const selectedDateRange = useAppSelector((state) => state.selectedDate);
  const selectedWasteTypes = useAppSelector(
    (state) => state.selectedWasteTypes,
  );

  useEffect(() => {
    dispatch(fetchFacilitiesIfEmpty());
    dispatch(fetchPartnerFacilitiesIfEmpty());
    dispatch(fetchPartnersIfEmpty());
    dispatch(fetchDatesIfEmpty());
    dispatch(fetchWasteTypesIfEmpty());
  }, [dispatch]);

  const selectedValuesInitialized = useMemo(() => {
    return [
      selectedFacilities.status,
      selectedPartnerFacilities.status,
      selectedPartners.status,
      selectedDateRange.status,
      selectedWasteTypes.status,
    ].every((value) => value === "succeeded");
  }, [
    selectedFacilities.status,
    selectedPartnerFacilities.status,
    selectedPartners.status,
    selectedDateRange.status,
    selectedWasteTypes.status,
  ]);

  useEffect(() => {
    if (selectedValuesInitialized && data.length > 0) {
      const filteredData = data.filter((item) => {
        return (
          selectedFacilities.selected.some(
            (facility) => facility.id === item.facilityid,
          ) &&
          selectedPartnerFacilities.selected.some(
            (facility) => facility.id === item.partnerfacilityid,
          ) &&
          selectedPartners.selected.some(
            (partner) => partner.id === item.partnercompanyid,
          ) &&
          selectedDateRange.selected.start <= item.timerange &&
          selectedDateRange.selected.end >= item.timerange &&
          selectedWasteTypes.selected.some(
            (wasteType) => wasteType.id === item.wastetype,
          )
        );
      });
      setFilteredData(filteredData);
    }
  }, [
    data,
    selectedValuesInitialized,
    selectedFacilities.selected,
    selectedPartnerFacilities.selected,
    selectedPartners.selected,
    selectedDateRange.selected,
    selectedWasteTypes.selected,
  ]);

  return { data: filteredData, error, loading };
};
