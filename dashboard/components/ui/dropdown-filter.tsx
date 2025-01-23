import React, { useEffect, useState, useRef } from "react";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/datepicker.css";

const DropdownFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchPartnersIfEmpty());
    dispatch(fetchFacilitiesIfEmpty());
    dispatch(fetchWasteTypesIfEmpty());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const partners = useAppSelector((state: RootState) => state.selectedPartners);
  const facilities = useAppSelector((state: RootState) => state.selectedFacilities);
  const partnerFacilities = useAppSelector((state: RootState) => state.selectedPartnerFacilities);
  const wasteTypes = useAppSelector((state: RootState) => state.selectedWasteTypes);
  const validStart = useAppSelector((state: RootState) => state.selectedDate.valid.start);
  const validEnd = useAppSelector((state: RootState) => state.selectedDate.valid.end);
  const startDate = useAppSelector((state: RootState) => state.selectedDate.selected.start);
  const endDate = useAppSelector((state: RootState) => state.selectedDate.selected.end);

  console.log("start date", startDate, "end date", endDate);

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

  const handleDateChange = (type: string, selectedDate: Date | null) => {
    if (selectedDate) {
      console.log(`Selected ${type} date (UTC):`, selectedDate.toISOString());
      const formattedDate = selectedDate.toISOString().slice(0, 10);
      if (type === "start") {
        dispatch(setStart(formattedDate));
      } else if (type === "end") {
        dispatch(setEnd(formattedDate));
      }
    } else {
      console.log(`No date selected for ${type}`);
    }
  };

  const renderDropdown = (title: string, items: any[], selectedItems: any[], type: string) => (
    <div ref={dropdownRef} className={`dropdown mono ${openDropdown === type ? 'open' : ''}`}>
      <button
        className={`flex flex-row justify-between bg-white dark:bg-neutral-600 border-none p-2 cursor-pointer text-sm rounded-sm w-full gap-3 ${openDropdown === type ? 'activedropdown' : ''}`}
        onClick={() => toggleDropdown(type)}
      >
        <div className="flex flex-row gap-2 items-center text-left">
          <span>
            {type === "wasteType" && <DiamondsFour color="#f0a500" size={15} weight="fill" />}
            {type === "facility" && <House color="#a5b4fc" size={15} weight="fill" />}
            {type === "partner" && <Recycle color="#9BD49B" size={15} weight="fill" />}
            {type === "partnerFacility" && <House color="#9BD49B" size={15} weight="fill" />}
          </span>
          <span className="text-sm text-neutral-600 dark:text-neutral-200 uppercase leading-none tracking-[.03em]">
            {title}
          </span>
          <span className="text-sm text-neutral-400 dark:text-neutral-400 uppercase leading-none tracking-[.03em]">
            {selectedItems.length}/{items.length}
            </span>
        </div>
        <span className="">
          <CaretDown className="text-neutral-600 dark:text-neutral-200" size={15} weight="regular" />
        </span>
      </button>
      {openDropdown === type && (
        <div className="dropdown-content bg-white dark:bg-neutral-600">
          {items.map((item, index) => (
            <div key={item.id}>
              <div className="dropdown-item  hover:bg-neutral-200 dark:hover:bg-neutral-500">
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="flex items-center gap-2">
                    {type === "wasteType" && (
                      <>
                        {item.name === "LDPE" && <Triangle color="#f0a500" size={15} weight="fill" />}
                        {item.name === "PET" && <Square color="#ec715d" size={15} weight="fill" />}
                        {item.name === "HDPE" && <Circle color="#3b82f6" size={15} weight="fill" />}
                        {item.name === "PVC" && <Triangle color="#5AA65B" size={15} weight="fill" />}
                        {item.name === "OTHER" && <Triangle color="#f87171" size={15} weight="fill" />}
                        {item.name !== "LDPE" && item.name !== "PET" && item.name !== "HDPE" && item.name !== "PVC" && item.name !== "OTHER" && (
                          <Circle color="#a3a3a3" size={15} weight="fill" />
                        )}
                      </>
                    )}
                    <span className="text-sm uppercase leading-none tracking-[.03em]">{item.name}</span>
                  </span>
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.some((selected) => selected.id === item.id)}
                      onChange={() => handleToggle(type, item)}                  
                    />
                    <span className="checkmark bg-neutral-500 dark:bg-neutral-600"></span>
                  </div>
                </label>
              </div>
              {index < items.length - 1 && <div className="border-t  border-neutral-200 dark:border-neutral-800"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDatePicker = (type: "start" | "end", validStart: string, validEnd: string, date: string) => {
    const handleDateChangeWrapper = (selectedDate: Date | null) => handleDateChange(type, selectedDate);

    const datePickerRef = useRef<any>(null);

    console.log(`Initial ${type} date string:`, date);
    // parse date to local date, format yyyy-mm-dd, in the local timezone
    const selectedDate = new Date(date);
    selectedDate.setHours(selectedDate.getHours() + selectedDate.getTimezoneOffset() / 60);

    const minDate = new Date(validStart);
    minDate.setHours(minDate.getHours() + minDate.getTimezoneOffset() / 60);

    const maxDate = new Date(validEnd);
    maxDate.setHours(maxDate.getHours() + maxDate.getTimezoneOffset() / 60);

    console.log(`Rendering ${type} date picker with date (UTC):`, selectedDate.toISOString());
    console.log({minDate, maxDate, selectedDate, validStart, validEnd, date});

    return (
      <div className="mono date-picker dropdown ">
        <div className="flex flex-row justify-between bg-white dark:bg-neutral-600 border-none p-2 cursor-pointer rounded-sm w-full gap-3"
        onClick={() => datePickerRef.current.setFocus()}>
        <span className="flex flex-row items-center text-left">
        <span className="mr-2">
          <CalendarBlank color="#A7A7A7FF" size={15} weight="fill" />
        </span>
          <span className="text-neutral-600 dark:text-neutral-200 text-sm uppercase leading-none tracking-[.03em] mr-2">
            {type === "start" ? "Start " : "End "}
          </span>
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate}
            onChange={handleDateChangeWrapper}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            className="bg-transparent focus:outline-none text-sm text-neutral-400 uppercase leading-none tracking-[.03em] h-[12px] w-[53px]"
          />
        </span>
        <CaretDown
          className="text-neutral-600 dark:text-neutral-200"
          size={15}
          weight="regular"
          onClick={() => datePickerRef.current.setFocus()}
        />
        </div>
      </div>
    );
  };

  return (
    <div className="dropdown-filters flex flex-row flex-wrap gap-1">
      {renderDropdown("Materials", wasteTypes.valid, wasteTypes.selected, "wasteType")}
      {renderDropdown("Facilities", facilities.valid, facilities.selected, "facility")}
      {renderDropdown("Partners", partners.valid, partners.selected, "partner")}
      {renderDropdown("Partner Fac.", partnerFacilities.valid, partnerFacilities.selected, "partnerFacility")}
      {renderDatePicker("start", validStart, validEnd, startDate)}
      {renderDatePicker("end", validStart, validEnd, endDate)}
    </div>
  );
};

export default DropdownFilter;