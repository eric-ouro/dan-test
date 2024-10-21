"use client";

import { useMemo, useState } from "react";
import { useEnrichedWasteRateSummariesWithRatios } from "@/lib/hooks/use-enriched-waste-rate-summaries";
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

const PlasticFootprintMultiStackBar = () => {
  const [sortConfig, setSortConfig] = useState<
    SortConfig<EnrichedWasteRateSummaryWithRatios, SortKey>
  >({
    key: "percentage",
    direction: "descending",
  });
  const {
    data: summaries,
    loading: summariesLoading,
    error: summariesError,
  } = useEnrichedWasteRateSummariesWithRatios({
    filters: ["partner", "facility", "partnerFacility", "wasteType"],
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

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalQuantity = useMemo(() => {
    return summaries.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [summaries]);

  const largestFootprintPercentage = useMemo(
    () =>
      Math.max(
        ...summaries.map((item) => (item.quantity / totalQuantity) * 100),
      ),
    [summaries, totalQuantity],
  );

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? "custom-underline" : "text-neutral-400";
  };

  if (summariesLoading) return <div>Loading...</div>;
  if (summariesError) return <div>Error: {summariesError}</div>;

  return (
    <div className="dashcomponent">
      <div className="flex flex-col gap-3 overflow-hidden h-full">
        <DashboardDisplayHeader headerText="Plastic Footprint & Recycle Rates" />
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="cursor-pointer text-xs text-left ">
              <tr className="h-12">
                <th className="text-neutral-400 text-xs text-left min-w-[80px] font-normal ">
                  Plastic
                </th>
                <th
                  onClick={() => {
                    requestSort("percentage");
                  }}
                  className={` text-left min-w-[60px] font-normal ${getHeaderClass("percentage")}`}
                >
                  Footprint
                </th>
                <th
                  className={` min-w-[60px] font-normal ${getHeaderClass("percentage")}`}
                >
                  {" "}
                </th>
                <th
                  className={`text-left font-normal ${getHeaderClass("percentage")}`}
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
                  className={` min-w-[60px] font-normal ${getHeaderClass("processingLossRate")}`}
                >
                  P Loss
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSummaries.map((item, index) => {
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
                    <td className=" max-w-[60px]">
                      {footprintPercentage.toFixed(1)}%
                    </td>
                    <td className="text-left max-w-[60px]">
                      {item.quantity.toFixed(1).padStart(4, "0")}&nbsp;Tn
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
                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.38-3.36L23 10M1 14l5.09 5.09A9 9 0 0020.49 15" /></svg> */}
                            {/* <span>{recycleRate.toFixed(1)}%</span> */}
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
                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M1 6h22" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg> */}
                            {/* <span>{recyclingLossRate.toFixed(1)}%</span> */}
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
                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M1 6h22" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg> */}
                            {/* <span>{processingLossRate.toFixed(1)}%</span> */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className=" max-w-[60px]">
                      {item.recycleRate.toFixed(1)}%
                    </td>
                    <td className=" max-w-[60px]">
                      {item.recyclingLossRate.toFixed(1)}%
                    </td>
                    <td className=" max-w-[60px]">
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

export default PlasticFootprintMultiStackBar;
