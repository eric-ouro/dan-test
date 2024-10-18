import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { AppThunk } from "@store/configuration";

export interface WasteType {
  id: number;
  name: string;
}

interface SelectedWasteTypesState {
  wasteTypes: WasteType[];
  selectedWasteTypes: WasteType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Async thunk for fetching plastic types
export const fetchWasteTypes = createAsyncThunk(
  "selectedWasteTypes/fetchWasteTypes",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("wastetypes").select();
    console.log({ data, error });
    if (error) throw new Error(error.message);
    return data as WasteType[];
  },
);

export const fetchWasteTypesIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { wasteTypes } = getState().selectedWasteTypes;
    if (wasteTypes.length === 0) {
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
        console.log("fetchWasteTypes.pending");
        state.status = "loading";
      })
      .addCase(fetchWasteTypes.fulfilled, (state, action) => {
        console.log("fetchWasteTypes.fulfilled");
        state.status = "succeeded";
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
      })
      .addCase(fetchWasteTypes.rejected, (state, action) => {
        console.log("fetchWasteTypes.rejected");
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch waste types";
      });
  },
});

export const { addWasteType, removeWasteTypeById } =
  selectedWasteTypesSlice.actions;
export default selectedWasteTypesSlice.reducer;
