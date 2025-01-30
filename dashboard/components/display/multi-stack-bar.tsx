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
  | "recycled"
  | "recyclingLossRate"
  | "processingLossRate"
  | "quantity"
  | "label"; 

interface MultiStackBarProps {
  summaries: EnrichedWasteRateSummaryWithRatios[];
  name?: string;
} // Defining the props interface for the MultiStackBar component.

const MultiStackBar = ({ name, summaries }: MultiStackBarProps) => {
  // Defining the MultiStackBar component.
  const [sortConfig, setSortConfig] = useState<
    SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>
  >({
    key: "accounted",
    direction: "descending",
  }); // Initializing state for sorting configuration with default values.

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

  console.log("sortedSummaries", sortedSummaries);

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

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? "text-foreground" : "text-foreground/50";
  };

  return (
    <div className="dashcomponent">
      {/* Main container for the component */}
      <div className="flex flex-col ga overflow-hidden h-full">
        {/* Flex container for the header and table */}
        <div className="sans text-xl">
          {/* Header section */}
          {name && <DashboardDisplayHeader headerText={name} textSize="text-lg" />}
        </div>
        <div className="overflow-x-auto">
          {/* Table container with horizontal overflow */}
          <table className="min-w-full table-auto border-collapse">
            {/* Table element */}
            <thead className="cursor-pointer text-xs text-left uppercase ">
              {/* Table header */}
              <tr className="h-12 border-b border-foreground/20 ">
                <th
                  className="min-w-[100px] border-foreground/20 text-foreground/50"
                >
                  Material
                </th>
                <th
                  onClick={() => {
                    requestSort("accounted");
                  }}
                  className={`min-w-[60px] border-foreground/20 ${getHeaderClass("accounted")}`}
                >
                  Accounted
                </th>
                <th
                  className={` cursor-default border-foreground/20 ${getHeaderClass("percentage")} `}
                >
                  {" "}
                </th>
                <th
                  className={`cursor-default border-foreground/20 ${getHeaderClass("percentage")} `}
                >
                  {" "}
                </th>
                <th
                  onClick={() => {
                    requestSort("recycled");
                  }}
                  className={`text-left min-w-[80px] border-foreground/20 ${getHeaderClass("recycled")}`}
                >
                  Recycled
                </th>
                <th
                  onClick={() => {
                    requestSort("recyclingLossRate");
                  }}
                  className={`min-w-[60px] text-left border-foreground/20 ${getHeaderClass("recyclingLossRate")}`}
                >
                  R&nbsp;Loss
                </th>
                <th
                  onClick={() => {
                    requestSort("processingLossRate");
                  }}
                  className={`min-w-[60px] text-right ${getHeaderClass("processingLossRate")}`}
                >
                  P&nbsp;Loss
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Table body */}
              {sortedSummaries.map((item, index) => {
                // Mapping over sorted summaries to create table rows.
                const minWidth = item.accounted > 0 ? "10%" : "0";
                const footprintPercentage =
                  totalAccounted > 0 ? (item.accounted / totalAccounted) * 100 : 0;
                const normalizedWidth =
                  (footprintPercentage / largestFootprintPercentage) * 100;
                const displayLabel =
                  item.label.name === "MixedPlastic"
                    ? "Mixed"
                    : item.label.name;

                return (
                  <tr
                    className={`align-middle h-[39px] ${
                      index === sortedSummaries.length - 1
                        ? ""
                        : "border-b border-foreground/20"
                    }`}
                    key={index}
                  >
                    {/* Table row */}
                    <td className="border-foreground/20 text-foreground">
                      <span className="flex items-center ">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{
                            background: `#${item.label.display_color}`,
                          }}
                        ></span>
                        {displayLabel}
                      </span>
                    </td>
                    <td className={`text-left border-foreground/20 ${getHeaderClass("accounted")}`}>
                      {item.accounted.toFixed(1).padStart(4, "0")}t
                    </td>
                    <td className={`text-left border-foreground/20 ${getHeaderClass("accounted")}`}>
                      {footprintPercentage.toFixed(1)}%
                    </td>
                    <td className="w-[100%]  border-foreground/20 ">
                      <div
                        className="h-[17.34px] px-[17.34px] text-left overflow-hidden  flex"
                        style={{
                          width: `${Math.max(normalizedWidth, 10)}%`,
                          minWidth,
                        }}
                      >
                        <div
                          className={`h-full flex items-center justify-start`}
                          style={{
                            width: `${Math.max(item.recycleRate, 10)}%`,
                            minWidth,
                            background: `#${item.label.display_color}`,
                          }}
                        >
                          <div className="text-white text-xs ml-1 opacity-60 flex items-center">
                            {/* Placeholder for recycle rate */}
                          </div>
                        </div>
                        <div
                          className={`h-full flex items-center justify-start bg-neutral-400`}
                          style={{
                            width: `${Math.max(item.recyclingLossRate, 10)}%`,
                            minWidth,
                          }}
                        >
                          <div className="text-white text-xs ml-1 opacity-60 flex items-center">
                            {/* Placeholder for recycling loss rate */}
                          </div>
                        </div>
                        <div
                          className={`h-full flex items-center justify-start bg-neutral-500`}
                          style={{
                            width: `${Math.max(item.processingLossRate, 10)}%`,
                            minWidth,
                          }}
                        >
                          <div className="text-white text-xs ml-1 opacity-60 flex items-center">
                            {/* Placeholder for processing loss rate */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`text-left border-foreground/20 ${getHeaderClass("recycled")}`}>
                      {item.recycleRate.toFixed(1)}%
                    </td>
                    <td className={`text-left border-foreground/20 ${getHeaderClass("recyclingLossRate")}`}>
                      {item.recyclingLossRate.toFixed(1)}%
                    </td>
                    <td className={`text-right border-foreground/20 ${getHeaderClass("processingLossRate")}`}>
                      {item.processingLossRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Define a new component variant
const MultiStackBarVariant = ({ name, summaries }: MultiStackBarProps) => {
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
      <div className="flex flex-col ga overflow-hidden h-full">
        <div className="sans text-xl">
          {name && <DashboardDisplayHeader headerText={name} textSize="text-lg" />}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="cursor-pointer text-xs text-left uppercase ">
              <tr className="h-12 border-b border-foreground/20  ">
                <th className="text-neutral-400 min-w-[100px] border-foreground/20">
                  Material
                </th>
                <th
                  onClick={() => {
                    requestSort("quantity");
                  }}
                  className={` min-w-[80px] border-foreground/20 ${getHeaderClass("quantity")} `}
                >
                  Quantity
                </th>
                <th
                  onClick={() => {
                    requestSort("accounted");
                  }}
                  className={` min-w-[60px] border-foreground/20 ${getHeaderClass("accounted")} `}
                >
                  Accounted
                </th>
                <th className="cursor-default">
                  
                </th>
                <th
                  onClick={() => {
                    requestSort("percentage");
                  }}
                  className={` min-w-[60px] text-right border-foreground/20 ${getHeaderClass("percentage")} `}
                >
                  Accounted&nbsp;%
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSummaries.map((item, index) => {
                const accountedPercentage =
                  totalQuantity > 0 ? (item.accounted / totalQuantity) * 100 : 0;

                return (
                  <tr
                    className={`align-middle h-[39px] ${
                      index === sortedSummaries.length - 1
                        ? ""
                        : "border-b border-foreground/20"
                    }`}
                    key={index}
                  >
                    <td className="border-foreground/20 ">
                      <span className="flex items-center ">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2`}
                          style={{
                            background: `#${item.label.display_color}`,
                          }}
                        ></span>
                        {item.label.name}
                      </span>
                    </td>
                    <td className="text-left border-foreground/20 ">
                      {item.quantity.toFixed(1).padStart(4, "0")}t
                    </td>
                    <td className="text-left border-foreground/20 ">
                      {item.accounted.toFixed(1).padStart(4, "0")}t
                    </td>
                    <td className="w-[100%]  border-foreground/20  ">
                      <div
                        className="h-[17.34px] text-left overflow-hidden  flex bg-foreground"
                        style={{
                          width: `${(item.quantity / Math.max(...sortedSummaries.map(s => s.quantity))) * 100}%`,
                          minWidth: "10%",
                        }}
                      >
                        <div
                          className={`h-full flex items-center justify-start `}
                          style={{
                            width: `${accountedPercentage}%`,
                            minWidth: "10%",
                            background: `#${item.label.display_color}`, 
                          }}
                        >
                        </div>
                      </div>
                    </td>
                    <td className="text-right border-foreground/20 ">
                      {accountedPercentage.toFixed(1)}%
                    </td> 
                  </tr>
                  
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add a toggle button to switch between variants
const MultiStackBarWithToggle = ({ name, summaries }: MultiStackBarProps) => {
  const [showVariant, setShowVariant] = useState(false);

  return (
    <div>
      <div className="flex items-center bg-gray-200 rounded-md p-1 text-xs tracking-tight w-fit"
      onClick={() => setShowVariant(!showVariant)}
      >
        <button
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            !showVariant ? "bg-white text-black" : "text-gray-500"
          }`}
        >
          Tracked
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            showVariant ? "bg-white text-black" : "text-gray-500"
          }`}
        >
          All
        </button>
      </div>
      {showVariant ? (
        <MultiStackBarVariant name={name} summaries={summaries} />
      ) : (
        <MultiStackBar name={name} summaries={summaries} />
      )}
    </div>
  );
};

export default MultiStackBarWithToggle; // Exporting the MultiStackBar component as the default export.
