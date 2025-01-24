import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { AppThunk } from "@store/configuration";
import { EnrichedWasteRate, FetchableList, WasteQuantity } from "@/lib/types";

type EnrichedWasteRatesState = FetchableList<EnrichedWasteRate>;

const wasteDetailsForWasteRate = (wasteRate: EnrichedWasteRate, wasteQuantities: WasteQuantity[]) => {
  const wasteQuantity = wasteQuantities.find(
    (quantity) => 
      quantity.wastetype === wasteRate.parentwastetype && 
      quantity.timerange === wasteRate.timerange && 
      quantity.companyid === wasteRate.company.id && 
      quantity.facilityid === wasteRate.facility.id &&
      quantity.partnercompanyid === wasteRate.partnercompany.id &&
      quantity.partnerfacilityid === wasteRate.partnerfacility.id
  );
  return wasteQuantity ? { quantity: wasteQuantity.quantity, accounted: wasteQuantity.accounted } : { quantity: 0, accounted: 0 };
}

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

    const { data: wasteQuantities, error: wasteQuantitiesError } = await supabase
      .from("wastequantity_monthly_facilitypartner")
      .select(`
        companyid,
        partnercompanyid,
        facilityid,
        partnerfacilityid,
        wastetype,
        quantity,
        accounted,
        timerange
      `)

    if (error || wasteQuantitiesError) {
      throw new Error(error?.message ?? wasteQuantitiesError?.message ?? "Failed to fetch waste quantities" );
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
      }).map((value) => {
        const { quantity, accounted } = wasteDetailsForWasteRate(value, wasteQuantities);
        return {
          ...value,
          quantity,
          accounted,
        };
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
