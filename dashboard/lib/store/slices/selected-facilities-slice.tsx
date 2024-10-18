import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { AppThunk } from "@store/configuration";

export interface Facility {
  id: number;
  name: string;
}

interface SelectedFacilitiesState {
  facilities: Facility[];
  selectedFacilities: Facility[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const fetchFacilities = createAsyncThunk(
  "selectedFacilities/fetchFacilities",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("mixedplasticrates_monthly_facilitypartner")
      .select(
        `
        facilities!mixedplasticrates_monthly_facilitypartner_facilityid_fkey (
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

export const fetchFacilitiesIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { facilities } = getState().selectedFacilities;
    if (facilities.length === 0) {
      await dispatch(fetchFacilities());
    }
  };

const initialState: SelectedFacilitiesState = {
  facilities: [],
  selectedFacilities: [],
  status: "idle",
  error: null,
};

const selectedFacilitiesSlice = createSlice({
  name: "selectedFacilities",
  initialState,
  reducers: {
    addFacility: (state, action: PayloadAction<Facility>) => {
      state.selectedFacilities.push(action.payload);
    },
    removeFacilityById: (state, action: PayloadAction<number>) => {
      state.selectedFacilities = state.selectedFacilities.filter(
        (facility) => facility.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFacilities.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.facilities.length === 0) {
          state.selectedFacilities = action.payload;
        } else {
          state.selectedFacilities = state.selectedFacilities.filter(
            (facility) =>
              action.payload.some(
                (newFacility) => newFacility.id === facility.id,
              ),
          );
        }
        state.facilities = action.payload;
      })
      .addCase(fetchFacilities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch facilities";
      });
  },
});

export const { addFacility, removeFacilityById } =
  selectedFacilitiesSlice.actions;
export default selectedFacilitiesSlice.reducer;
