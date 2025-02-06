import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showPercentage: false,
};

const percentageToggleSlice = createSlice({
  name: 'percentageToggle',
  initialState,
  reducers: {
    togglePercentage: (state) => {
      state.showPercentage = !state.showPercentage;
    },
  },
});

export const { togglePercentage } = percentageToggleSlice.actions;
export default percentageToggleSlice.reducer;