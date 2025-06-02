import { useState } from 'react';
import { PositionUtils, type TipoRelacion } from "../features/tree/UtilTree/PositionUtils";
import type { Person } from "../Model/Person";
import { savePeopleToLocalStorage } from '../features/tree/UtilTree/savePeopleToLocalStorage';

import { deserializePeopleArray } from '../features/tree/UtilTree/deserializePeopleArray';


export function useFamilyTree() {
  const [people, setPeople] = useState<Person[]>([]);

  const addPerson = (person: Person, rela: TipoRelacion) => {
    setPeople(prev => {
      if (prev.find(p => p.id === person.id)) return prev;
      const newPosition = PositionUtils.calcularPosicion(person, rela);
      person.setPosition(newPosition.x, newPosition.y);
      const updated = [...prev, person];
      savePeopleToLocalStorage(updated);
      return updated;
    });
  };

  const addTreeSaved = (peopleSaved: Person[]) => {
    setPeople(peopleSaved);
  };

 const loadSavedTree = () => {
  const raw = localStorage.getItem("familyTree");
  const parsed = JSON.parse(raw!);
  const people = deserializePeopleArray(parsed);
  setPeople(people);
  };


  const resetTree = () => {
    setPeople([]);
  };

  return {
    people,
    addPerson,
    resetTree,
    addTreeSaved,
    loadSavedTree
  };
}
