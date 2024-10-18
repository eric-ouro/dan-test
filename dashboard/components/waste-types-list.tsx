"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@hooks/store-hooks";
import { RootState } from "@store/configuration";
import {
  fetchWasteTypesIfEmpty,
  removeWasteTypeById,
  addWasteType,
  fetchWasteTypes,
} from "@store/slices/selected-waste-types-slice";

const WasteTypesList = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchWasteTypesIfEmpty());
  }, [dispatch]);

  const selectedWasteTypes = useAppSelector(
    (state: RootState) => state.selectedWasteTypes,
  );

  if (selectedWasteTypes.status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>All Waste Types</h2>
        <button
          onClick={() => dispatch(fetchWasteTypes())}
          className="px-4 py-2 bg-accent text-foreground rounded hover:bg-accent/80 transition-colors"
        >
          Refresh
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Waste Type</th>
            <th className="text-left">Selected</th>
          </tr>
        </thead>
        <tbody>
          {selectedWasteTypes.wasteTypes.map((wasteType) => (
            <tr key={wasteType.id}>
              <td>{wasteType.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedWasteTypes.selectedWasteTypes.some(
                    (selectedType) => selectedType.id === wasteType.id,
                  )}
                  onChange={() => {
                    if (
                      selectedWasteTypes.selectedWasteTypes.some(
                        (selectedType) => selectedType.id === wasteType.id,
                      )
                    ) {
                      dispatch(removeWasteTypeById(wasteType.id));
                    } else {
                      dispatch(addWasteType(wasteType));
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WasteTypesList;
