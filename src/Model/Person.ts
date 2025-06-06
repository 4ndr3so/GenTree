

import { Relacion } from './Relacion';

export class Person {
  postionX: number = 0;
  postionY: number = 0;
  id: string;
  gedcomId: string;
  familyId: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'U' = 'U';
  birthDate: string;
  relacion: Relacion;
  isRoot: boolean = false;

  constructor(firstName: string, lastName: string, id: string, gender: 'M' | 'F' | 'U' = 'U', birthDate: string = "2000-01-01") {
    this.firstName = firstName;
    this.lastName = lastName;
    
    this.id = id;
    this.gedcomId = `@I${id}@`;
    this.familyId = `@F${id}@`;
    this.gender = gender;
    this.birthDate = birthDate;
    this.relacion = new Relacion(this);
  }

  setBirthDate(date: string) {
    this.birthDate = date;
  }

  getBirthDate(): string {
    return this.birthDate;
  }

  toPlainObject(): any {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      postionX: this.postionX,
      postionY: this.postionY,
      id: this.id,
      gedcomId: this.gedcomId,
      familyId: this.familyId,
      isRoot: this.getIsRoot(),
      gender: this.gender,
      birthDate: this.birthDate,
      relacion: {
        currentPartner: this.relacion.getCurrentPartner()?.id ?? null,
        exPartners: this.relacion.getExPartners().map(p => p.id),
        children: this.relacion.getChildren().map(p => p.id),
        parents: this.relacion.getParents().map(p => p?.id ?? null)
      }
    };
  }

  toGEDCOMIndividual(): any {
    return {
      id: this.gedcomId,
      name: `${this.firstName} /${this.lastName}/`,
      gender: this.gender,
      birth: this.birthDate,
      famc: this.relacion.getParents().some(p => p !== null) ? this.familyId : null,
      fams: this.relacion.getCurrentPartner() ? [this.familyId] : [],
    };
  }

  setPosition(x: number, y: number) {
    this.postionX = x;
    this.postionY = y;
  }

  setIsRoot(isRoot: boolean) {
    this.isRoot = isRoot;
  }

  getFirstName() {
    return this.firstName;
  }
  getGender() {
    return this.gender;
  }


  getLastName() {
    return this.lastName;
  }

  getIsRoot() {
    return this.isRoot;
  }

  getId() {
    return this.id;
  }

  getGedcomId() {
    return this.gedcomId;
  }

  getFamilyId() {
    return this.familyId;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
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
