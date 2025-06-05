import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Person } from "../Model/Person";


const selectedSlice = createSlice({
  name: "selectedPerson",
  initialState: null as Person | null,
  reducers: {
    setSelectedPerson: (_state, action: PayloadAction<Person | null>) => {
      return action.payload;
    },
  },
});

export const { setSelectedPerson } = selectedSlice.actions;
export default selectedSlice.reducer;
