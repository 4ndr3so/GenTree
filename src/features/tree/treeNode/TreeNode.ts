import type { Person } from "../../../Model/Person";

export class TreeNode {
  person: Person;
  children: TreeNode[] = [];
  x: number = 0;
  y: number = 0;
  mod: number = 0;

  constructor(person: Person) {
    this.person = person;
  }
}
