import { useState } from 'react';
import { savePeopleToLocalStorage } from '../features/tree/UtilTree/savePeopleToLocalStorage';
import { PositionUtils, type TipoRelacion } from "../features/tree/UtilTree/PositionUtils";
import type { Person } from "../Model/Person";
import {type RootState } from "../store";
import { deserializePeopleArray } from '../features/tree/UtilTree/deserializePeopleArray';
import { addPerson as addPersonAction, setPeople, resetPeople } from "../store/personSlice";
// hooks/useFamilyTreeRedux.ts
import { useDispatch, useSelector } from 'react-redux';


export function useFamilyTree() {
  const dispatch = useDispatch();
  const plainPeople = useSelector((state: RootState) => state.person.people);
  const people = deserializePeopleArray(plainPeople);

  const addPerson = (person: Person, rela: TipoRelacion) => {
    const exists = people.find(p => p.id === person.id);
    if (!exists) {
      const newPosition = PositionUtils.calcularPosicion(person, rela);
      person.setPosition(newPosition.x, newPosition.y);
      const updated = [...people, person];
      localStorage.setItem("familyTree", JSON.stringify(updated.map(p => p.toPlainObject())));
      dispatch(addPersonAction(person.toPlainObject()));
    }
  };

  const addTreeSaved = (peopleSaved: Person[]) => {
    localStorage.setItem("familyTree", JSON.stringify(peopleSaved.map(p => p.toPlainObject())));
    dispatch(setPeople(peopleSaved.map(p => p.toPlainObject())));
  };

  const loadSavedTree = () => {
    const raw = localStorage.getItem("familyTree");
    if (raw) {
      const parsed = JSON.parse(raw);
      dispatch(setPeople(parsed));
    }
  };

  const resetTree = () => {
    localStorage.removeItem("familyTree");
    dispatch(resetPeople());
  };

  return {
    people,
    addPerson,
    resetTree,
    addTreeSaved,
    loadSavedTree,
  };
}