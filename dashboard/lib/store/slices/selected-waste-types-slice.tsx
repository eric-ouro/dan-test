import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { AppThunk } from "@store/configuration";
import { FetchableThunkState } from "@store/slices/types";
import { WasteType } from "@/lib/types";

interface SelectedWasteTypesState extends FetchableThunkState {
  wasteTypes: WasteType[];
  selectedWasteTypes: WasteType[];
}

// Async thunk for fetching plastic types
export const fetchWasteTypes = createAsyncThunk(
  "selectedWasteTypes/fetchWasteTypes",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wasterates_monthly_facilitypartner")
      .select(
        `
        wastetypes (
          id,
          name
        )
      `,
      );

    if (error) throw new Error(error.message);

    const uniqueData = data
      .flatMap((item) => item.wastetypes)
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id),
      );

    return uniqueData as WasteType[];
  },
);

export const fetchWasteTypesIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { status } = getState().selectedWasteTypes;
    if (status === "idle") {
      await dispatch(fetchWasteTypes());
    }
  };

const initialState: SelectedWasteTypesState = {
  wasteTypes: [],
  selectedWasteTypes: [],
  status: "idle",
  error: null,
};

const selectedWasteTypesSlice = createSlice({
  name: "selectedWasteTypes",
  initialState,
  reducers: {
    addWasteType: (state, action: PayloadAction<WasteType>) => {
      state.selectedWasteTypes.push(action.payload);
    },
    removeWasteTypeById: (state, action: PayloadAction<number>) => {
      state.selectedWasteTypes = state.selectedWasteTypes.filter(
        (wasteType) => wasteType.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWasteTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWasteTypes.fulfilled, (state, action) => {
        if (state.wasteTypes.length === 0) {
          // set selected waste types to all waste types initially
          state.selectedWasteTypes = action.payload;
        } else {
          state.selectedWasteTypes = state.selectedWasteTypes.filter(
            (wasteType) =>
              action.payload.some(
                (newWasteType) => newWasteType.id === wasteType.id,
              ),
          );
        }
        state.wasteTypes = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchWasteTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch waste types";
      });
  },
});

export const { addWasteType, removeWasteTypeById } =
  selectedWasteTypesSlice.actions;
export default selectedWasteTypesSlice.reducer;
