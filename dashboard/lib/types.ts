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
