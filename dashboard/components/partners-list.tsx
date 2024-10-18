"use client";

import React, { useEffect } from "react";
import { RootState } from "@store/configuration";
import {
  fetchPartnersIfEmpty,
  addPartner,
  removePartnerById,
  Partner,
} from "@slices/selected-partners-slice";
import { useAppSelector, useAppDispatch } from "@hooks/store-hooks";

const PartnersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { partners, selectedPartners, status, error } = useAppSelector(
    (state: RootState) => state.selectedPartners,
  );

  useEffect(() => {
    dispatch(fetchPartnersIfEmpty());
  }, [dispatch]);

  const handlePartnerToggle = (partner: Partner) => {
    if (selectedPartners.some((p) => p.id === partner.id)) {
      dispatch(removePartnerById(partner.id));
    } else {
      dispatch(addPartner(partner));
    }
  };

  if (status === "loading") return <div>Loading partners...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Partners</h2>
      <ul>
        {partners.map((partner) => (
          <li key={partner.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedPartners.some((p) => p.id === partner.id)}
                onChange={() => {
                  handlePartnerToggle(partner);
                }}
              />
              {partner.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnersList;
