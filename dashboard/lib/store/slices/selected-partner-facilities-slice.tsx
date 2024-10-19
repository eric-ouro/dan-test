// slice for selected partner facilities fetched in the same way as selected facilities

import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "@store/configuration";
import { Facility, FetchableListSelector } from "@/lib/types";

type SelectedPartnerFacilitiesState = FetchableListSelector<Facility>;

export const fetchPartnerFacilities = createAsyncThunk(
  "selectedPartnerFacilities/fetchPartnerFacilities",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wasterates_monthly_facilitypartner")
      .select(
        `
        facilities!wasterates_monthly_facilitypartner_partnerfacilityid_fkey (
          id,
          name
        )
      `,
      );

    if (error) throw new Error(error.message);

    const uniqueData = data
      .flatMap((item) => item.facilities)
      .filter((value): value is Facility => value !== null)
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id),
      );

    return uniqueData;
  },
);

export const fetchPartnerFacilitiesIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { status } = getState().selectedPartnerFacilities;
    if (status === "idle") {
      await dispatch(fetchPartnerFacilities());
    }
  };

const initialState: SelectedPartnerFacilitiesState = {
  valid: [],
  selected: [],
  status: "idle",
  error: null,
};

const selectedPartnerFacilitiesSlice = createSlice({
  name: "selectedPartnerFacilities",
  initialState,
  reducers: {
    addPartnerFacility: (state, action: PayloadAction<Facility>) => {
      state.selected.push(action.payload);
    },
    removePartnerFacilityById: (state, action: PayloadAction<number>) => {
      state.selected = state.selected.filter(
        (facility) => facility.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerFacilities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPartnerFacilities.fulfilled, (state, action) => {
        if (state.valid.length === 0) {
          state.selected = action.payload;
        } else {
          state.selected = state.selected.filter((facility) =>
            action.payload.some(
              (newFacility) => newFacility.id === facility.id,
            ),
          );
        }
        state.valid = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPartnerFacilities.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ?? "Failed to fetch partner facilities";
      });
  },
});

export const { addPartnerFacility, removePartnerFacilityById } =
  selectedPartnerFacilitiesSlice.actions;
export default selectedPartnerFacilitiesSlice.reducer;
