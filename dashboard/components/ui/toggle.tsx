import React from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks/store-hooks";
import { toggleAccountedVariant } from "@/lib/store/slices/toggle-slice";
import { RootState } from "@/lib/store/configuration";

const ToggleVariant: React.FC = () => {
  const dispatch = useAppDispatch();
  const showVariant = useAppSelector((state: RootState) => state.accountedToggle.showVariant);

  const handleToggleVariant = () => {
    dispatch(toggleAccountedVariant());
  };

  return (
    <div className="flex gap-1 items-center justify-between dark:bg-foreground/20 bg-white rounded-sm text-sm tracking-tight dropdown uppercase h-full p-0.5 px-1"
      onClick={handleToggleVariant}
    >
      <button
          className={`duration-300 uppercase tracking-tight p-0.5 rounded-sm  w-full ${
          !showVariant ? "dark:bg-background/80 bg-foreground text-white" : "text-foreground/50"
        }`}
      >
        <span className="p-1 ">Tracked</span>
      </button>
      <button
        className={`duration-300 uppercase tracking-tight p-0.5 rounded-sm  w-full ${
          showVariant ? "dark:bg-background/80 bg-foreground text-white" : "text-foreground/50"
        }`}
      >
        <span className="p-1 ">All</span>
      </button>
    </div>
  );
};

export default ToggleVariant; 