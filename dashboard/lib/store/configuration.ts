import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import selectedDateSlice from "@slices/selected-date-slice";
import selectedWasteTypesSlice from "@slices/selected-waste-types-slice";
import selectedFacilitiesSlice from "@slices/selected-facilities-slice";
import selectedPartnerFacilitiesSlice from "@slices/selected-partner-facilities-slice";
import selectedPartnersSlice from "@slices/selected-partners-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      selectedDate: selectedDateSlice,
      selectedWasteTypes: selectedWasteTypesSlice,
      selectedFacilities: selectedFacilitiesSlice,
      selectedPartnerFacilities: selectedPartnerFacilitiesSlice,
      selectedPartners: selectedPartnersSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
