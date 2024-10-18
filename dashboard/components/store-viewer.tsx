"use client";

import { useAppSelector } from "@hooks/store-hooks";
import { useState } from "react";

const StoreViewer = () => {
  const storeData = useAppSelector((state) => state);
  const storeKeys = Object.keys(storeData);
  const [selectedKey, setSelectedKey] = useState<string>(storeKeys[0]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKey(e.target.value);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Store Viewer</h2>
      <select
        value={selectedKey}
        onChange={handleKeyChange}
        className="mb-3 p-2 border rounded"
      >
        {storeKeys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <pre className="text-xs font-mono p-3 rounded border max-h-screen overflow-auto">
        {JSON.stringify(
          storeData[selectedKey as keyof typeof storeData],
          null,
          2,
        )}
      </pre>
    </div>
  );
};

export default StoreViewer;
