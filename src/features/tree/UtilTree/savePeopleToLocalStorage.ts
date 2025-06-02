import type { Person } from "../../../Model/Person";
import { serializePeople } from "./serializePeople";

export function savePeopleToLocalStorage(people: Person[]) {
  const plainData = serializePeople(people);
  localStorage.setItem("familyTree", JSON.stringify(plainData));
}