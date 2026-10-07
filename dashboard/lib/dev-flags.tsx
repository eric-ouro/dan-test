"use client";

import React from "react";

export const DEV_FLAGS = {
  navTrackingDots: {
    label: "Nav tracking dots",
    description:
      "Adds a tracking rail with dots to the left of the sidebar nav.",
    defaultValue: false,
  },
} as const;

export type DevFlag = keyof typeof DEV_FLAGS;
type DevFlagValues = Record<DevFlag, boolean>;

const STORAGE_KEY = "ouro:dev-flags";

const defaultValues = Object.fromEntries(
  Object.entries(DEV_FLAGS).map(([flag, { defaultValue }]) => [
    flag,
    defaultValue,
  ]),
) as DevFlagValues;

interface DevFlagsContextValue {
  flags: DevFlagValues;
  setFlag: (flag: DevFlag, value: boolean) => void;
}

const DevFlagsContext = React.createContext<DevFlagsContextValue | null>(null);

export function DevFlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = React.useState<DevFlagValues>(defaultValues);

  // Read storage after mount so server and client render the same markup.
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<DevFlagValues>;
        setFlags((current) => ({ ...current, ...parsed }));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const setFlag = React.useCallback((flag: DevFlag, value: boolean) => {
    setFlags((current) => {
      const next = { ...current, [flag]: value };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = React.useMemo(() => ({ flags, setFlag }), [flags, setFlag]);

  return (
    <DevFlagsContext.Provider value={value}>
      {children}
    </DevFlagsContext.Provider>
  );
}

export function useDevFlags() {
  const context = React.useContext(DevFlagsContext);
  if (!context) {
    throw new Error("useDevFlags must be used within a DevFlagsProvider");
  }
  return context;
}

export function useDevFlag(flag: DevFlag) {
  return useDevFlags().flags[flag];
}
