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
  | "quantity"
  | "recycled"
  | "recyclingLossRate"
  | "processingLossRate"; 

interface MultiStackBarProps {
  summaries: EnrichedWasteRateSummaryWithRatios[];
  name?: string;
} // Defining the props interface for the MultiStackBar component.

const MultiStackBar = ({ name, summaries }: MultiStackBarProps) => {
  // Defining the MultiStackBar component.
  const [sortConfig, setSortConfig] = useState<
    SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>
  >({
    key: "quantity",
    direction: "descending",
  }); // Initializing state for sorting configuration with default values.

  const sortedSummaries = useMemo(
    () =>
      [...summaries].sort((a, b) => {
        // Sorting the summaries based on the sortConfig state.
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

  const totalQuantity = useMemo(() => {
    // Calculating the total quantity of all summaries.
    return summaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [summaries]);

  const largestFootprintPercentage = useMemo(
    () =>
      Math.max(
        ...summaries.map((item) => (item.quantity / totalQuantity) * 100),
      ),
    [summaries, totalQuantity],
  ); // Calculating the largest footprint percentage for normalization.

  const getHeaderClass = (key: SortKey) => {
    // Function to get the CSS class for the table headers based on the sort key.
    return sortConfig.key === key ? "custom-underline" : "text-neutral-400";
  };

  return (
    <div className="dashcomponent">
      {/* Main container for the component */}
      <div className="flex flex-col gap-3 overflow-hidden h-full">
        {/* Flex container for the header and table */}
        <div className="sans text-xl">
          {/* Header section */}
          {name && <DashboardDisplayHeader headerText={name} textSize="text-lg" />}
        </div>
        <div className="overflow-x-auto">
          {/* Table container with horizontal overflow */}
          <table className="min-w-full table-auto">
            {/* Table element */}
            <thead className="cursor-pointer text-xs text-left ">
              {/* Table header */}
              <tr className="h-12">
                <th className="text-neutral-400 text-xs text-left min-w-[80px] font-normal ">
                  Plastic
                </th>
                <th
                  onClick={() => {
                    requestSort("quantity");
                  }}
                  className={` text-left min-w-[60px] font-normal ${getHeaderClass("quantity")}`}
                >
                  Footprint
                </th>
                <th
                  className={` min-w-[60px] font-normal cursor-default ${getHeaderClass("percentage")}`}
                >
                  {" "}
                </th>
                <th
                  className={`text-left font-normal  cursor-default ${getHeaderClass("percentage")}`}
                >
                  {" "}
                </th>
                <th
                  onClick={() => {
                    requestSort("recycled");
                  }}
                  className={` text-left min-w-[80px] font-normal ${getHeaderClass("recycled")}`}
                >
                  Recycled
                </th>
                <th
                  onClick={() => {
                    requestSort("recyclingLossRate");
                  }}
                  className={` min-w-[60px] font-normal ${getHeaderClass("recyclingLossRate")}`}
                >
                  R Loss
                </th>
                <th
                  onClick={() => {
                    requestSort("processingLossRate");
                  }}
                  className={` min-w-[60px] text-right font-normal ${getHeaderClass("processingLossRate")}`}
                >
                  P Loss
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Table body */}
              {sortedSummaries.map((item, index) => {
                // Mapping over sorted summaries to create table rows.
                const minWidth = item.quantity > 0 ? "10%" : "0";
                const footprintPercentage =
                  totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
                const normalizedWidth =
                  (footprintPercentage / largestFootprintPercentage) * 100;
                const displayLabel =
                  item.label.name === "MixedPlastic"
                    ? "Mixed"
                    : item.label.name;

                return (
                  <tr className="align-middle h-[44px]" key={index}>
                    {/* Table row */}
                    <td>
                      <span className="flex items-center ">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2`}
                          style={{
                            background: `#${item.label.display_color}`,
                          }}
                        ></span>
                        {displayLabel}
                      </span>
                    </td>
                    <td className="text-left max-w-[60px]">
                      {item.quantity.toFixed(1).padStart(4, "0")}&nbsp;Tn
                    </td>
                    <td className=" text-right max-w-[60px]">
                      {footprintPercentage.toFixed(1)}%
                    </td>
                    <td className="w-[100%] px-[20px]">
                      <div
                        className="h-[34px]  text-left overflow-hidden rounded-sm  flex ]"
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
                    <td className=" max-w-[60px] ">
                      {item.recycleRate.toFixed(1)}%
                    </td>
                    <td className=" max-w-[60px] ">
                      {item.recyclingLossRate.toFixed(1)}%
                    </td>
                    <td className=" max-w-[60px] text-right">
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

export default MultiStackBar; // Exporting the MultiStackBar component as the default export.
