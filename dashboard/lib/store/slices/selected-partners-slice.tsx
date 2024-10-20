import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "@store/configuration";
import { Company, FetchableListSelector } from "@/lib/types";

type SelectedPartnersState = FetchableListSelector<Company>;

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
      .filter((value): value is Company => value !== null)
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id),
      );

    return uniqueData;
  },
);

export const fetchPartnersIfEmpty =
  (): AppThunk => async (dispatch, getState) => {
    const { status } = getState().selectedPartners;
    if (status === "idle") {
      await dispatch(fetchPartners());
    }
  };

const initialState: SelectedPartnersState = {
  valid: [],
  selected: [],
  status: "idle",
  error: null,
};

const selectedPartnersSlice = createSlice({
  name: "selectedPartners",
  initialState,
  reducers: {
    addPartner: (state, action: PayloadAction<Company>) => {
      state.selected.push(action.payload);
    },
    removePartnerById: (state, action: PayloadAction<number>) => {
      state.selected = state.selected.filter(
        (partner) => partner.id !== action.payload,
      );
    },
    togglePartner: (state, action: PayloadAction<Company>) => {
      if (state.selected.some((partner) => partner.id === action.payload.id)) {
        state.selected = state.selected.filter(
          (partner) => partner.id !== action.payload.id,
        );
      } else {
        state.selected.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        if (state.valid.length === 0) {
          state.selected = action.payload;
        } else {
          state.selected = state.selected.filter((partner) =>
            action.payload.some((newPartner) => newPartner.id === partner.id),
          );
        }
        state.valid = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch partners";
      });
  },
});

export const { addPartner, removePartnerById } = selectedPartnersSlice.actions;
export default selectedPartnersSlice.reducer;
