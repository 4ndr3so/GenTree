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


//serializar y deserializar los objetos de persona
export function useFamilyTree() {
  const { width, height } = useCanvasDimensions();
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.selectedPerson);
  const people = useSelector((state: RootState) => state.person.people);


  const addPersonToCanvasAndState = (person: Person, rela: TipoRelacion) => {
    const exists = people.find(p => p.id === person.id);

    if (!exists) {
      //v1
      //console.log(width, height);
      const newPosition = PositionUtils.calcularPosicion(person, rela, width);
      person.setPosition(newPosition.x, newPosition.y);

      const updatedPeople = [...people, person];

      // ✅ Detectar colisiones en la versión actualizada


      // ✅ Guarda en Redux*/
      dispatch(addPersonState(person));

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
  useEffect(() => {
    const colision = PositionUtils.detectarPrimeraColision(people);
    if (colision) {
      const [a, b] = colision.nodoA;
      const parent = a.relacion.getParents()[0];
      console.log("Colisión detectada entre:", a.getFirstName(), "y", b.getFirstName());
      if (parent) {
        const newPeople = PositionUtils.desplazarFamiliaAfectada(parent, -50);
        console.log(newPeople);
        // Check if anything actually changed
        const changed = newPeople.some((p, i) =>
          p.postionX !== people[i].postionX || p.postionY !== people[i].postionY
        );

       
      }
    }
  }, [people]);

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