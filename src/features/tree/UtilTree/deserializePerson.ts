// utils/deserializePerson.ts

import { Person } from "../../../Model/Person";

export function deserializePerson(data: any, existingMap = new Map<string, Person>()): Person {
  if (existingMap.has(data.id)) return existingMap.get(data.id)!;

  // Crear persona
  const person = new Person(
    data.firstName ?? '',
    data.lastName ?? '',
    data.id,
    data.gender ?? 'U',
    data.birthDate ?? '2000-01-01'
  );

  person.setPosition(data.postionX, data.postionY);
  person.setIsRoot(data.isRoot ?? false);

  if (data.familyId) person.familyId = data.familyId;
  if (data.gedcomId) person.gedcomId = data.gedcomId;

  existingMap.set(data.id, person);

  return person;
}
