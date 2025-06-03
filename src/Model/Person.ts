

import { Relacion } from './Relacion';

export class Person {
  postionX: number= 0;
  postionY: number= 0;
  name: string;
  id: string;
  relacion: Relacion;
  isRoot: boolean = false;
  age: number = 10;

  constructor( name: string, id: string, age: number=10) {

    this.name = name;
    this.id = id;
    this.age = age;

    this.relacion = new Relacion(this);
  }
  setPosition(x: number, y: number) {
    this.postionX = x;
    this.postionY = y;
  }
  setAge(age: number) {
    this.age = age; 
  }

  getAge() {
    return this.age;
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
  
  toPlainObject(): any {
  return {
    id: this.id,
    name: this.name,
    postionX: this.postionX,
    postionY: this.postionY,
    isRoot: this.getIsRoot(),
    age: this.age,
    relacion: {
      currentPartner: this.relacion.getCurrentPartner()?.id ?? null,
      exPartners: this.relacion.getExPartners().map(p => p.id),
      children: this.relacion.getChildren().map(p => p.id),
      parents: this.relacion.getParents().map(p => p?.id ?? null)
    }
  };
}
}
