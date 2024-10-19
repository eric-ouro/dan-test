// slice for selected partner facilities fetched in the same way as selected facilities

import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "@store/configuration";
import { FetchableThunkState } from "@store/slices/types";
import { Facility } from "@/lib/types";

interface SelectedPartnerFacilitiesState extends FetchableThunkState {
  partnerFacilities: Facility[];
  selectedPartnerFacilities: Facility[];
}

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
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id),
      );

    return uniqueData as Facility[];
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
  partnerFacilities: [],
  selectedPartnerFacilities: [],
  status: "idle",
  error: null,
};

const selectedPartnerFacilitiesSlice = createSlice({
  name: "selectedPartnerFacilities",
  initialState,
  reducers: {
    addPartnerFacility: (state, action: PayloadAction<Facility>) => {
      state.selectedPartnerFacilities.push(action.payload);
    },
    removePartnerFacilityById: (state, action: PayloadAction<number>) => {
      state.selectedPartnerFacilities = state.selectedPartnerFacilities.filter(
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
        state.status = "succeeded";
        if (state.partnerFacilities.length === 0) {
          state.selectedPartnerFacilities = action.payload;
        } else {
          state.selectedPartnerFacilities =
            state.selectedPartnerFacilities.filter((facility) =>
              action.payload.some(
                (newFacility) => newFacility.id === facility.id,
              ),
            );
        }
        state.partnerFacilities = action.payload;
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
