"use client";

import { useAppSelector } from "@hooks/store-hooks";

const StoreViewer = () => {
  const store = useAppSelector((state) => state);

  return (
    <pre className="text-xs font-mono p-3 rounded border max-h-screen overflow-auto">
      {JSON.stringify(store, null, 2)}
    </pre>
  );
};

export default StoreViewer;
