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

const PartnerFootprintMultiStackBar = () => {
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummariesWithRatios({
    filters: ["partner", "facility", "partnerFacility", "wasteType", "date"],
    groupConfig: {
      group: "partner",
      aggregate: false,
    },
  });

  const showVariant = useAppSelector((state: RootState) => state.accountedToggle.showVariant);

  const [partnerSortConfig, setPartnerSortConfig] = useState<SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>>({
    key: showVariant ? "quantity" : "accounted",
    direction: "descending",
  });

  if (summariesLoading) return <div>Loading...</div>;
  if (summariesError) return <div>Error: {summariesError}</div>;

  const totalAccountedForAllSummaries = summaries.reduce(
    (acc, curr) => acc + curr.accounted,
    0
  );

  const partnerSummaries = summaries.reduce<
    Record<string, { summaries: EnrichedWasteRateSummaryWithRatios[]; accountedPercentage: number; quantityPercentage: number }>
  >((acc, curr) => {
    acc[curr.group] ??= { summaries: [], accountedPercentage: 0, quantityPercentage: 0 };
    acc[curr.group].summaries.push(curr);
    return acc;
  }, {});

  Object.keys(partnerSummaries).forEach((group) => {
    const groupTotalAccounted = partnerSummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.accounted,
      0
    );
    partnerSummaries[group].accountedPercentage = (groupTotalAccounted / totalAccountedForAllSummaries) * 100;

    const groupTotalQuantity = partnerSummaries[group].summaries.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    partnerSummaries[group].quantityPercentage = (groupTotalQuantity / totalAccountedForAllSummaries ) * 100;
  });
  

  const accountedPercentageLargest = Math.max(
    ...Object.values(partnerSummaries).map(item => item.accountedPercentage)
  );

  const quantityPercentageLargest = Math.max(
    ...Object.values(partnerSummaries).map(item => item.quantityPercentage)
  );

  const sortedPartnerSummaries = useMemo(() => {
    return Object.values(partnerSummaries).sort((a, b) => {
      if (partnerSortConfig.key === "label") {
        return partnerSortConfig.direction === "ascending"
          ? a.summaries[0].label.name.localeCompare(b.summaries[0].label.name)
          : b.summaries[0].label.name.localeCompare(a.summaries[0].label.name);
      }

      const aValue = a.summaries.reduce((acc, curr) => {
        const value = curr[partnerSortConfig.key];
        return acc + (typeof value === 'number' ? value : 0);
      }, 0);

      const bValue = b.summaries.reduce((acc, curr) => {
        const value = curr[partnerSortConfig.key];
        return acc + (typeof value === 'number' ? value : 0);
      }, 0);

      if (aValue < bValue) {
        return partnerSortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return partnerSortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [partnerSummaries, partnerSortConfig]);

  const requestPartnerSort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (partnerSortConfig.key === key) {
      direction = partnerSortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    setPartnerSortConfig({ key, direction });
  };

  const getHeaderClass = (key: SortKey) => {
    return partnerSortConfig.key === key ? "text-foreground" : "text-foreground/50";
  };

  const getHeaderIcon = (key: SortKey) => {
    if (partnerSortConfig.key === key) {
      return partnerSortConfig.direction === "ascending" ? <CaretUp size={10} /> : <CaretDown size={10} />;
    }
    return null;
  };
    
  if (showVariant) {
    return (
      <>
      <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_minmax(80px,auto)_1fr] gap-2 text-xs text-left uppercase py-2 border-b border-foreground/20">
        <div onClick={() => requestPartnerSort("label")} className={`cursor-pointer flex items-center ${getHeaderClass("label")}`}>
          <span>Partner</span> <span className="ml-1">{getHeaderIcon("label")}</span>
        </div>
        <div onClick={() => requestPartnerSort("accounted")} className={`cursor-pointer flex items-center  ${getHeaderClass("accounted")}`}>
          <span>Accounted</span> <span className="ml-1">{getHeaderIcon("accounted")}</span>
        </div>
        <div onClick={() => requestPartnerSort("quantity")} className={`cursor-pointer flex items-center ${getHeaderClass("quantity")}`}>
          <span>Quantity</span> <span className="ml-1">{getHeaderIcon("quantity")}</span>
        </div>
        <div onClick={() => requestPartnerSort("percentage")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("percentage")}`}>
        <span className="mr-1">{getHeaderIcon("percentage")}</span> <span>Accounted %</span> 
        </div>
      </div>

      {sortedPartnerSummaries.map((item) => (
        <MultiStackBar
          name={item.summaries[0].groupName}
          accountedPercentage={item.accountedPercentage}
          quantityPercentage={item.quantityPercentage}
          summaries={item.summaries}
          accountedPercentageLargest={accountedPercentageLargest}
          quantityPercentageLargest={quantityPercentageLargest}
          showTableHeader={true}
          defaultTableDataVisible={Object.values(partnerSummaries).length === 1}
        />
      ))}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)] gap-2 text-xs text-left uppercase py-2 border-b border-foreground/20">
        <div onClick={() => requestPartnerSort("label")} className={`cursor-pointer flex items-center ${getHeaderClass("label")}`}>
          <span>Partner</span> <span className="ml-1">{getHeaderIcon("label")}</span>
        </div>
        <div onClick={() => requestPartnerSort("accounted")} className={`cursor-pointer flex items-center ${getHeaderClass("accounted")}`}>
          <span>Waste</span> <span className="ml-1">{getHeaderIcon("accounted")}</span>
        </div>
        <div onClick={() => requestPartnerSort("recycleRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("recycleRate")}`}>
        <span className="mr-1">{getHeaderIcon("recycleRate")}</span> <span>Recycled</span> 
        </div>
        <div onClick={() => requestPartnerSort("recyclingLossRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("recyclingLossRate")}`}>
          <span className="mr-1">{getHeaderIcon("recyclingLossRate")}</span> <span>R&nbsp;Loss</span> 
        </div>
        <div onClick={() => requestPartnerSort("processingLossRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("processingLossRate")}`}>
          <span className="mr-1">{getHeaderIcon("processingLossRate")}</span> <span>P&nbsp;Loss</span> 
        </div>
      </div>

      {sortedPartnerSummaries.map((item) => (
        <MultiStackBar
          name={item.summaries[0].groupName}
          accountedPercentage={item.accountedPercentage}
          quantityPercentage={item.quantityPercentage}
          summaries={item.summaries}
          accountedPercentageLargest={accountedPercentageLargest}
          quantityPercentageLargest={quantityPercentageLargest}
          showTableHeader={true}
          defaultTableDataVisible={Object.values(partnerSummaries).length === 1}
        />
      ))}
    </>
  );
};

export default PartnerFootprintMultiStackBar;
