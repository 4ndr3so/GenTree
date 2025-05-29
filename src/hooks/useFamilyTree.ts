import { useState } from 'react';

import { PositionUtils } from '../features/tree/UtilTree/PositionUtils';
import type { Linea } from '../types/types';
import type { Person } from '../Model/Person';

export function useFamilyTree() {
  const [people, setPeople] = useState<Person[]>([]);

  const addPerson = (person: Person) => {
    setPeople(prev => {
      // Evitar duplicados por ID
      if (prev.find(p => p.id === person.id)) return prev;

      // Calcular posición solo si es nuevo
      PositionUtils.calcularPosicion(person);
      return [...prev, person];
    });
  };

  const resetTree = () => {
    setPeople([]);
  };

  return {
    people,
    addPerson,
    resetTree,
  };
}
