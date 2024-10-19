/* Data Types */

export interface WasteType {
  id: number;
  name: string;
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

/* Hook Types */

export interface AsyncHookState<T> {
  data: T[];
  error: string | null;
  loading: boolean;
}

/* Summary Types */

export interface WasteRateSummary {
  label: WasteType["id"];
  quantity: number;
  recycled: number;
  processed: number;
  percentage: number;
}
