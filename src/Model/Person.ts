

import { Relacion } from './Relacion';

export class Person {
  postionX: number;
  postionY: number;
  name: string;
  id: string;
  relacion: Relacion;
  private parents: [Person | null, Person | null];

  constructor(x: number, y: number, name: string, id: string) {
   this.postionX = -1;
    this.postionY = -1;
    this.name = name;
    this.id = id;
    this.parents = [null, null];
    this.relacion = new Relacion(this);
  }

  setParents(p1: Person, p2: Person) {
    this.parents = [p1, p2];
  }

  getParents(): [Person | null, Person | null] {
    return this.parents;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getPosition() {
    return { x: this.postionX, y: this.postionY };
  }

  getRelation() {
    return {
      currentPartner: this.relacion.getCurrentPartner(),
      exPartners: this.relacion.getExPartners(),
      children: this.relacion.getChildren(),
      parents: this.relacion.getParents(),
      siblings: this.relacion.getSiblings(),
    };
  }
}
