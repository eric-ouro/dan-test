import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "@store/configuration";
import { FetchableThunkState } from "@store/slices/types";
export interface Partner {
  id: number;
  name: string;
}

interface SelectedPartnersState extends FetchableThunkState {
  partners: Partner[];
  selectedPartners: Partner[];
}

export const fetchPartners = createAsyncThunk(
  "selectedPartners/fetchPartners",
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wasterates_monthly_facilitypartner")
      .select(
        `
        companies!wasterates_monthly_facilitypartner_partnercompanyid_fkey (
          id,
          name
        )
      `,
      );

    if (error) throw new Error(error.message);

    const uniqueData = data
      .flatMap((item) => item.companies)
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id),
      );

    return uniqueData as Partner[];
  },
);

export const fetchPartnersIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { partners } = getState().selectedPartners;
    if (partners.length === 0) {
      await dispatch(fetchPartners());
    }
  };

const initialState: SelectedPartnersState = {
  partners: [],
  selectedPartners: [],
  status: "idle",
  error: null,
};

const selectedPartnersSlice = createSlice({
  name: "selectedPartners",
  initialState,
  reducers: {
    addPartner: (state, action: PayloadAction<Partner>) => {
      state.selectedPartners.push(action.payload);
    },
    removePartnerById: (state, action: PayloadAction<number>) => {
      state.selectedPartners = state.selectedPartners.filter(
        (partner) => partner.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.partners.length === 0) {
          state.selectedPartners = action.payload;
        } else {
          state.selectedPartners = state.selectedPartners.filter((partner) =>
            action.payload.some((newPartner) => newPartner.id === partner.id),
          );
        }
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch partners";
      });
  },
});

export const { addPartner, removePartnerById } = selectedPartnersSlice.actions;
export default selectedPartnersSlice.reducer;
