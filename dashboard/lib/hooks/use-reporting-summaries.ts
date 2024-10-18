"use client";

import { createClient } from "@utils/supabase/client";
import { useEffect, useState } from "react";
import { setValidInterval } from "@store/slices/selected-date-slice";
import { useAppDispatch } from "@hooks/store-hooks";

interface ReportingSummary {
  facilityid: number;
  companyid: number;
  partnerfacilityid: number;
  partnercompanyid: number;
  month: number;
  year: number;
  petrecycled: number | null;
  petprocessed: number | null;
  hdperecycled: number | null;
  hdpeprocessed: number | null;
  pvcrecycled: number | null;
  pvcprocessed: number | null;
  ldperecycled: number | null;
  ldpeprocessed: number | null;
  pprecycled: number | null;
  ppprocessed: number | null;
  psrecycled: number | null;
  psprocessed: number | null;
  mixedplasticrecycled: number | null;
  mixedplasticprocessed: number | null;
  mixedplasticquantity: number | null;
}

export function useReportingSummaries() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<ReportingSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("mixedplasticrates_monthly_facilitypartner")
        .select();
      if (error) {
        setError(error.message);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    void fetchData();
  }, []);

  // calculate date range on data change
  useEffect(() => {
    // if data is empty return
    if (data.length === 0) return;

    const dates = data.map((summary) => {
      return new Date(summary.year, summary.month - 1).toISOString();
    });
    const start = dates.reduce((min, current) => {
      return current < min ? current : min;
    }, dates[0]);
    const end = dates.reduce((max, current) => {
      return current > max ? current : max;
    }, dates[0]);
    dispatch(setValidInterval({ start, end }));
  }, [data]);

  return { data, error, loading };
}
