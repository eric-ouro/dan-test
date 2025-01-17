import React, { useEffect, useMemo } from "react";
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
import { Triangle, Square, Circle, House, Recycle, DiamondsFour, CaretDown } from "phosphor-react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setStart, setEnd } from "@slices/selected-date-slice";
import { useWasteRates } from "@hooks/use-waste-rates";


const DropdownFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: wasteRates } = useWasteRates({ filters: ["date"] });

  useEffect(() => {
    dispatch(fetchPartnersIfEmpty());
    dispatch(fetchFacilitiesIfEmpty());
    dispatch(fetchWasteTypesIfEmpty());
  }, [dispatch]);

  const partners = useAppSelector((state: RootState) => state.selectedPartners);
  const facilities = useAppSelector((state: RootState) => state.selectedFacilities);
  const wasteTypes = useAppSelector((state: RootState) => state.selectedWasteTypes);
  const dateRange = useAppSelector((state: RootState) => state.selectedDate);

  const validDates = useMemo(() => {
    return wasteRates.map((rate) => new Date(rate.timerange));
  }, [wasteRates]);

  useEffect(() => {
    console.log('Valid Dates:', validDates);
    if (validDates.length > 0) {
      const sortedDates = [...validDates].sort((a, b) => a.getTime() - b.getTime());
      console.log('Earliest Date:', sortedDates[0]);
      console.log('Latest Date:', sortedDates[sortedDates.length - 1]);
    }
  }, [validDates]);

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

  const handleDateChange = (type: string, date: Date | null) => {
    if (!date) return;
    if (type === 'start') {
      dispatch(setStart(date.toISOString()));
    } else if (type === 'end') {
      dispatch(setEnd(date.toISOString()));
    }
  };

  const isDateValid = (date: Date) => {
    return validDates.some((validDate) => validDate.getTime() === date.getTime());
  };

  const renderDropdown = (title: string, items: any[], selectedItems: any[], type: string) => (
    <div className="dropdown ">
      <button className="flex flex-row justify-between bg-white border-none p-2 cursor-pointer text-xs rounded-sm w-full">
        <div className="flex flex-row gap-2 items-end text-left">   
            <span>
                {type === "wasteType" && <DiamondsFour color="#f0a500" size={12} weight="fill" />}
                {type === "facility" && <House color="#a5b4fc" size={12} weight="fill" />}
                {type === "partner" && <Recycle color="#9BD49B" size={12} weight="fill" />}
            </span>
            <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
            {title} 
            </span>
            <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
            {selectedItems.length}/{items.length}
            </span>
        </div>
        <span className="">
                <CaretDown color="#1C1C1C" size={12} weight="regular" />
            </span>
      </button>
      <div className="dropdown-content">
        {items.map((item) => (
          <div key={item.id} className="dropdown-item">
            <label className="flex items-center justify-between gap-4 cursor-pointer ">
                <span className="flex items-center gap-2">
                {type === "wasteType" && (
                    <>
                    {item.name === "LDPE" && <Triangle color="#f0a500" size={12} weight="fill" />}
                    {item.name === "PET" && <Square color="#c084fc" size={12} weight="fill" />}
                    {item.name === "HDPE" && <Circle color="#3b82f6" size={12} weight="fill" />}
                    {item.name === "OTHER" && <Triangle color="#f87171" size={12} weight="fill" />}
                    </>
                )}
                {type === "facility" && <House color="#a5b4fc" size={12} weight="fill" />}
                {type === "partner" && <Recycle color="#9BD49B" size={12} weight="fill" />}
                <span className=" text-[10px] uppercase leading-none tracking-[.03em]">{item.name}</span>
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
      {renderDropdown("Materials", wasteTypes.valid, wasteTypes.selected, "wasteType")}
      {renderDropdown("Facilities", facilities.valid, facilities.selected, "facility")}
      {renderDropdown("Partners", partners.valid, partners.selected, "partner")}
      <div className="dropdown ">
        
          <DatePicker
            selected={new Date(dateRange.selected.start)}
            onChange={(date) => handleDateChange('start', date)}
            filterDate={isDateValid}
            customInput={
              <button className="w-[170px] flex flex-row justify-between bg-white border-none p-2 cursor-pointer text-xs rounded-sm">
                <div className="flex flex-row gap-2 items-end text-left">
                  <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
                    Start Date
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
                    {dateRange.selected.start ? new Date(dateRange.selected.start).toLocaleDateString() : "Select"}
                  </span>
                </div>
                <span className="">
                  <CaretDown color="#1C1C1C" size={12} weight="regular" />
                </span>
              </button>
            }
          />
        
        
      </div>
      <div className="dropdown ">
        <DatePicker
          selected={new Date(dateRange.selected.end)}
          onChange={(date) => handleDateChange('end', date)}
          filterDate={isDateValid}
          customInput={
            <button className="w-[170px] flex flex-row justify-between bg-white border-none p-2 cursor-pointer text-xs rounded-sm w-full">
              <div className="flex flex-row gap-2 items-end text-left">
                <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
                  End Date
                </span>
                <span className="text-[10px] text-neutral-400 uppercase leading-none tracking-[.03em]">
                  {dateRange.selected.end ? new Date(dateRange.selected.end).toLocaleDateString() : "Select"}
                </span>
              </div>
              <span className="">
                <CaretDown color="#1C1C1C" size={12} weight="regular" />
              </span>
            </button>
          }
        />
      </div>
    </div>
  );
};

export default DropdownFilter;