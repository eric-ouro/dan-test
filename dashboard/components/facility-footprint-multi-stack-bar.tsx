"use client";

import { useEnrichedWasteRateSummariesWithRatios } from "@/lib/hooks/use-enriched-waste-rate-summaries";
import { EnrichedWasteRateSummaryWithRatios, SortConfig, SortDirection } from "@/lib/types";
import { useState, useMemo } from "react";
import { CaretUp, CaretDown } from "phosphor-react";
import { useAppSelector } from "@/lib/hooks/store-hooks";
import { RootState } from "@/lib/store/configuration";

import MultiStackBar from "@components/display/multi-stack-bar";

type SortKey = 
| "percentage"
| "accounted" 
| "recycleRate" 
| "recyclingLossRate" 
| "processingLossRate"
| "quantity"
| "label";

const FacilityFootprintMultiStackBar = () => {
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummariesWithRatios({
    filters: ["partner", "facility", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "facility",
      aggregate: false,
    },
  });

  const [facilitySortConfig, setFacilitySortConfig] = useState<SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>>({
    key: "accounted",
    direction: "descending",
  });

  const showVariant = useAppSelector((state: RootState) => state.accountedToggle.showVariant);

  if (summariesLoading) return <div>Loading...</div>;
  if (summariesError) return <div>Error: {summariesError}</div>;

  const totalAccountedForAllSummaries = summaries.reduce(
    (acc, curr) => acc + curr.accounted,
    0
  );

  const facilitySummaries = summaries.reduce<
    Record<string, { summaries: EnrichedWasteRateSummaryWithRatios[]; accountedPercentage: number; quantityPercentage: number }>
  >((acc, curr) => {
    acc[curr.group] ??= { summaries: [], accountedPercentage: 0, quantityPercentage: 0 };
    acc[curr.group].summaries.push(curr);
    return acc;
  }, {});

  Object.keys(facilitySummaries).forEach((group) => {
    const groupTotalAccounted = facilitySummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.accounted,
      0
    );
    facilitySummaries[group].accountedPercentage = (groupTotalAccounted / totalAccountedForAllSummaries) * 100;

    const groupTotalQuantity = facilitySummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    facilitySummaries[group].quantityPercentage = (groupTotalQuantity / totalAccountedForAllSummaries ) * 100;
  });
  

  const accountedPercentageLargest = Math.max(
    ...Object.values(facilitySummaries).map(item => item.accountedPercentage)
  );

  const quantityPercentageLargest = Math.max(
    ...Object.values(facilitySummaries).map(item => item.quantityPercentage)
  );

  const sortedFacilitySummaries = useMemo(() => {
    return Object.values(facilitySummaries).sort((a, b) => {
      if (facilitySortConfig.key === "label") {
        return facilitySortConfig.direction === "ascending"
          ? a.summaries[0].label.name.localeCompare(b.summaries[0].label.name)
          : b.summaries[0].label.name.localeCompare(a.summaries[0].label.name);
      }

      const aValue = a.summaries.reduce((acc, curr) => {
        const value = curr[facilitySortConfig.key];
        return acc + (typeof value === 'number' ? value : 0);
      }, 0);

      const bValue = b.summaries.reduce((acc, curr) => {
        const value = curr[facilitySortConfig.key];
        return acc + (typeof value === 'number' ? value : 0);
      }, 0);

      if (aValue < bValue) {
        return facilitySortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return facilitySortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [facilitySummaries, facilitySortConfig]);

  const requestFacilitySort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (facilitySortConfig.key === key) {
      direction = facilitySortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    setFacilitySortConfig({ key, direction });
  };

  const getHeaderClass = (key: SortKey) => {
    return facilitySortConfig.key === key ? "text-foreground" : "text-foreground/50";
  };

  const getHeaderIcon = (key: SortKey) => {
    if (facilitySortConfig.key === key) {
      return facilitySortConfig.direction === "ascending" ? <CaretUp size={10} /> : <CaretDown size={10} />;
    }
    return null;
  };
    
  if (showVariant) {
    return (
      <>
      <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_minmax(80px,auto)_1fr] gap-2 text-xs text-left uppercase py-2 border-b border-foreground/20">
        <div onClick={() => requestFacilitySort("label")} className={`cursor-pointer flex items-center ${getHeaderClass("label")}`}>
          <span>Facility</span> <span className="ml-1">{getHeaderIcon("label")}</span>
        </div>
        <div onClick={() => requestFacilitySort("accounted")} className={`cursor-pointer flex items-center  ${getHeaderClass("accounted")}`}>
          <span>Accounted</span> <span className="ml-1">{getHeaderIcon("accounted")}</span>
        </div>
        <div onClick={() => requestFacilitySort("quantity")} className={`cursor-pointer flex items-center ${getHeaderClass("quantity")}`}>
          <span>Quantity</span> <span className="ml-1">{getHeaderIcon("quantity")}</span>
        </div>
        <div onClick={() => requestFacilitySort("percentage")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("percentage")}`}>
        <span className="mr-1">{getHeaderIcon("percentage")}</span> <span>Accounted %</span> 
        </div>
      </div>

      {sortedFacilitySummaries.map((item) => (
        <MultiStackBar
          name={item.summaries[0].groupName}
          accountedPercentage={item.accountedPercentage}
          quantityPercentage={item.quantityPercentage}
          summaries={item.summaries}
          accountedPercentageLargest={accountedPercentageLargest}
          quantityPercentageLargest={quantityPercentageLargest}
          showTableHeader={true}
          defaultTableDataVisible={Object.values(facilitySummaries).length === 1}
        />
      ))}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)] gap-2 text-xs text-left uppercase py-2 border-b border-foreground/20">
        <div onClick={() => requestFacilitySort("label")} className={`cursor-pointer flex items-center ${getHeaderClass("label")}`}>
          <span>Facility</span> <span className="ml-1">{getHeaderIcon("label")}</span>
        </div>
        <div onClick={() => requestFacilitySort("accounted")} className={`cursor-pointer flex items-center ${getHeaderClass("accounted")}`}>
          <span>Waste</span> <span className="ml-1">{getHeaderIcon("accounted")}</span>
        </div>
        <div onClick={() => requestFacilitySort("recycleRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("recycleRate")}`}>
        <span className="mr-1">{getHeaderIcon("recycleRate")}</span> <span>Recycled</span> 
        </div>
        <div onClick={() => requestFacilitySort("recyclingLossRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("recyclingLossRate")}`}>
          <span className="mr-1">{getHeaderIcon("recyclingLossRate")}</span> <span>R&nbsp;Loss</span> 
        </div>
        <div onClick={() => requestFacilitySort("processingLossRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("processingLossRate")}`}>
          <span className="mr-1">{getHeaderIcon("processingLossRate")}</span> <span>P&nbsp;Loss</span> 
        </div>
      </div>

      {sortedFacilitySummaries.map((item) => (
        <MultiStackBar
          name={item.summaries[0].groupName}
          accountedPercentage={item.accountedPercentage}
          quantityPercentage={item.quantityPercentage}
          summaries={item.summaries}
          accountedPercentageLargest={accountedPercentageLargest}
          quantityPercentageLargest={quantityPercentageLargest}
          showTableHeader={true}
          defaultTableDataVisible={Object.values(facilitySummaries).length === 1}
        />
      ))}
    </>
  );
};

export default FacilityFootprintMultiStackBar;
