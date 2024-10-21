import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { AppThunk } from "@store/configuration";
import { EnrichedWasteRate, FetchableList } from "@/lib/types";

type EnrichedWasteRatesState = FetchableList<EnrichedWasteRate>;

export const fetchEnrichedWasteRates = createAsyncThunk(
  "enrichedWasteRates/fetchEnrichedWasteRates",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wasterates_monthly_facilitypartner")
      .select(
        `
        company:companies!wasterates_monthly_facilitypartner_companyid_fkey (
          id,
          name
        ),
        partnercompany:companies!wasterates_monthly_facilitypartner_partnercompanyid_fkey (
          id,
          name
        ),
        facility:facilities!wasterates_monthly_facilitypartner_facilityid_fkey (
          id,
          name
        ),
        partnerfacility:facilities!wasterates_monthly_facilitypartner_partnerfacilityid_fkey (
          id,
          name
        ),
        wastetype:wastetypes (
          id,
          name,
          display_color
        ),
        parentwastetype,
        processed,
        recycled,
        timerange
      `,
      );

    if (error) {
      throw new Error(error.message);
    } else {
      // filter out null values
      return data.filter((value): value is EnrichedWasteRate => {
        return (
          value.company !== null &&
          value.partnercompany !== null &&
          value.facility !== null &&
          value.partnerfacility !== null &&
          value.wastetype !== null
        );
      });
    }
  },
);

export const fetchEnrichedWasteRatesIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { status } = getState().enrichedWasteRates;
    if (status === "idle") {
      await dispatch(fetchEnrichedWasteRates());
    }
  };

const initialState: EnrichedWasteRatesState = {
  data: [],
  status: "idle",
  error: null,
};

const enrichedWasteRatesSlice = createSlice({
  name: "enrichedWasteRates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrichedWasteRates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEnrichedWasteRates.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchEnrichedWasteRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch facilities";
      });
  },
});

export default enrichedWasteRatesSlice.reducer;
