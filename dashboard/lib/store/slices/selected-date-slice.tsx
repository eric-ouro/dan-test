import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedDateState {
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}

const initialState: SelectedDateState = {
  // set to negative infinity
  startMonth: -Infinity,
  startYear: -Infinity,
  endMonth: Infinity,
  endYear: Infinity,
};

const selectedDateSlice = createSlice({
  name: "selectedDate",
  initialState,
  reducers: {
    setStartMonth: (state, action: PayloadAction<number>) => {
      state.startMonth = action.payload;
    },
    setStartYear: (state, action: PayloadAction<number>) => {
      state.startYear = action.payload;
    },
    setEndMonth: (state, action: PayloadAction<number>) => {
      state.endMonth = action.payload;
    },
    setEndYear: (state, action: PayloadAction<number>) => {
      state.endYear = action.payload;
    },
  },
});

export const { setStartMonth, setStartYear, setEndMonth, setEndYear } =
  selectedDateSlice.actions;
export default selectedDateSlice.reducer;
