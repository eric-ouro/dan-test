import { useAppDispatch, useAppSelector } from "@/lib/hooks/store-hooks";
import { FilterFn, FilterSpec, FilterType } from "@/lib/types";
import { useEffect, useMemo } from "react";
import { fetchDatesIfEmpty } from "@store/slices/selected-date-slice";
import { fetchFacilitiesIfEmpty } from "@store/slices/selected-facilities-slice";
import { fetchPartnersIfEmpty } from "@store/slices/selected-partners-slice";
import { fetchPartnerFacilitiesIfEmpty } from "@store/slices/selected-partner-facilities-slice";
import { fetchWasteTypesIfEmpty } from "@store/slices/selected-waste-types-slice";

export const useSelectorFilters = <RecordType>({
  filterSpec,
}: {
  filterSpec: FilterSpec<RecordType>;
}): FilterFn<RecordType> => {
  const dispatch = useAppDispatch();
  const selectedFacilities = useAppSelector(
    (state) => state.selectedFacilities,
  );
  const selectedPartnerFacilities = useAppSelector(
    (state) => state.selectedPartnerFacilities,
  );
  const selectedPartners = useAppSelector((state) => state.selectedPartners);
  const selectedDateRange = useAppSelector((state) => state.selectedDate);
  const selectedWasteTypes = useAppSelector(
    (state) => state.selectedWasteTypes,
  );

  useEffect(() => {
    dispatch(fetchFacilitiesIfEmpty());
    dispatch(fetchPartnerFacilitiesIfEmpty());
    dispatch(fetchPartnersIfEmpty());
    dispatch(fetchDatesIfEmpty());
    dispatch(fetchWasteTypesIfEmpty());
  }, [dispatch]);

  const selectedValuesInitialized = useMemo(() => {
    return [
      selectedFacilities.status,
      selectedPartnerFacilities.status,
      selectedPartners.status,
      selectedDateRange.status,
      selectedWasteTypes.status,
    ].every((value) => value === "succeeded");
  }, [
    selectedFacilities.status,
    selectedPartnerFacilities.status,
    selectedPartners.status,
    selectedDateRange.status,
    selectedWasteTypes.status,
  ]);

  const filters = useMemo<FilterFn<RecordType>[]>(() => {
    const f: FilterFn<RecordType>[] = [];

    if (!selectedValuesInitialized) return f;

    Object.keys(filterSpec.lenses).forEach((filterType) => {
      const filterLens = filterSpec.lenses[filterType as FilterType];
      if (filterLens) {
        switch (filterType as FilterType) {
          case "date":
            f.push((item: RecordType) => {
              return (
                new Date(selectedDateRange.selected.start).getTime() <=
                  filterLens(item) &&
                new Date(selectedDateRange.selected.end).getTime() >=
                  filterLens(item)
              );
            });
            break;
          case "partner":
            f.push((item: RecordType) => {
              return selectedPartners.selected.some(
                (partner) => partner.id === filterLens(item),
              );
            });
            break;
          case "facility":
            f.push((item: RecordType) => {
              return selectedFacilities.selected.some(
                (facility) => facility.id === filterLens(item),
              );
            });
            break;
          case "partnerFacility":
            f.push((item: RecordType) => {
              return selectedPartnerFacilities.selected.some(
                (facility) => facility.id === filterLens(item),
              );
            });
            break;
          case "wasteType":
            f.push((item: RecordType) => {
              return selectedWasteTypes.selected.some(
                (wasteType) => wasteType.id === filterLens(item),
              );
            });
            break;
          default:
            throw new Error(`Unsupported filter type ${filterType}`);
        }
      }
    });

    return f;
  }, [
    selectedValuesInitialized,
    selectedFacilities.selected,
    selectedPartnerFacilities.selected,
    selectedPartners.selected,
    selectedDateRange.selected,
    selectedWasteTypes.selected,
  ]);

  const filterFn = useMemo(() => {
    return (item: RecordType) => {
      return filters.every((filter) => filter(item));
    };
  }, [filters]);

  return filterFn;
};
