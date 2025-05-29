import type { Person } from "./Person";


export class Relacion {
  private currentPartner: Person | null = null;
  private exPartners: Person[] = [];
  private children: Person[] = [];
  private owner: Person;

  constructor(owner: Person) {
    this.owner = owner;
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
      child.setParents(this.owner, otherParent);

      // Añadir al otro padre si no tiene el hijo
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

  // ✅ Obtener padres (de la persona actual)
  getParents(): (Person | null)[] {
    return this.owner.getParents();
  }

  // ✅ Obtener hermanos (mismo padre y madre)
  getSiblings(): Person[] {
    const [p1, p2] = this.owner.getParents();

    const fromP1 = p1?.relacion.getChildren() || [];
    const fromP2 = p2?.relacion.getChildren() || [];

    const all = [...fromP1, ...fromP2];
    const unique = Array.from(new Set(all));

    return unique.filter(s => s.id !== this.owner.id);
  }
}
