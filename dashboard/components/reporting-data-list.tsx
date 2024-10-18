"use client";

// component that displays a list of reporting data from the reporting-summaries hook
import React from "react";
import { useReportingSummaries } from "@hooks/use-reporting-summaries";

const ReportingDataList: React.FC = () => {
  const { data, error, loading } = useReportingSummaries();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Reporting Data</h2>
      <ul>
        {data.map((summary, index) => (
          <li key={index}>
            {`${summary.year.toString().padStart(4, "0")}-${summary.month.toString().padStart(2, "0")}: 
            ${summary.petrecycled !== null ? `PET Recycled: ${summary.petrecycled.toString()}, ` : ""}
            ${summary.hdperecycled !== null ? `HDPE Recycled: ${summary.hdperecycled.toString()}, ` : ""}
            ${summary.mixedplasticrecycled !== null ? `Mixed Plastic Recycled: ${summary.mixedplasticrecycled.toString()}` : ""}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportingDataList;
