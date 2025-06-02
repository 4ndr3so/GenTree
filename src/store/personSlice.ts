// src/store/personSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Person } from "../Model/Person";


type State = {
  people: Person[];
};

const initialState: State = {
  people: [],
};

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<Person[]>) => {
      state.people = action.payload;
    },
    addPerson: (state, action: PayloadAction<Person>) => {
      const exists = state.people.find(p => p.id === action.payload.id);
      if (!exists) {
        state.people.push(action.payload);
      }
    },
    resetPeople: (state) => {
      state.people = [];
    }
  },
});

export const { setPeople, addPerson, resetPeople } = personSlice.actions;
export default personSlice.reducer;
