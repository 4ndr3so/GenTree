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
       // const newPartner = createPerson('Firstname', 'Lastname', '2000-01-01');
      //  selected.relacion.setPartner(newPartner);
       // addPersonToCanvasAndState(newPartner, 'pareja');
       const currentPartner = selected.relacion.getCurrentPartner() || createPerson('Partner', 'Default', '1970-01-01');
      
        selected.relacion.addChild(newPerson, currentPartner);
        addPersonToCanvasAndState(newPerson, 'hijo');
        break;
      }

      case 'sibling': {
        const mother = createPerson('Mother', 'Default', '1970-01-01');
        const father = createPerson('Father', 'Default', '1970-01-01');

        selected.relacion.setParents(mother, father);
        father.relacion.addChild(newPerson, mother);

        addPersonToCanvasAndState(mother, 'padre');
        addPersonToCanvasAndState(father, 'padre');
        addPersonToCanvasAndState(newPerson, 'hijo');
        break;
      }

      case 'parent': {
        const otherParent = createPerson('Parent', 'Default', '1970-01-01');

        newPerson.relacion.addChild(selected, otherParent);
        selected.relacion.setParents(newPerson, otherParent);

        addPersonToCanvasAndState(newPerson, 'padre');
        addPersonToCanvasAndState(otherParent, 'padre');
        break;
      }
    }
  };

  return { handleAddRelation };
}
