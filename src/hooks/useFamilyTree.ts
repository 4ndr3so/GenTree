import { useEffect, useState } from 'react';
import { savePeopleToLocalStorage } from '../features/tree/UtilTree/savePeopleToLocalStorage';
import { deserializePeopleArray } from '../features/tree/UtilTree/deserializePeopleArray';
import { PositionUtils, type TipoRelacion } from "../features/tree/UtilTree/PositionUtils";
import type { Person } from "../Model/Person";
import { type RootState } from "../store";
import { setPeopleState, resetPeopleState, addPersonState } from "../store/personSlice";
// hooks/useFamilyTreeRedux.ts
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPerson } from '../store/selectedSlice';
import { useCanvasDimensions } from '../components/context/CanvasDimensionsContext';
import { PositionUtilsV2 } from '../features/tree/UtilTree/PositionUtilsV2';
import { TreeLayoutUtils } from '../features/tree/treeNode/TreeLayoutUtils';
import { PositionClass } from '../features/tree/UtilTree/PositionClass';


//serializar y deserializar los objetos de persona
export function useFamilyTree() {
  const { width, height } = useCanvasDimensions();
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.selectedPerson);
  const people = useSelector((state: RootState) => state.person.people);
  let updatedPeople = [...people];

  const addPersonToCanvasAndState = (person: Person, rela: TipoRelacion) => {
    const exists  = updatedPeople.find(p => p.id === person.id); // <- usa updatedPeople aquí
    //console.log("from useFamilyTree", people);
    if (!exists) {
      //v1
      //console.log(width, height);
      updatedPeople = [...updatedPeople, person];
      const newPosition = PositionUtils.calcularPosicion(person, rela, width, updatedPeople);
     // person.setPosition(newPosition.x, newPosition.y);
      
      //v2
      // ✅ Guarda en Redux*/*
      dispatch(addPersonState(person));
     
     //  dispatch(modifyPeopleAddPerson(person));
    }
  };

  //solo se debe saber el seleccionado
  const selectPersonFromState = (person: Person | null) => {
    //console.log("Selecting person:", selected);
    if (!selected || selected.id !== person?.id) {
      //console.log("Selecting person:", person?.toPlainObject());
      dispatch(setSelectedPerson(person?.toPlainObject()));
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