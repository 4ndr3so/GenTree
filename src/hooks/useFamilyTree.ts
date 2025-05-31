import { useState } from 'react';
import { PositionUtils, type TipoRelacion } from "../features/tree/UtilTree/PositionUtils";
import type { Person } from "../Model/Person";


export function useFamilyTree() {
  const [people, setPeople] = useState<Person[]>([]);

  const addPerson = (person: Person, rela: TipoRelacion) => {
    setPeople(prev => {
      // Verifica si ya existe la persona
      if (prev.find(p => p.id === person.id)) return prev;

      // Calcular la posición según la relación
      const newPosition = PositionUtils.calcularPosicion(person, rela);
      person.setPosition(newPosition.x, newPosition.y);

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
