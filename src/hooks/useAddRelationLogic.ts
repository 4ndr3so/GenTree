import { useDispatch, useSelector } from 'react-redux';
import { Person } from '../Model/Person';
import { addPersonState } from '../store/personSlice';
import { useFamilyTree } from './useFamilyTree';
import type { RootState } from '../store';
import { deserializePeopleArray } from '../features/tree/UtilTree/deserializePeopleArray';


export function useAddRelationLogic() {
  const { people, addPersonToCanvasAndState } = useFamilyTree();
  const plainSelected = useSelector((state: RootState) => state.selectedPerson);
  const selected = people.find(p => p.id === plainSelected?.id);

  const createPerson = (firstName: string, lastName: string, birthDate: string): Person => {
    return new Person(firstName, lastName, crypto.randomUUID(), 'U', birthDate);
  };

  const handleAddRelation = (type: 'partner' | 'child' | 'sibling' | 'parent', data: { firstName: string; lastName: string; birthDate: string }) => {
    if (!selected) return;

    const newPerson = createPerson(data.firstName, data.lastName, data.birthDate);

    switch (type) {
      case 'partner': {
        selected.relacion.setPartner(newPerson);
        addPersonToCanvasAndState(newPerson, 'pareja');
        break;
      }

      case 'child': {
        // Verifica si el seleccionado tiene pareja
        let currentPartner = selected.relacion.getCurrentPartner();

        // Si no tiene pareja, crear una por defecto y asignarla
        if (!currentPartner) {
          currentPartner = createPerson('Partner', 'Default', '1970-01-01');
          selected.relacion.setPartner(currentPartner);
          addPersonToCanvasAndState(currentPartner, 'pareja');
        }

        // Crear el nuevo hijo
        selected.relacion.addChild(newPerson, currentPartner);
        addPersonToCanvasAndState(newPerson, 'hijo');
        break;
      }

      case 'sibling': {
        let [mother, father] = selected.relacion.getParents();

        // Si no hay padres, crear por defecto y asignarlos
        if (!mother || !father) {
          mother = createPerson('Mother', 'Default', '1970-01-01');
          father = createPerson('Father', 'Default', '1970-01-01');

          selected.relacion.setParents(mother, father);

          addPersonToCanvasAndState(mother, 'padre');
          addPersonToCanvasAndState(father, 'padre');
        }

        // Agregar el nuevo hijo (hermano) a los padres existentes
        father.relacion.addChild(newPerson, mother);
        addPersonToCanvasAndState(newPerson, 'hijo');

        break;
      }

      case 'parent': {
        const otherParent = createPerson('Parent', 'Default', '1970-01-01');

        newPerson.relacion.addChild(selected, otherParent);

        newPerson.relacion.setPartner(otherParent);
        selected.relacion.setParents(newPerson, otherParent);

        addPersonToCanvasAndState(newPerson, 'padre');
        addPersonToCanvasAndState(otherParent, 'pareja');
        break;
      }
    }
  };

  return { handleAddRelation };
}
