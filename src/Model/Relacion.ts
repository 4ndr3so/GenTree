import { Person } from "./Person";

export class Relacion {
  private currentPartner: Person | null = null;
  private exPartners: Person[] = [];
  private children: Person[] = [];
  private owner: Person;
  private parents: [Person | null, Person | null] = [null, null];

  constructor(owner: Person) {
    this.owner = owner;
  }

  setParents(p1: Person, p2: Person) {
    this.parents = [p1, p2];
  }
  
  setParent(p: Person) {
    const personPadTemp= new Person("temp", "temp");

  if (!this.parents[0]) {
    this.parents[0] = p;
       //simpre agrega solo un padre
      p.relacion.addChild(this.owner, personPadTemp); // pasar el otro padre si existe
    
    return;
  }


}

  setPartner(newPartner: Person) {
    if (this.currentPartner && this.currentPartner.id !== newPartner.id) {
      this.exPartners.push(this.currentPartner);
    }
    this.currentPartner = newPartner;

    // Bidireccionalidad
    if (newPartner.relacion.getCurrentPartner()?.id !== this.owner.id) {
      newPartner.relacion.setPartner(this.owner);
    }
  }

  addChild(child: Person, otherParent: Person) {
    if (!this.children.includes(child)) {
      this.children.push(child);
      child.relacion.setParents(this.owner, otherParent);

      if (!otherParent.relacion.children.includes(child)) {
        otherParent.relacion.children.push(child);
      }
    }
  }

  // ✅ Obtener hijos
  getChildren(): Person[] {
    return this.children;
  }

  // ✅ Obtener pareja actual
  getCurrentPartner(): Person | null {
    return this.currentPartner;
  }


  // ✅ Obtener ex-parejas
  getExPartners(): Person[] {
    return this.exPartners;
  }
  setExPartner(ex: Person) {
    if (!this.exPartners.find(p => p.id === ex.id)) {
      this.exPartners.push(ex);

      // Asegurar bidireccionalidad (opcional)
      if (!ex.relacion.getExPartners().some(p => p.id === this.owner.id)) {
        ex.relacion.setExPartner(this.owner);
      }
    }
  }

  // ✅ Obtener padres
  getParents(): [Person | null, Person | null] {
    return this.parents;
  }

  // ✅ Obtener hermanos
  getSiblings(): Person[] {
    const [p1, p2] = this.parents;

    const fromP1 = p1?.relacion.getChildren() || [];
    const fromP2 = p2?.relacion.getChildren() || [];

    const all = [...fromP1, ...fromP2];
    const unique = Array.from(new Set(all));

    return unique.filter(s => s.id !== this.owner.id);
  }
}
