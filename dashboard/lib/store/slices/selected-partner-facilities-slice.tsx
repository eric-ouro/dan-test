// slice for selected partner facilities fetched in the same way as selected facilities

import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "@store/configuration";

export interface PartnerFacility {
  id: number;
  name: string;
}

interface SelectedPartnerFacilitiesState {
  partnerFacilities: PartnerFacility[];
  selectedPartnerFacilities: PartnerFacility[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const fetchPartnerFacilities = createAsyncThunk(
  "selectedPartnerFacilities/fetchPartnerFacilities",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("mixedplasticrates_monthly_facilitypartner")
      .select(
        `
        facilities!mixedplasticrates_monthly_facilitypartne_partnerfacilityid_fkey (
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

    return uniqueData as PartnerFacility[];
  },
);

export const fetchPartnerFacilitiesIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { partnerFacilities } = getState().selectedPartnerFacilities;
    if (partnerFacilities.length === 0) {
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
    addPartnerFacility: (state, action: PayloadAction<PartnerFacility>) => {
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
