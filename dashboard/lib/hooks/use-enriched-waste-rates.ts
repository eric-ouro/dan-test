"use client";

import { createClient } from "@utils/supabase/client";
import { useEffect, useState } from "react";
import { useSelectorFilters } from "@hooks/use-selector-filters";

import { AsyncHookState, EnrichedWasteRate, EnabledFilters } from "@/lib/types";

export const useEnrichedWasteRateData =
  (): AsyncHookState<EnrichedWasteRate> => {
    const [data, setData] = useState<EnrichedWasteRate[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const supabase = createClient();

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

export const useEnrichedWasteRates = ({
  filters = [],
}: EnabledFilters): AsyncHookState<EnrichedWasteRate> => {
  const { data, error, loading } = useEnrichedWasteRateData();
  const [filteredData, setFilteredData] = useState<EnrichedWasteRate[]>([]);

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

  return { data: filteredData, error, loading };
};
