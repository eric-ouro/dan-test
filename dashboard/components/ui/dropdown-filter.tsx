import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@hooks/store-hooks";
import { RootState } from "@store/configuration";
import {
  fetchPartnersIfEmpty,
  togglePartner,
} from "@slices/selected-partners-slice";
import {
  fetchFacilitiesIfEmpty,
  toggleFacility,
} from "@slices/selected-facilities-slice";
import {
  fetchWasteTypesIfEmpty,
  toggleWasteType,
} from "@slices/selected-waste-types-slice";
import { Triangle, Square, Circle, House, Recycle, DiamondsFour } from "phosphor-react";


const DropdownFilter: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPartnersIfEmpty());
    dispatch(fetchFacilitiesIfEmpty());
    dispatch(fetchWasteTypesIfEmpty());
  }, [dispatch]);

  const partners = useAppSelector((state: RootState) => state.selectedPartners);
  const facilities = useAppSelector((state: RootState) => state.selectedFacilities);
  const wasteTypes = useAppSelector((state: RootState) => state.selectedWasteTypes);

  const handleToggle = (type: string, item: any) => {
    switch (type) {
      case "partner":
        dispatch(togglePartner(item));
        break;
      case "facility":
        dispatch(toggleFacility(item));
        break;
      case "wasteType":
        dispatch(toggleWasteType(item));
        break;
      default:
        break;
    }
  };

  const renderDropdown = (title: string, items: any[], selectedItems: any[], type: string) => (
    <div className="dropdown">
      <button className="bg-white border-none p-2 cursor-pointer text-xs rounded-sm">
        <div className="flex flex-col gap-0 text-left">   
            <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
            {type === "wasteType" && <DiamondsFour color="#f0a500" size={16} weight="fill" />}
            {type === "facility" && <House color="#a5b4fc" size={16} weight="fill" />}
            {type === "partner" && <Recycle color="#9BD49B" size={16} weight="fill" />}
            {title} {selectedItems.length}/{items.length}
            </span>
        </div>
      </button>
      <div className="dropdown-content">
        {items.map((item) => (
          <div key={item.id} className="dropdown-item">
            <label className="flex items-center justify-between gap-4">
                <span className="flex items-start gap-1">
                {type === "wasteType" && (
                    <>
                    {item.name === "LDPE" && <Triangle color="#f0a500" size={16} weight="fill" />}
                    {item.name === "PET" && <Square color="#c084fc" size={16} weight="fill" />}
                    {item.name === "HDPE" && <Circle color="#3b82f6" size={16} weight="fill" />}
                    {item.name === "OTHER" && <Triangle color="#f87171" size={16} weight="fill" />}
                    </>
                )}
                {type === "facility" && <House color="#a5b4fc" size={16} weight="fill" />}
                {type === "partner" && <Recycle color="#9BD49B" size={16} weight="fill" />}
                <span className="ml-1">{item.name}</span>
              </span>
            
            <input
                type="checkbox"
                checked={selectedItems.some((selected) => selected.id === item.id)}
                onChange={() => handleToggle(type, item)}
                
              />
              </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dropdown-filters flex flex-row gap-[10px]">
      {renderDropdown("Partners", partners.valid, partners.selected, "partner")}
      {renderDropdown("Facilities", facilities.valid, facilities.selected, "facility")}
      {renderDropdown("Materials", wasteTypes.valid, wasteTypes.selected, "wasteType")}
    </div>
  );
};

export default DropdownFilter;