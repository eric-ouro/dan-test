"use client"; 

import { useMemo, useState } from "react"; 
import {
  EnrichedWasteRateSummaryWithRatios,
  SortConfig,
  SortDirection,
} from "@/lib/types";
import { useAppSelector } from '@/lib/hooks/store-hooks';
import { CaretUp, CaretDown } from "phosphor-react";

type SortKey =
  | "percentage"
  | "accounted"
  | "recycleRate"
  | "recyclingLossRate"
  | "processingLossRate"
  | "quantity"
  | "label"; 

interface MultiStackBarProps {
  summaries: EnrichedWasteRateSummaryWithRatios[];
  name?: string;
  accountedPercentage?: number;
  quantityPercentage?: number;
  accountedPercentageLargest?: number;
  quantityPercentageLargest?: number;
  showTableHeader?: boolean;
  defaultTableDataVisible?: boolean;
} // Defining the props interface for the MultiStackBar component.

const MultiStackBar = ({
  name,
  summaries,
  accountedPercentage,
  quantityPercentage,
  accountedPercentageLargest,
  quantityPercentageLargest,
  showTableHeader = true,
  defaultTableDataVisible = false,
}: MultiStackBarProps) => {
  const showVariant = useAppSelector((state) => state.accountedToggle.showVariant);

  // Defining the MultiStackBar component.
  const [sortConfig, setSortConfig] = useState<
    SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>
  >({
    key: "accounted",
    direction: "descending",
  }); // Initializing state for sorting configuration with default values.

  const [isTableDataVisible, setIsTableDataVisible] = useState(defaultTableDataVisible);

  const toggleTableDataVisibility = () => {
    setIsTableDataVisible(!isTableDataVisible);
  };

  const sortedSummaries = useMemo(
    () =>
      [...summaries].sort((a, b) => {
        if (sortConfig.key === "label") {
          return sortConfig.direction === "ascending"
            ? a.label.name.localeCompare(b.label.name)
            : b.label.name.localeCompare(a.label.name);
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }),
    [summaries, sortConfig],
  ); // Memoizing the sorted summaries to optimize performance.


  const requestSort = (key: SortKey) => {
    // Function to handle sorting requests.
    let direction: SortDirection = "descending";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "descending" ? "ascending" : "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalAccounted = useMemo(() => {
    // Calculating the total quantity of all summaries.b
    return summaries.reduce((acc, curr) => acc + curr.accounted, 0);
  }, [summaries]);

  const largestFootprintPercentage = useMemo(
    () =>
      Math.max(
        ...summaries.map((item) => (item.accounted / totalAccounted) * 100),
      ),
    [summaries, totalAccounted],
  ); // Calculating the largest footprint percentage for normalization.

  const normalizedWidthGroup = ((accountedPercentage ?? 0) / (accountedPercentageLargest ?? 1)) * 100;

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? "text-foreground" : "text-foreground/50";
  };

  const getHeaderIcon = (key: SortKey) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? <CaretUp size={10} /> : <CaretDown size={10} />;
    }
    return null;
  };

  const renderComponent = () => {
    if (showVariant) {
      return (
        <MultiStackBarVariant
          name={name}
          summaries={summaries}
          quantityPercentage={quantityPercentage}
          quantityPercentageLargest={quantityPercentageLargest} 
          defaultTableDataVisible={defaultTableDataVisible}
          showTableHeader={showTableHeader}
        />
      );
    } else {
      return (
        <div className={`dashcomponent ${isTableDataVisible ? '' : ''} hover:bg-foreground/5`}>
          {/* Main container for the component */}
          <div className="flex flex-col overflow-hidden h-full border-b border-foreground/20 ">
            {showTableHeader && (
              <div 
                className={`grid grid-cols-[minmax(200px,200px)_minmax(80px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)_minmax(80px,auto)]
                  gap-2 align-middle py-3s cursor-pointer min-h-[56px] items-center ${!isTableDataVisible ? '' : 'border-b border-foreground/20'}`}
                onClick={toggleTableDataVisibility}
              >
                <div>{name && <div className="uppercase text-sm pr-2">{name}</div>}</div>
                <div className="text-foreground/50">
                  {totalAccounted.toFixed(1)}kg
                </div>
                <div className="text-foreground/50">
                  {/* % of accounted for all groups */}
                  {accountedPercentage !== undefined ? accountedPercentage.toFixed(1) : "undefined"}%
                </div>
                <div className="w-full flex">
                  {/* Total averages recycling bar */}
                  <div className="h-[1em] text-left overflow-hidden flex items-center" style={{ width: `${normalizedWidthGroup}%` }}>
                    <div className="h-full flex items-center justify-start bg-foreground" style={{ width: `${(summaries.reduce((acc, curr) => acc + (curr.recycleRate * curr.accounted), 0) / summaries.reduce((acc, curr) => acc + curr.accounted, 0)).toFixed(1)}%`}}></div>
                    <div className="h-full flex items-center justify-start bg-neutral-400" style={{ width: `${(summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + (curr.recyclingLossRate * curr.accounted), 0) / summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + curr.accounted, 0)).toFixed(1)}%` }}></div>
                    <div className="h-full flex items-center justify-start bg-neutral-500" style={{ width: `${(summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + (curr.processingLossRate * curr.accounted), 0) / summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + curr.accounted, 0)).toFixed(1)}%` }}></div>
                  </div>
                </div>
                <div className="text-foreground/50 text-right">
                  {(summaries.reduce((acc, curr) => acc + (curr.recycleRate * curr.accounted), 0) / summaries.reduce((acc, curr) => acc + curr.accounted, 0)).toFixed(1)}%
                </div>
                <div className="text-foreground/50 text-right">
                  {(summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + (curr.recyclingLossRate * curr.accounted), 0) / summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + curr.accounted, 0)).toFixed(1)}%
                </div>
                <div className="text-foreground/50 text-right">
                  {(summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + (curr.processingLossRate * curr.accounted), 0) / summaries.filter(item => item.accounted > 0).reduce((acc, curr) => acc + curr.accounted, 0)).toFixed(1)}%
                </div>
              </div>
            )}
            {/* Conditionally render table data with transition */}
            <div
              className={`overflow-x-auto transition-max-height duration-300 ease-in-out  ${isTableDataVisible ? 'max-h-screen' : 'max-h-0'}`}
              style={{ overflow: 'hidden' }}
            >
              {isTableDataVisible && (
                <div>
                  <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)] gap-2 text-xs text-left uppercase my-2">
                    <div className="text-foreground/50">
                      <span>Material</span> <span className="ml-1">{getHeaderIcon("label")}</span>
                    </div>
                    <div onClick={() => requestSort("accounted")} className={`cursor-pointer flex items-center ${getHeaderClass("accounted")}`}>
                      <span>Waste</span> <span className="ml-1">{getHeaderIcon("accounted")}</span>
                    </div>
                    <div onClick={() => requestSort("recycleRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("recycleRate")}`}>
                      <span className="mr-1">{getHeaderIcon("recycleRate")}</span> <span>Recycled</span>
                    </div>
                    <div onClick={() => requestSort("recyclingLossRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("recyclingLossRate")}`}>
                      <span className="mr-1">{getHeaderIcon("recyclingLossRate")}</span> <span>R&nbsp;Loss</span>
                    </div>
                    <div onClick={() => requestSort("processingLossRate")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("processingLossRate")}`}>
                      <span className="mr-1">{getHeaderIcon("processingLossRate")}</span> <span>P&nbsp;Loss</span>
                    </div>
                  </div>
                  <div>
                    {sortedSummaries
                      .filter(item => item.accounted > 0)
                      .map((item, index) => {
                        const footprintPercentage = totalAccounted > 0 ? (item.accounted / totalAccounted) * 100 : 0;
                        const normalizedWidth = (footprintPercentage / largestFootprintPercentage) * 100;
                        const displayLabel = item.label.name === "MixedPlastic" ? "Mixed" : item.label.name;
                        const displayColor = item.label.display_color || 'defaultColor';

                        return (
                          <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)_minmax(80px,auto)] gap-2 align-middle py-3 border-t border-foreground/20" key={index}>
                            <div className="text-foreground flex-none">
                              <span className="flex items-center">
                                <span className="inline-block w-[1em] h-[1em] flex-shrink-0 rounded-full mr-2" style={{ background: `#${displayColor}` }}></span>
                                {displayLabel}
                              </span>
                            </div>
                            <div className={`text-left ${getHeaderClass("accounted")} flex-none`}>{item.accounted.toFixed(1).padStart(4, "0")}kg</div>
                            <div className={`text-left ${getHeaderClass("accounted")} flex-none`}>{footprintPercentage.toFixed(1)}%</div>
                            <div className="w-full flex items-center">
                              {/* Recycling bar */}
                              <div className="h-[1em] text-left overflow-hidden flex items-center" style={{ width: `${Math.max(normalizedWidth, 10)}%` }}>
                                <div className={`h-full flex items-center justify-start`} style={{ width: `${Math.max(item.recycleRate, 10)}%`, background: `#${displayColor}` }}></div>
                                <div className={`h-full flex items-center justify-start bg-neutral-400`} style={{ width: `${Math.max(item.recyclingLossRate, 10)}%` }}></div>
                                <div className={`h-full flex items-center justify-start bg-neutral-500`} style={{ width: `${Math.max(item.processingLossRate, 10)}%` }}></div>
                              </div>
                            </div>
                            <div className={`text-right ${getHeaderClass("recycleRate")} flex-none`}>{item.recycleRate.toFixed(1)}%</div>
                            <div className={`text-right ${getHeaderClass("recyclingLossRate")} flex-none`}>{item.recyclingLossRate.toFixed(1)}%</div>
                            <div className={`text-right ${getHeaderClass("processingLossRate")} flex-none`}>{item.processingLossRate.toFixed(1)}%</div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return <div>{renderComponent()}</div>;
};

// Define a new component variant
const MultiStackBarVariant = ({ name, summaries, quantityPercentage, quantityPercentageLargest, defaultTableDataVisible, showTableHeader }: MultiStackBarProps) => {
  const [sortConfig, setSortConfig] = useState<
    SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>
  >({
    key: "quantity",
    direction: "descending",
  });

  const sortedSummaries = useMemo(
    () =>
      [...summaries].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }),
    [summaries, sortConfig],
  );


  const totalQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [summaries]);

  const totalAccounted = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.accounted, 0);
  }, [summaries]);

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? "text-foreground" : "text-foreground/50";
  };

  const getHeaderIcon = (key: SortKey) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? <CaretUp size={10} /> : <CaretDown size={10} />;
    }
    return null;
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const [isTableDataVisible, setIsTableDataVisible] = useState(defaultTableDataVisible);

  const toggleTableDataVisibility = () => {
    setIsTableDataVisible(!isTableDataVisible);
  };
  
  const normalizedWidthGroup = ((quantityPercentage ?? 0) / (quantityPercentageLargest ?? 1)) * 100;
  

  return (
    <div className={`dashcomponent ${isTableDataVisible ? '' : ''} hover:bg-foreground/5`}>
      <div className="flex flex-col overflow-hidden h-full border-b border-foreground/20 ">
        {showTableHeader && (
        <div className={`grid grid-cols-[minmax(200px,200px)_minmax(80px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)]
            gap-2 align-middle py-3s cursor-pointer min-h-[56px] items-center ${!isTableDataVisible ? '' : 'border-b border-foreground/20'}`}
          onClick={toggleTableDataVisibility}
        >
              <div>{name && <div className="uppercase text-sm pr-2">{name}</div>}</div>
              <div className="text-foreground/50">
                {totalAccounted.toFixed(1)}kg
              </div>
              <div className="text-foreground/50">
                {totalQuantity.toFixed(1)}kg
              </div>
              <div className="w-full flex">
                {/* Total averages recycling bar */}
                <div className="h-[1em] text-left overflow-hidden flex items-center bg-foreground/50" style={{ width: `${normalizedWidthGroup}%` }}>
                    <div className={`h-full flex items-center justify-start bg-foreground`} style={{ width: `${(totalAccounted / totalQuantity) * 100}%` }}></div>
                </div>
              </div>
              <div className="text-foreground/50 text-right">
                {((totalAccounted / totalQuantity) * 100).toFixed(1)}%
              </div>
        </div>
        )}
         <div
              className={`overflow-x-auto transition-max-height duration-300 ease-in-out  ${isTableDataVisible ? 'max-h-screen' : 'max-h-0'}`}
              style={{ overflow: 'hidden' }}
            >
              
          {isTableDataVisible && (
            <>
              <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_minmax(80px,auto)_1fr] gap-2 text-xs text-left uppercase py-2 ">
                <div className="text-foreground/50">
                  <span>Material</span> <span className="ml-1">{getHeaderIcon("label")}</span>
                </div>
                <div onClick={() => requestSort("accounted")} className={`cursor-pointer flex items-center  ${getHeaderClass("accounted")}`}>
                  <span>Accounted</span> <span className="ml-1">{getHeaderIcon("accounted")}</span>
                </div>
                <div onClick={() => requestSort("quantity")} className={`cursor-pointer flex items-center ${getHeaderClass("quantity")}`}>
                  <span>Quantity</span> <span className="ml-1">{getHeaderIcon("quantity")}</span>
                </div>
                <div onClick={() => requestSort("percentage")} className={`cursor-pointer flex items-center justify-end ${getHeaderClass("percentage")}`}>
                  <span className="mr-1">{getHeaderIcon("percentage")}</span> <span>Accounted %</span> 
                </div>
              </div>
              <div>
                {sortedSummaries.map((item, index) => {
                  const accountedPercentage = totalQuantity > 0 ? (item.accounted / totalQuantity) * 100 : 0;
                  const displayColor = item.label.display_color || 'defaultColor';

                  return (
                    <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)] gap-2 align-middle py-3 border-t border-foreground/20" key={index}>
                      <div className="text-foreground">
                        <span className="flex items-center ">
                          <span className={`inline-block w-[1em] h-[1em] flex-shrink-0 rounded-full mr-2`} style={{ background: `#${displayColor}` }}></span>
                          {item.label.name}
                        </span>
                      </div>
                      <div className={`text-left ${getHeaderClass("accounted")}`}>
                        {item.accounted.toFixed(1).padStart(4, "0")}kg
                      </div>
                      <div className={`text-left ${getHeaderClass("quantity")}`}>
                        {item.quantity.toFixed(1).padStart(4, "0")}kg
                      </div>
                      <div className="w-full flex items-center">
                        <div className="h-[1em] text-left overflow-hidden flex bg-foreground/50" style={{ width: `${(item.quantity / Math.max(...sortedSummaries.map(s => s.quantity))) * 100}%` }}>
                          <div className={`h-full flex items-center justify-start`} style={{ width: `${accountedPercentage}%`, background: `#${displayColor}` }}></div>
                        </div>
                      </div>
                      <div className={`text-right ${getHeaderClass("percentage")}`}>
                        {accountedPercentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// This line exports the MultiStackBar component as the default export of the module
export default MultiStackBar;