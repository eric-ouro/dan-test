import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { AppThunk } from "@store/configuration";
import { FetchableThunkState } from "@store/slices/types";

const NULL_DATE = new Date(0).toISOString();

type SerializedDate = string;

interface SerializedDateRange {
  start: SerializedDate;
  end: SerializedDate;
}

interface SelectedDateState extends FetchableThunkState {
  valid: SerializedDateRange;
  selected: SerializedDateRange;
}

export const fetchDates = createAsyncThunk(
  "selectedDate/fetchDates",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wasterates_monthly_facilitypartner")
      .select("timerange");

    if (error) throw new Error(error.message);

    const timeranges = data.map((item) => item.timerange as string);
    const minDate = timeranges.reduce((min, current) => {
      return min < current ? min : current;
    }, timeranges[0]);
    const maxDate = timeranges.reduce((max, current) => {
      return max > current ? max : current;
    }, timeranges[0]);

    return { minDate, maxDate };
  },
);

export const fetchDatesIfEmpty = (): AppThunk => async (dispatch, getState) => {
  const { status } = getState().selectedDate;
  if (status === "idle") {
    await dispatch(fetchDates());
  }
};

const initialState: SelectedDateState = {
  valid: {
    start: NULL_DATE,
    end: NULL_DATE,
  },
  selected: {
    start: NULL_DATE,
    end: NULL_DATE,
  },
  status: "idle",
  error: null,
};

const selectedDateSlice = createSlice({
  name: "selectedDate",
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchDates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.valid.start = action.payload.minDate;
        state.valid.end = action.payload.maxDate;
        state.selected.start = action.payload.minDate;
        state.selected.end = action.payload.maxDate;
      })
      .addCase(fetchDates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch dates";
      });
  },
});

export const { setStart, setEnd } = selectedDateSlice.actions;
export default selectedDateSlice.reducer;
