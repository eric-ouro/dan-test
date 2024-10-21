/* Data Types */

export interface WasteType {
  id: number;
  name: string;
  display_color: string;
}

export interface Company {
  id: number;
  name: string;
}

export interface Facility {
  id: number;
  name: string;
}

export interface WasteRate {
  facilityid: number;
  companyid: number;
  partnerfacilityid: number;
  partnercompanyid: number;
  timerange: string;
  parentwastetype: number;
  wastetype: number;
  processed: number;
  recycled: number;
}

export interface EnrichedWasteRate {
  facility: Facility;
  company: Company;
  partnerfacility: Facility;
  partnercompany: Company;
  timerange: string;
  parentwastetype: number;
  wastetype: WasteType;
  processed: number;
  recycled: number;
}

/* Store Types */

export interface FetchableThunkState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface Selector<T> {
  valid: T[];
  selected: T[];
}

interface ItemSelector<T> {
  valid: T;
  selected: T;
}

export interface Interval<T> {
  start: T;
  end: T;
}

export interface FetchableIntervalSelector<T>
  extends FetchableThunkState,
    ItemSelector<Interval<T>> {}

export interface FetchableListSelector<T>
  extends FetchableThunkState,
    Selector<T> {}

/* Sorting Types */

export type SortDirection = "ascending" | "descending";

export interface SortConfig<T, K extends keyof T> {
  key: K;
  direction: SortDirection;
}

/* Hook Types */

export interface AsyncHookState<T> {
  data: T[];
  error: string | null;
  loading: boolean;
}

export type FilterType =
  | "facility"
  | "partnerFacility"
  | "partner"
  | "date"
  | "wasteType";

export interface EnabledFilters {
  filters: FilterType[];
}

export interface FilterLensValues {
  facility: Facility["id"];
  partnerFacility: Facility["id"];
  partner: Company["id"];
  date: string;
  wasteType: WasteType["id"];
}

// Filter lenses map an item to a value that can be assessed against a filter function
export type FilterLens<T, V> = (item: T) => V;

// Filter functions map an item to a boolean value
export type FilterFn<T> = (item: T) => boolean;

// TODO: genericize filter lens across multiple types
export interface FilterSpec<T> {
  lenses: {
    [key in FilterType]?: FilterLens<T, FilterLensValues[key]>;
  };
}

/* Summary Types */

export interface SummaryData {
  processed: number;
  quantity: number;
  recycled: number;
}

export interface SummaryRatios {
  recycleRate: number;
  recyclingLossQuantity: number;
  recyclingLossRate: number;
  processingLoss: number;
  processingLossRate: number;
}

export interface WasteRateSummary extends SummaryData {
  label: WasteType["id"];
  percentage: number;
}

export interface EnrichedWasteRateSummary extends SummaryData {
  label: WasteType;
  percentage: number;
}

export interface EnrichedWasteRateSummaryWithRatios
  extends EnrichedWasteRateSummary,
    SummaryRatios {}
