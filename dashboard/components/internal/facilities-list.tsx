"use client";

import { useAppSelector, useAppDispatch } from "@hooks/store-hooks";
import { RootState } from "@store/configuration";
import {
  addFacility,
  fetchFacilitiesIfEmpty,
  removeFacilityById,
} from "@store/slices/selected-facilities-slice";
import { Facility } from "@lib/types";
import { useEffect } from "react";

const FacilitiesList = () => {
  const dispatch = useAppDispatch();
  const { valid, selected, status, error } = useAppSelector(
    (state: RootState) => state.selectedFacilities,
  );

  useEffect(() => {
    dispatch(fetchFacilitiesIfEmpty());
  }, [dispatch]);

  // add handleFacilityToggle
  const handleFacilityToggle = (facility: Facility) => {
    if (selected.some((f) => f.id === facility.id)) {
      dispatch(removeFacilityById(facility.id));
    } else {
      dispatch(addFacility(facility));
    }
  };

  if (status === "loading") return <div>Loading facilities...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Facilities</h1>
      <ul>
        {valid.map((facility) => (
          <li key={facility.id}>
            <label>
              <input
                type="checkbox"
                checked={selected.some((f) => f.id === facility.id)}
                onChange={() => {
                  handleFacilityToggle(facility);
                }}
              />
              {facility.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacilitiesList;
