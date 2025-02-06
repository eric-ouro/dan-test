import React from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks/store-hooks";
import { togglePercentage } from "@/lib/store/slices/toggle-percentage-slice";
import { RootState } from "@/lib/store/configuration";

const TogglePercentageQuantity: React.FC = () => {  
  const dispatch = useAppDispatch();
  const showPercentage = useAppSelector((state: RootState) => state.percentageToggle.showPercentage);

  const handleToggle = () => {
    dispatch(togglePercentage());
  };

  return (
    <div className="flex gap-1 items-center justify-between dark:bg-foreground/20 bg-white rounded-sm text-sm tracking-tight dropdown uppercase h-full p-0.5 px-1"
      onClick={handleToggle}
    >
      <button
          className={`duration-300 uppercase tracking-tight p-0.5 rounded-sm  w-full ${
          !showPercentage ? "dark:bg-background/80 bg-foreground text-white" : "text-foreground/50"
        }`}
      >
        <span className="p-1 ">Quantities</span>
      </button>
      <button
        className={`duration-300 uppercase tracking-tight p-0.5 rounded-sm  w-full ${
          showPercentage ? "dark:bg-background/80 bg-foreground text-white" : "text-foreground/50"
        }`}
      >
        <span className="p-1 ">Percentage</span>
      </button>
    </div>
  );
};

export default TogglePercentageQuantity;