"use client";

import { useAppSelector, useAppDispatch } from "@hooks/store-hooks";
import { RootState } from "@store/configuration";
import {
  addPartnerFacility,
  fetchPartnerFacilitiesIfEmpty,
  removePartnerFacilityById,
} from "@store/slices/selected-partner-facilities-slice";
import { Facility } from "@lib/types";
import { useEffect } from "react";

const PartnerFacilitiesList = () => {
  const dispatch = useAppDispatch();
  const { selectedPartnerFacilities, partnerFacilities, status, error } =
    useAppSelector((state: RootState) => state.selectedPartnerFacilities);

  useEffect(() => {
    console.log("fetching partner facilities");
    dispatch(fetchPartnerFacilitiesIfEmpty());
  }, [dispatch]);

  const handlePartnerFacilityToggle = (facility: Facility) => {
    if (selectedPartnerFacilities.some((p) => p.id === facility.id)) {
      dispatch(removePartnerFacilityById(facility.id));
    } else {
      dispatch(addPartnerFacility(facility));
    }
  };

  if (status === "loading") return <div>Loading partners...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Partner Facilities</h1>
      <ul>
        {partnerFacilities.map((facility) => (
          <li key={facility.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedPartnerFacilities.some(
                  (p) => p.id === facility.id,
                )}
                onChange={() => {
                  handlePartnerFacilityToggle(facility);
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

export default PartnerFacilitiesList;
