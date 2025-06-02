// utils/deserializePerson.ts

import { Person } from "../../../Model/Person";


export function deserializePerson(data: any, existingMap = new Map<string, Person>()): Person {
  // Evitar duplicados por ID
  if (existingMap.has(data.id)) return existingMap.get(data.id)!;

  const person = new Person(data.name, data.id);
  person.setPosition(data.postionX, data.postionY);
  person.setIsRoot(data.isRoot);
  existingMap.set(data.id, person);

  // Pareja actual
  if (data.relacion?.currentPartner) {
    const partner = deserializePerson(data.relacion.currentPartner, existingMap);
    person.relacion.setPartner(partner);
  }

  // Ex-parejas
  if (Array.isArray(data.relacion?.exPartners)) {
    for (const ex of data.relacion.exPartners) {
      const exPerson = deserializePerson(ex, existingMap);
      person.relacion.setExPartner(exPerson);
    }
  }

  // Hijos
  if (Array.isArray(data.relacion?.children)) {
    for (const child of data.relacion.children) {
      if (!child) continue;
      const childPerson = deserializePerson(child, existingMap);
      const otherParent = person.relacion.getCurrentPartner() ?? person;
      person.relacion.addChild(childPerson, otherParent);
    }
  }

  // Padres (si están incluidos)
  if (Array.isArray(data.relacion?.parents)) {
    const [p1, p2] = data.relacion.parents;
    if (p1) person.relacion.setParent(deserializePerson(p1, existingMap));
    if (p2) person.relacion.setParent(deserializePerson(p2, existingMap));
  }

  return person;
}
