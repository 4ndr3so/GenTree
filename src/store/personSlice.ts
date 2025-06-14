// src/store/personSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Person } from "../Model/Person";


export type State = {
  people: Person[];
  person?: Person | null;
};

const initialState: State = {
  people: [],
};

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    addRootPersonState(state, action: PayloadAction<Person>) {
      if (state.people.length === 0) {
        const rootPerson = action.payload;
        rootPerson.setIsRoot(true);
        console.log("Adding root person:", rootPerson);
        state.people.push(rootPerson);
      }
    },
    setPeopleState(state, action: PayloadAction<Person[]>) {
      state.people = action.payload;
    },
    addPersonState(state, action: PayloadAction<Person>) {
      const exists = state.people.find(p => p.id === action.payload.id);
      if (!exists) {
        state.people.push(action.payload);
      }
    },
    resetPeopleState(state) {
      state.people = [];
    },
    updatePersonState: (state, action: PayloadAction<Person>) => {
      const index = state.people.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.people[index] = action.payload;
      }
    }, 
    modifyPeopleAddPerson(state, action: PayloadAction<Person[]>) {
      action.payload.forEach(newPerson => {
        const existing = state.people.find(p => p.id === newPerson.id);
        if (existing) {
          existing.positionX = newPerson.positionX;
          existing.positionY = newPerson.positionY;
        } else {
          state.people.push(newPerson);
        }
      });
    }

  },
});

export const { setPeopleState, addPersonState, resetPeopleState, addRootPersonState, updatePersonState, modifyPeopleAddPerson } = personSlice.actions;
export default personSlice.reducer;
