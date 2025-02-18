"use client";

import { useMemo } from "react";
import DashboardDisplayHeader from "@components/dashboard-display-header";
import { DbObject, EnrichedWasteRateSummary } from "@/lib/types";
import { useAppSelector } from "@/lib/hooks/store-hooks";
import { RootState } from "@/lib/store/configuration";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface WasteRateSummaryProps<T extends DbObject> {
  name: string | null;
  summaries: EnrichedWasteRateSummary[];
  filteredSummaries: EnrichedWasteRateSummary[];
  onSelectItem: (item: T) => void;
  colorForItem: (item: T) => string;
}

const WasteRateSummaryPie = <T extends DbObject>({
  name,
  summaries,
  filteredSummaries,
  onSelectItem,
  colorForItem,
}: WasteRateSummaryProps<T>) => {
  const showVariant = useAppSelector((state: RootState) => state.accountedToggle.showVariant);

  const totalQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [summaries]);

  const totalAccountedQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.accounted, 0);
  }, [summaries]);

  const totalFilteredQuantity = useMemo(() => {
    return filteredSummaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredSummaries]);

  const totalFilteredAccountedQuantity = useMemo(() => {
    return filteredSummaries.reduce((acc, curr) => acc + curr.accounted, 0);
  }, [filteredSummaries]);

  const clickableSummaries = useMemo(() => {
    return summaries.filter((item) => item.quantity > 0);
  }, [summaries]);
  
  const data = {
    labels: filteredSummaries.map(item => item.label.name),
    datasets: [
      {
        data: filteredSummaries.map(item => 
          showVariant ? item.quantity : item.accounted
        ),
        backgroundColor: filteredSummaries.map(item => colorForItem(item.label as T)),
        hoverOffset: 7,
        offset: 5,
      },
    ],
  };

  return (
    <div className="dashcomponent">
      <div className="flex-grow max-h-[254px]">
          <Pie data={data} 
          options={{
            plugins: {
              legend: {
                display: false,
                // position: 'bottom',
                // align: 'start',
                
              },
            },
            elements: {
              arc: {
                borderWidth: 0,
                borderColor: 'white',
              },
            },
          }}
          />
      </div>
    </div>
  );
};

export default WasteRateSummaryPie;
