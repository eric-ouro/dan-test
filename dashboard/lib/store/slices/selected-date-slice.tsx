import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const NULL_DATE = new Date(0).toISOString();

type SerializedDate = string;

interface SerializedDateRange {
  start: SerializedDate;
  end: SerializedDate;
}

interface SelectedDateState {
  valid: SerializedDateRange;
  selected: SerializedDateRange;
}

const initialState: SelectedDateState = {
  valid: {
    start: NULL_DATE,
    end: NULL_DATE,
  },
  selected: {
    start: NULL_DATE,
    end: NULL_DATE,
  },
};

const selectedDateSlice = createSlice({
  name: "selectedDate",
  initialState,
  reducers: {
    setValidInterval: (state, action: PayloadAction<SerializedDateRange>) => {
      console.log("setValidInterval", action.payload);
      state.valid.start = action.payload.start;
      state.valid.end = action.payload.end;
      // if selected interval is default, set it to valid interval
      if (
        state.selected.start === NULL_DATE ||
        state.selected.end === NULL_DATE
      ) {
        state.selected.start = action.payload.start;
        state.selected.end = action.payload.end;
      }

      // if selected start date is outside the valid interval, set it to valid start
      if (state.selected.start < action.payload.start) {
        state.selected.start = action.payload.start;
      }
      // if selected end date is outside the valid interval, set it to valid end
      if (state.selected.end > action.payload.end) {
        state.selected.end = action.payload.end;
      }
    },
    setSelectedInterval: (
      state,
      action: PayloadAction<SerializedDateRange>,
    ) => {
      state.selected.start = action.payload.start;
      state.selected.end = action.payload.end;
    },
    setStart: (state, action: PayloadAction<SerializedDate>) => {
      // if action payload is outside the valid interval, do nothing
      if (
        action.payload < state.valid.start ||
        action.payload > state.valid.end
      ) {
        return;
      }
      state.selected.start = action.payload;
    },
    setEnd: (state, action: PayloadAction<SerializedDate>) => {
      // if action payload is outside the valid interval, do nothing
      if (
        action.payload < state.valid.start ||
        action.payload > state.valid.end
      ) {
        return;
      }
      state.selected.end = action.payload;
    },
  },
});

export const { setValidInterval, setSelectedInterval, setStart, setEnd } =
  selectedDateSlice.actions;
export default selectedDateSlice.reducer;
