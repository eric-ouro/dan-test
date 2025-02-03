import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the toggle
const initialState = {
  showVariant: false,
};

// Create the slice
const accountedToggleSlice = createSlice({
  name: 'accountedToggle',
  initialState,
  reducers: {
    toggleAccountedVariant: (state) => {
      state.showVariant = !state.showVariant;
    },
  },
});

// Export the action
export const { toggleAccountedVariant } = accountedToggleSlice.actions;

// Export the reducer
export default accountedToggleSlice.reducer; 