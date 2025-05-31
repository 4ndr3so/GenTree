

import { Relacion } from './Relacion';

export class Person {
  postionX: number= 0;
  postionY: number= 0;
  name: string;
  id: string;
  relacion: Relacion;
  isRoot: boolean = false;

  constructor( name: string, id: string) {

    this.name = name;
    this.id = id;

    this.relacion = new Relacion(this);
  }
  setPosition(x: number, y: number) {
    this.postionX = x;
    this.postionY = y;
  }
  setIsRoot(isRoot: boolean) {
    this.isRoot = isRoot;
  }
  getIsRoot() {
    return this.isRoot;
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
