"use client";

import { createClient } from "@utils/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/store-hooks";
import { fetchDatesIfEmpty } from "@store/slices/selected-date-slice";
import { fetchFacilitiesIfEmpty } from "@store/slices/selected-facilities-slice";
import { fetchPartnersIfEmpty } from "@store/slices/selected-partners-slice";
import { fetchPartnerFacilitiesIfEmpty } from "@store/slices/selected-partner-facilities-slice";
import { fetchWasteTypesIfEmpty } from "@store/slices/selected-waste-types-slice";
import { AsyncHookState, EnrichedWasteRate } from "@/lib/types";

const useEnrichedWasteRateData = (): AsyncHookState<EnrichedWasteRate> => {
  const [data, setData] = useState<EnrichedWasteRate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const query = supabase.from("wasterates_monthly_facilitypartner").select(
        `
          company:companies!wasterates_monthly_facilitypartner_companyid_fkey (
            id,
            name
          ),
          partnercompany:companies!wasterates_monthly_facilitypartner_partnercompanyid_fkey (
            id,
            name
          ),
          facility:facilities!wasterates_monthly_facilitypartner_facilityid_fkey (
            id,
            name
          ),
          partnerfacility:facilities!wasterates_monthly_facilitypartner_partnerfacilityid_fkey (
            id,
            name
          ),
          wastetype:wastetypes (
            id,
            name
          ),
          parentwastetype,
          processed,
          recycled,
          timerange
          `,
      );

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        // filter out null values
        const filteredData = data.filter(
          (value): value is EnrichedWasteRate => {
            return (
              value.company !== null &&
              value.partnercompany !== null &&
              value.facility !== null &&
              value.partnerfacility !== null &&
              value.wastetype !== null
            );
          },
        );

        setData(filteredData);
      }
      if (loading) {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return { data, error, loading };
};

export const useEnrichedWasteRates = (): AsyncHookState<EnrichedWasteRate> => {
  const dispatch = useAppDispatch();
  const { data, error, loading } = useEnrichedWasteRateData();
  const [filteredData, setFilteredData] = useState<EnrichedWasteRate[]>([]);

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
            (facility) => facility.id === item.facility.id,
          ) &&
          selectedPartnerFacilities.selected.some(
            (facility) => facility.id === item.partnerfacility.id,
          ) &&
          selectedPartners.selected.some(
            (partner) => partner.id === item.partnercompany.id,
          ) &&
          selectedDateRange.selected.start <= item.timerange &&
          selectedDateRange.selected.end >= item.timerange &&
          selectedWasteTypes.selected.some(
            (wasteType) => wasteType.id === item.wastetype.id,
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
