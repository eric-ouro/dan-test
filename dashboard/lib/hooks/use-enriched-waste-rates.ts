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

export const useEnrichedWasteRates = (): AsyncHookState<EnrichedWasteRate> => {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  const [data, setData] = useState<EnrichedWasteRate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    const fetchData = async () => {
      const query = supabase
        .from("wasterates_monthly_facilitypartner")
        .select(
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
        )
        .in(
          "facilityid",
          selectedFacilities.selected.map((facility) => facility.id),
        )
        .in(
          "partnerfacilityid",
          selectedPartnerFacilities.selected.map((facility) => facility.id),
        )
        .in(
          "partnercompanyid",
          selectedPartners.selected.map((partner) => partner.id),
        )
        .in(
          "wastetype",
          selectedWasteTypes.selected.map((wasteType) => wasteType.id),
        )
        .gte("timerange", selectedDateRange.selected.start)
        .lte("timerange", selectedDateRange.selected.end);

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        // @ts-expect-error Supabase types are not correct (it expects arrays for each of the foreign key fields)
        setData(data);
      }
      if (loading) {
        setLoading(false);
      }
    };

    if (selectedValuesInitialized) {
      void fetchData();
    }
  }, [
    selectedValuesInitialized,
    selectedFacilities.selected,
    selectedPartnerFacilities.selected,
    selectedPartners.selected,
    selectedDateRange.selected,
    selectedWasteTypes.selected,
  ]);

  return { data, error, loading };
};
