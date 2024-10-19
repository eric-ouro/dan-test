"use client";

import { createClient } from "@utils/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/store-hooks";
import { fetchDatesIfEmpty } from "@store/slices/selected-date-slice";
import { fetchFacilitiesIfEmpty } from "@store/slices/selected-facilities-slice";
import { fetchPartnersIfEmpty } from "@store/slices/selected-partners-slice";
import { fetchPartnerFacilitiesIfEmpty } from "@store/slices/selected-partner-facilities-slice";
import { fetchWasteTypesIfEmpty } from "@store/slices/selected-waste-types-slice";

interface WasteRate {
  facilityid: number;
  companyid: number;
  partnerfacilityid: number;
  partnercompanyid: number;
  timerange: string;
  parentwastetype: number;
  wastetype: number;
  processed: number;
  recycled: number;
}

const useWasteRateData = () => {
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

export const useWasteRates = () => {
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
    if (selectedFacilities.status === "idle") {
      dispatch(fetchFacilitiesIfEmpty());
    }
  }, [selectedFacilities.status, dispatch]);

  useEffect(() => {
    if (selectedPartnerFacilities.status === "idle") {
      dispatch(fetchPartnerFacilitiesIfEmpty());
    }
  }, [selectedPartnerFacilities.status, dispatch]);

  useEffect(() => {
    if (selectedPartners.status === "idle") {
      dispatch(fetchPartnersIfEmpty());
    }
  }, [selectedPartners.status, dispatch]);

  useEffect(() => {
    if (selectedDateRange.status === "idle") {
      dispatch(fetchDatesIfEmpty());
    }
  }, [selectedDateRange.status, dispatch]);

  useEffect(() => {
    if (selectedWasteTypes.status === "idle") {
      dispatch(fetchWasteTypesIfEmpty());
    }
  }, [selectedWasteTypes.status, dispatch]);

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
    if (selectedValuesInitialized) {
      const filteredData = data.filter((item) => {
        return (
          selectedFacilities.selectedFacilities.some(
            (facility) => facility.id === item.facilityid,
          ) &&
          selectedPartnerFacilities.selectedPartnerFacilities.some(
            (facility) => facility.id === item.partnerfacilityid,
          ) &&
          selectedPartners.selectedPartners.some(
            (partner) => partner.id === item.partnercompanyid,
          ) &&
          selectedDateRange.selected.start <= item.timerange &&
          selectedDateRange.selected.end >= item.timerange &&
          selectedWasteTypes.selectedWasteTypes.some(
            (wasteType) => wasteType.id === item.wastetype,
          )
        );
      });
      setFilteredData(filteredData);
    }
  }, [
    selectedValuesInitialized,
    selectedFacilities.selectedFacilities,
    selectedPartnerFacilities.selectedPartnerFacilities,
    selectedPartners.selectedPartners,
    selectedDateRange.selected,
    selectedWasteTypes.selectedWasteTypes,
  ]);

  return { data: filteredData, error, loading };
};
