"use client"; 

import { useMemo, useState } from "react"; 
import DashboardDisplayHeader from "@components/dashboard-display-header"; 
import {
  EnrichedWasteRateSummaryWithRatios,
  SortConfig,
  SortDirection,
} from "@/lib/types";

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
  percentage?: number;
  largestPercentage?: number;
} // Defining the props interface for the MultiStackBar component.

const MultiStackBar = ({ name, summaries, percentage, largestPercentage }: MultiStackBarProps) => {

  // Defining the MultiStackBar component.
  const [sortConfig, setSortConfig] = useState<
    SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>
  >({
    key: "accounted",
    direction: "descending",
  }); // Initializing state for sorting configuration with default values.

  const [isTableDataVisible, setIsTableDataVisible] = useState(false);

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
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalAccounted = useMemo(() => {
    // Calculating the total quantity of all summaries.
    return summaries.reduce((acc, curr) => acc + curr.accounted, 0);
  }, [summaries]);

  const largestFootprintPercentage = useMemo(
    () =>
      Math.max(
        ...summaries.map((item) => (item.accounted / totalAccounted) * 100),
      ),
    [summaries, totalAccounted],
  ); // Calculating the largest footprint percentage for normalization.

  const normalizedWidthGroup = ((percentage ?? 0) / (largestPercentage ?? 1)) * 100;
  console.log(percentage, largestPercentage, normalizedWidthGroup);

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? "text-foreground" : "text-foreground/50";
  };

  return (
    <div className="dashcomponent">
      {/* Main container for the component */}
      <div className="flex flex-col gap-2 overflow-hidden h-full">
        {/* table header */}
        <div 
          className="grid grid-cols-[minmax(200px,200px)_minmax(80px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)_minmax(80px,auto)] gap-2 align-middle py-3 border-y border-foreground/20 cursor-pointer"
          onClick={toggleTableDataVisibility}
        >
          <div>{name && <div className="uppercase text-sm pr-2">{name}</div>}</div>
          <div className="text-foreground/50">
            {totalAccounted.toFixed(1)}t
          </div>
          <div className="text-foreground/50">
            {/* % of accounted for all groups */}
            {percentage !== undefined ? percentage.toFixed(1) : "undefined"}%
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
        {/* Conditionally render table data with transition */}
        <div
          className={`overflow-x-auto transition-max-height duration-300 ease-in-out ${isTableDataVisible ? 'max-h-screen' : 'max-h-0'}`}
          style={{ overflow: 'hidden' }}
        >
          {isTableDataVisible && (
            <div>
              <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)] gap-2 text-xs text-left uppercase my-2 ">
                <div className="text-foreground/50">Material</div>
                <div onClick={() => requestSort("accounted")} className={`cursor-pointer ${getHeaderClass("accounted")}`}>Accounted</div>
                <div onClick={() => requestSort("recycleRate")} className={`text-right cursor-pointer ${getHeaderClass("recycleRate")}`}>Recycled</div>
                <div onClick={() => requestSort("recyclingLossRate")} className={` text-right cursor-pointer ${getHeaderClass("recyclingLossRate")}`}>R&nbsp;Loss</div>
                <div onClick={() => requestSort("processingLossRate")} className={`text-right cursor-pointer ${getHeaderClass("processingLossRate")}`}>P&nbsp;Loss</div>
              </div>
              <div>
                {sortedSummaries
                  .filter(item => item.accounted > 0)
                  .map((item, index) => {
                    const minWidth = item.accounted > 0 ? "10%" : "0";
                    const footprintPercentage = totalAccounted > 0 ? (item.accounted / totalAccounted) * 100 : 0;
                    const normalizedWidth = (footprintPercentage / largestFootprintPercentage) * 100;
                    const displayLabel = item.label.name === "MixedPlastic" ? "Mixed" : item.label.name;

                    return (
                      <div className="grid grid-cols-[minmax(200px,auto)_minmax(80px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)_minmax(80px,auto)_minmax(80px,auto)] gap-2 align-middle py-3 border-t border-foreground/20" key={index}>
                        <div className="text-foreground flex-none">
                          <span className="flex items-center sans-medium">
                            <span className="inline-block w-[1em] h-[1em] flex-shrink-0 rounded-full mr-2" style={{ background: `#${item.label.display_color}` }}></span>
                            {displayLabel}
                          </span>
                        </div>
                        <div className={`text-left ${getHeaderClass("accounted")} flex-none`}>{item.accounted.toFixed(1).padStart(4, "0")}t</div>
                        <div className={`text-left ${getHeaderClass("accounted")} flex-none`}>{footprintPercentage.toFixed(1)}%</div>
                        <div className="w-full flex items-center">
                          {/* Recycling bar */}
                          <div className="h-[1em] text-left overflow-hidden flex items-center" style={{ width: `${Math.max(normalizedWidth, 10)}%` }}>
                            <div className={`h-full flex items-center justify-start`} style={{ width: `${Math.max(item.recycleRate, 10)}%`, background: `#${item.label.display_color}` }}></div>
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
};

// Define a new component variant
const MultiStackBarVariant = ({ name, summaries, percentage }: MultiStackBarProps) => {
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

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? "text-foreground" : "text-foreground/50";
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="dashcomponent">
      <div className="flex flex-col overflow-hidden h-full gap-4">
        <div className="sans text-xl">
          {name && <DashboardDisplayHeader headerText={name} textSize="text-xxl" />}
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[minmax(100px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)] gap-2 text-xs text-left uppercase mb-2 text-xs">
            <div className="text-foreground/50 ">Material</div>
            <div onClick={() => requestSort("quantity")} className={`cursor-pointer ${getHeaderClass("quantity")}`}>Quantity</div>
            <div onClick={() => requestSort("accounted")} className={`cursor-pointer ${getHeaderClass("accounted")}`}>Accounted</div>
            <div onClick={() => requestSort("percentage")} className={`text-right cursor-pointer ${getHeaderClass("percentage")}`}>Accounted %</div>
          </div>
          <div>
            {sortedSummaries.map((item, index) => {
              const accountedPercentage = totalQuantity > 0 ? (item.accounted / totalQuantity) * 100 : 0;

              return (
                <div className="grid grid-cols-[minmax(100px,auto)_minmax(80px,auto)_minmax(80px,auto)_1fr_minmax(80px,auto)] gap-2 align-middle py-3 border-t border-foreground/20" key={index}>
                  <div className="text-foreground">
                    <span className="flex items-center sans-medium">
                      <span className={`inline-block w-[1em] h-[1em] flex-shrink-0 rounded-full mr-2`} style={{ background: `#${item.label.display_color}` }}></span>
                      {item.label.name}
                    </span>
                  </div>
                  <div className={`text-left ${getHeaderClass("quantity")}`}>
                    {item.quantity.toFixed(1).padStart(4, "0")}t
                  </div>
                  <div className={`text-left ${getHeaderClass("accounted")}`}>
                    {item.accounted.toFixed(1).padStart(4, "0")}t
                  </div>
                  <div className="w-full flex items-center">
                    <div className="h-[1em] text-left overflow-hidden flex bg-foreground/50" style={{ width: `${(item.quantity / Math.max(...sortedSummaries.map(s => s.quantity))) * 100}%` }}>
                      <div className={`h-full flex items-center justify-start`} style={{ width: `${accountedPercentage}%`, background: `#${item.label.display_color}` }}></div>
                    </div>
                  </div>
                  <div className={`text-right ${getHeaderClass("percentage")}`}>
                    {accountedPercentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add a toggle button to switch between variants
const MultiStackBarWithToggle = ({ name, summaries, percentage, largestPercentage, testprop }: MultiStackBarProps) => {
  
  const [showVariant, setShowVariant] = useState(false);

  return (
    <div>
      <div className="flex items-center bg-gray-200 rounded-md p-1 text-xs tracking-tight w-fit "
      onClick={() => setShowVariant(!showVariant)}
      >
        <button
          className={`px-4 py-3 rounded-md transition-colors duration-300 ${
            !showVariant ? "bg-white text-black" : "text-gray-500"
          }`}
        >
          Tracked
        </button>
        <button
          className={`px-4 py-3 rounded-md transition-colors duration-300 ${
            showVariant ? "bg-white text-black" : "text-gray-500"
          }`}
        >
          All
        </button>
      </div>
      {showVariant ? (
        <MultiStackBarVariant name={name} summaries={summaries} percentage={percentage} testprop={testprop} />
      ) : (
        <MultiStackBar name={name} summaries={summaries} percentage={percentage} largestPercentage={largestPercentage} testprop={testprop} />
      )}
    </div>
  );
};

export default MultiStackBarWithToggle; // Exporting the MultiStackBar component as the default export.
