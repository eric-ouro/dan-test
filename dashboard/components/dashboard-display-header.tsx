"use client";

import React from "react";

interface DashboardDisplayHeaderProps {
  headerText: string;
  textSize?: string;
}

const DashboardDisplayHeader: React.FC<DashboardDisplayHeaderProps> = ({
  headerText,
  textSize = "text-2xl",
}) => {
  return (
    <div className="flex items-baseline mb-4 ">
      <h2 className={`tracking-tight mr-4 sans ${textSize}`}>{headerText}</h2>
      <div
        className="flex-grow border-t border-neutral-400"
        style={{ height: "1px" }}
      ></div>
    </div>
  );
};

export default DashboardDisplayHeader;
