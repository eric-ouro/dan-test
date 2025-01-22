import React, { useEffect, useState } from "react";
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
import { Triangle, Square, Circle, House, Recycle, DiamondsFour, CaretDown, Calendar, CalendarBlank } from "phosphor-react";
import { setEnd, setStart } from "@/lib/store/slices/selected-date-slice";
import { togglePartnerFacility } from "@/lib/store/slices/selected-partner-facilities-slice";


const DropdownFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPartnersIfEmpty());
    dispatch(fetchFacilitiesIfEmpty());
    dispatch(fetchWasteTypesIfEmpty());
  }, [dispatch]);

  const partners = useAppSelector((state: RootState) => state.selectedPartners);
  const facilities = useAppSelector((state: RootState) => state.selectedFacilities);
  const partnerFacilities = useAppSelector((state: RootState) => state.selectedPartnerFacilities);
  const wasteTypes = useAppSelector((state: RootState) => state.selectedWasteTypes);
  const validStart = useAppSelector((state: RootState) => state.selectedDate.valid.start);
  const validEnd = useAppSelector((state: RootState) => state.selectedDate.valid.end);
  const startDate = useAppSelector((state: RootState) => state.selectedDate.selected.start);
  const endDate = useAppSelector((state: RootState) => state.selectedDate.selected.end);

  console.log(startDate, endDate);

  const handleToggle = (type: string, item: any) => {
    switch (type) {
      case "partner":
        dispatch(togglePartner(item));
        break;
      case "partnerFacility":
        dispatch(togglePartnerFacility(item));
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

  const toggleDropdown = (type: string) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleDateChange = (type: string, date: string) => {
    if (type === "start") {
      dispatch(setStart(`${date}-01`));
    } else if (type === "end") {
      dispatch(setEnd(`${date}-01`));
    }
  };

  const renderDropdown = (title: string, items: any[], selectedItems: any[], type: string) => (
    <div className={`dropdown ${openDropdown === type ? 'open' : ''}`}>
      <button
        className="flex flex-row justify-between bg-white dark:bg-neutral-600 border-none p-2 cursor-pointer text-xs rounded-sm w-full"
        onClick={() => toggleDropdown(type)}
      >
        <div className="flex flex-row gap-2 items-end text-left">
          <span>
            {type === "wasteType" && <DiamondsFour color="#f0a500" size={15} weight="fill" />}
            {type === "facility" && <House color="#a5b4fc" size={15} weight="fill" />}
            {type === "partner" && <Recycle color="#9BD49B" size={15} weight="fill" />}
            {type === "partnerFacility" && <House color="#9BD49B" size={15} weight="fill" />}
          </span>
          <span className="text-sm text-neutral-400 uppercase leading-none tracking-[.03em]">
            {title}
          </span>
          <span className="text-sm text-neutral-400 uppercase leading-none tracking-[.03em]">
            {selectedItems.length}/{items.length}
            </span>
        </div>
        <span className="">
          <CaretDown className="text-neutral-800 dark:text-neutral-200" size={15} weight="regular" />
        </span>
      </button>
      {openDropdown === type && (
        <div className="dropdown-content bg-white dark:bg-neutral-600">
          {items.map((item) => (
            <div key={item.id} className="dropdown-item hover:bg-neutral-200 dark:hover:bg-neutral-500">
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <span className="flex items-center gap-2">
                {type === "wasteType" && (
                    <>
                    {item.name === "LDPE" && <Triangle color="#f0a500" size={15} weight="fill" />}
                    {item.name === "PET" && <Square color="#c084fc" size={15} weight="fill" />}
                    {item.name === "HDPE" && <Circle color="#3b82f6" size={15} weight="fill" />}
                    {item.name === "PVC" && <Triangle color="#5AA65B" size={15} weight="fill" />}
                    {item.name === "OTHER" && <Triangle color="#f87171" size={15} weight="fill" />}
                    {item.name !== "LDPE" && item.name !== "PET" && item.name !== "HDPE" && item.name !== "PVC" && item.name !== "OTHER" && (
                      <Circle color="#a3a3a3" size={15} weight="fill" />
                    )}
                    </>
                  )}
                  {/* {type === "facility" && <House color="#a5b4fc" size={15} weight="fill" />} */}
                  {/* {type === "partner" && <Recycle color="#9BD49B" size={15} weight="fill" />} */}
                  <span className="text-sm uppercase leading-none tracking-[.03em]">{item.name}</span>
                </span>
                <div className="custom-checkbox ">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((selected) => selected.id === item.id)}
                    onChange={() => handleToggle(type, item)}                  
                  />
                  <span className="checkmark bg-neutral-500 dark:bg-neutral-600"></span>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDateRange = ( title: string, validStart: string, validEnd: string, startDate: string, endDate: string, type: string) => {
    // make a date picker that allows the user to select a month and year. Parameter dates are encoded as YYYY-MM-DD 
    // The date picker should fire a event to the store to update the start and end date when chosen with the same format.
    // For display, the day value can be ignored.
    // The date picker should be a calendar icon with a dropdown to select the month and year.

  console.log({startDate, endDate, openDropdown, type});
  return ( 
  <div className="date-range-picker dropdown">
    <button
      className="flex flex-row justify-between bg-white dark:bg-neutral-600 border-none p-2 cursor-pointer text-xs rounded-sm w-full"
      onClick={() => toggleDropdown(type)}
    >
    <div className="flex items-center gap-2">
      <CalendarBlank className="text-neutral-800 dark:text-neutral-200" size={15} weight="fill" />
      <span className="text-sm text-neutral-400 uppercase leading-none tracking-[.03em]">
        Start
      </span>
      <span className="text-sm text-neutral-400 uppercase leading-none tracking-[.03em]">
        {/* {new Date(startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", timeZone: "UTC" })} */}
        <input
            type="month"
            min={validStart.slice(0, 7)}
            max={validEnd.slice(0, 7)}
            value={startDate.slice(0, 7)}
            onChange={(e) => handleDateChange("start", e.target.value)}
            className="bg-white dark:bg-neutral-600"
            
          />
      </span>
      <span className="text-sm text-neutral-400 uppercase leading-none tracking-[.03em]">
        -
      </span>
      <CalendarBlank className="text-neutral-800 dark:text-neutral-200" size={15} weight="fill" />
      <span className="text-sm text-neutral-400 uppercase leading-none tracking-[.03em]">
        End
      </span>
      <span className="text-sm text-neutral-400 uppercase leading-none tracking-[.03em]">
        {/* {new Date(endDate).toLocaleDateString("en-US", { year: "numeric", month: "short", timeZone: "UTC" })} */}
        <input
            type="month"
            min={validStart.slice(0, 7)}
            max={validEnd.slice(0, 7)}
            value={endDate.slice(0, 7)}
            onChange={(e) => handleDateChange("end", e.target.value)}
            className="bg-white dark:bg-neutral-600"
            
          />
      </span>
     
    </div>
    </button>
  </div>
  )};

  return (
    <div className="dropdown-filters flex flex-row gap-[10px]">
      {renderDropdown("Materials", wasteTypes.valid, wasteTypes.selected, "wasteType")}
      {renderDropdown("Facilities", facilities.valid, facilities.selected, "facility")}
      {renderDropdown("Partners", partners.valid, partners.selected, "partner")}
      {renderDropdown("Partner Facilities", partnerFacilities.valid, partnerFacilities.selected, "partnerFacility")}
      {renderDateRange("Date Range", validStart, validEnd, startDate, endDate, "dateRange")}
    </div>
  );
};

export default DropdownFilter;