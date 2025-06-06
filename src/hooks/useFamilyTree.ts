import { useState } from 'react';
import { savePeopleToLocalStorage } from '../features/tree/UtilTree/savePeopleToLocalStorage';
import { PositionUtils, type TipoRelacion } from "../features/tree/UtilTree/PositionUtils";
import type { Person } from "../Model/Person";
import {type RootState } from "../store";
import { deserializePeopleArray } from '../features/tree/UtilTree/deserializePeopleArray';
import { addPersonState as addPersonAction, setPeopleState, resetPeopleState } from "../store/personSlice";
// hooks/useFamilyTreeRedux.ts
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPerson } from '../store/selectedSlice';


//serializar y deserializar los objetos de persona
export function useFamilyTree() {
  
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.selectedPerson);
  const people = useSelector((state: RootState) => state.person.people);


  const addPersonToCanvasAndState = (person: Person, rela: TipoRelacion) => {
    const exists = people.find(p => p.id === person.id);
    
    if (!exists) {
      const newPosition = PositionUtils.calcularPosicion(person, rela);
      person.setPosition(newPosition.x, newPosition.y);

      //const updated = [...people, person];
     // localStorage.setItem("familyTree", JSON.stringify(updated.map(p => p.toPlainObject())));
      
     dispatch(addPersonAction(person));
    }
  };

  //solo se debe saber el seleccionado
  const selectPersonFromState = (person: Person | null) => {
    //console.log("Selecting person:", selected);
    if (!selected || selected.id !== person?.id) {
      //console.log("Selecting person:", person?.toPlainObject());
      dispatch(setSelectedPerson(person?.toPlainObject() ));
    }
  };

  const addTreeSavedToState = (peopleSaved: Person[]) => {
    localStorage.setItem("familyTree", JSON.stringify(peopleSaved.map(p => p.toPlainObject())));
    dispatch(setPeopleState(peopleSaved.map(p => p.toPlainObject())));
  };

  const loadSavedTree = () => {
    const raw = localStorage.getItem("familyTree");
    if (raw) {
      const parsed = JSON.parse(raw);
      dispatch(setPeopleState(parsed));
    }
  };

  const resetTree = () => {
    localStorage.removeItem("familyTree");
    dispatch(resetPeopleState());
  };

  return {
    people,
    addPersonToCanvasAndState,
    resetTree,
    addTreeSavedToState,
    loadSavedTree,
    selectPersonFromState,
  };
}