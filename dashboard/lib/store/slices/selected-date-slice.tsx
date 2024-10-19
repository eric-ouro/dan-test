import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { AppThunk } from "@store/configuration";
import { FetchableIntervalSelector } from "@/lib/types";

const NULL_DATE = new Date(0).toISOString();

type SerializedDate = string;

type SelectedDateState = FetchableIntervalSelector<SerializedDate>;

export const fetchDates = createAsyncThunk(
  "selectedDate/fetchDates",
  async () => {
    const supabase = createClient();
    const minDateQuery = supabase
      .from("wasterates_monthly_facilitypartner")
      .select("timerange")
      .order("timerange", { ascending: true })
      .limit(1);
    const maxDateQuery = supabase
      .from("wasterates_monthly_facilitypartner")
      .select("timerange")
      .order("timerange", { ascending: false })
      .limit(1);

    const [minDateQueryResult, maxDateQueryResult] = await Promise.all([
      minDateQuery,
      maxDateQuery,
    ]);

    if (minDateQueryResult.error || maxDateQueryResult.error) {
      throw new Error("Failed to fetch dates");
    }

    return {
      minDate: minDateQueryResult.data[0].timerange,
      maxDate: maxDateQueryResult.data[0].timerange,
    };
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
        state.valid.start = action.payload.minDate;
        state.valid.end = action.payload.maxDate;
        state.selected.start = action.payload.minDate;
        state.selected.end = action.payload.maxDate;
        state.status = "succeeded";
      })
      .addCase(fetchDates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch dates";
      });
  },
});

export const { setStart, setEnd } = selectedDateSlice.actions;
export default selectedDateSlice.reducer;
