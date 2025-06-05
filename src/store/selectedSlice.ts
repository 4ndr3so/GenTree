import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Person } from "../Model/Person";

type PlainPerson = ReturnType<Person["toPlainObject"]>; // tipo plano

const selectedSlice = createSlice({
  name: "selectedPerson",
  initialState: null as PlainPerson | null,
  reducers: {
    setSelectedPerson: (_state, action: PayloadAction<PlainPerson | null>) => {
     // console.log("Selected person:", action.payload);
      return action.payload;
    },
  },
});

export const { setSelectedPerson } = selectedSlice.actions;
export default selectedSlice.reducer;