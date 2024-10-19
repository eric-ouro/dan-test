"use client";

import { createClient } from "@utils/supabase/client";
import { useEffect, useState } from "react";
import { useSelectorFilters } from "@hooks/use-selector-filters";
import { AsyncHookState, EnabledFilters, WasteRate } from "@/lib/types";

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

export const useWasteRates = ({
  filters = [],
}: EnabledFilters): AsyncHookState<WasteRate> => {
  const { data, error, loading } = useWasteRateData();
  const [filteredData, setFilteredData] = useState<WasteRate[]>([]);

  const filterFn = useSelectorFilters<WasteRate>({
    filterSpec: {
      lenses: {
        facility: filters.includes("facility")
          ? (item) => item.facilityid
          : undefined,
        partnerFacility: filters.includes("partnerFacility")
          ? (item) => item.partnerfacilityid
          : undefined,
        partner: filters.includes("partner")
          ? (item) => item.partnercompanyid
          : undefined,
        date: filters.includes("date") ? (item) => item.timerange : undefined,
        wasteType: filters.includes("wasteType")
          ? (item) => item.wastetype
          : undefined,
      },
    },
  });

  useEffect(() => {
    const filtered = data.filter(filterFn);
    setFilteredData(filtered);
  }, [data, filterFn]);

  return { data: filteredData, error, loading };
};
