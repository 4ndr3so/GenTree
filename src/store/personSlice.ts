// src/store/personSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Person } from "../Model/Person";



type PlainPerson = ReturnType<Person["toPlainObject"]>; // tipo plano

type State = {
  people: PlainPerson[];
};

const initialState: State = {
  people: [],
};

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {

    //no es necesaria?
     addRootPerson(state, action: PayloadAction<PlainPerson>) {
      if (state.people.length === 0) {
        //add the root person only if no one exists
        const rootPerson = {...action.payload,isRoot: true}
        console.log("Adding root person:", rootPerson);
        // mark it explicitly as root in our state‐shape
        state.people.push(rootPerson)
      }
      // if people already exist, do nothing (or you could throw/console.warn)
    },
    setPeople: (state, action: PayloadAction<PlainPerson[]>) => {
      state.people = action.payload;
    },
    addPerson: (state, action: PayloadAction<PlainPerson>) => {
      const exists = state.people.find(p => p.id === action.payload.id);
      if (!exists) {
        state.people.push(action.payload);
      }
    },
    resetPeople: (state) => {
      state.people = [];
    },
  },
});

export const { setPeople, addPerson, resetPeople, addRootPerson } = personSlice.actions;
export default personSlice.reducer;
