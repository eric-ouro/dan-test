"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@hooks/store-hooks";
import { RootState } from "@store/configuration";
import {
  fetchWasteTypesIfEmpty,
  removeWasteTypeById,
  addWasteType,
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
        <h2>Waste Types</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left"></th>
            <th className="text-left"></th>
          </tr>
        </thead>
        <tbody>
          {selectedWasteTypes.valid.map((wasteType) => (
            <tr key={wasteType.id}>
              <td>{wasteType.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedWasteTypes.selected.some(
                    (selectedType) => selectedType.id === wasteType.id,
                  )}
                  onChange={() => {
                    if (
                      selectedWasteTypes.selected.some(
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
