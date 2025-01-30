"use client";

import React from "react";

interface DashboardDisplayHeaderProps {
  headerText: string;
  textSize?: string;
  lineHeight?: string;
}

const DashboardDisplayHeader: React.FC<DashboardDisplayHeaderProps> = ({
  headerText,
  textSize = "text-lg",
  lineHeight = "leading-lg",
}) => {
  return (
    <div className="flex items-baseline ">
      <h2 className={`tracking-tight mr-4 sans ${textSize} ${lineHeight}`}>{headerText}</h2>
    </div>
  );
};

export default DashboardDisplayHeader;
