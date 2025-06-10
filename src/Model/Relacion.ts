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

    // Heredar familyId de los padres si tienen el mismo
    if (p1.familyId === p2.familyId) {
      this.owner.familyId = p1.familyId;
    }
  }

  setParent(p: Person) {
    const personPadTemp = new Person("temp", "temp", "temp");

    if (!this.parents[0]) {
      this.parents[0] = p;
      p.relacion.addChild(this.owner, personPadTemp);
      return;
    }
  }

  setPartner(newPartner: Person) {
    // Crear o compartir familyId
    if (!this.owner.familyId && !newPartner.familyId) {
      const sharedFamilyId = `@F_${this.owner.id}_${newPartner.id}@`;
      this.owner.familyId = sharedFamilyId;
      newPartner.familyId = sharedFamilyId;
    } else if (this.owner.familyId && !newPartner.familyId) {
      newPartner.familyId = this.owner.familyId;
    } else if (!this.owner.familyId && newPartner.familyId) {
      this.owner.familyId = newPartner.familyId;
    }

    // Manejar cambio de pareja
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

      // Asignar el mismo familyId de los padres
      if (this.owner.familyId === otherParent.familyId) {
        child.familyId = this.owner.familyId;
      } else {
        // Si los padres no tienen el mismo familyId, crear uno nuevo compartido
        const sharedFamilyId = `@F_${this.owner.id}_${otherParent.id}@`;
        this.owner.familyId = sharedFamilyId;
        otherParent.familyId = sharedFamilyId;
        child.familyId = sharedFamilyId;
      }

      // Asegurar bidireccionalidad del hijo con el otro padre
      if (!otherParent.relacion.children.includes(child)) {
        otherParent.relacion.children.push(child);
      }
    }
  }

  getChildren(): Person[] {
    return this.children;
  }

  getCurrentPartner(): Person | null {
    return this.currentPartner;
  }


  getExPartners(): Person[] {
    return this.exPartners;
  }

  setExPartner(ex: Person) {
    if (!this.exPartners.find(p => p.id === ex.id)) {
      this.exPartners.push(ex);
      if (!ex.relacion.getExPartners().some(p => p.id === this.owner.id)) {
        ex.relacion.setExPartner(this.owner);
      }
    }
  }

  getParents(): [Person | null, Person | null] {
    return this.parents;
  }

  getSiblings(): Person[] {
    const [p1, p2] = this.parents;
    const fromP1 = p1?.relacion.getChildren() || [];
    const fromP2 = p2?.relacion.getChildren() || [];

    const all = [...fromP1, ...fromP2];
    const unique = Array.from(new Set(all));
    return unique.filter(s => s.id !== this.owner.id);
  }

  getFamilyGEDCOM(): any | null {
    if (!this.getCurrentPartner() || this.getChildren().length === 0) return null;

    const husb = this.owner.gender === 'M' ? this.owner : this.getCurrentPartner();
    const wife = this.owner.gender === 'F' ? this.owner : this.getCurrentPartner();

    return {
      id: this.owner.familyId,
      husb: husb?.gedcomId ?? null,
      wife: wife?.gedcomId ?? null,
      children: this.children.map(c => c.gedcomId)
    };
  }
  getAllConnections(): Person[] {
    const visited = new Set<string>();
    const queue: Person[] = [this.owner];
    const allPeople: Person[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.id)) continue;

      visited.add(current.id);
      allPeople.push(current);

      const { relacion } = current;

      // 💑 Pareja
      const partner = relacion.getCurrentPartner();
      if (partner && !visited.has(partner.id)) queue.push(partner);

      // 👶 Hijos
      for (const child of relacion.getChildren()) {
        if (!visited.has(child.id)) queue.push(child);
      }

      // 👴 Padres
      for (const parent of relacion.getParents()) {
        if (parent && !visited.has(parent.id)) queue.push(parent);
      }

      // 💔 Ex-parejas (si quieres mostrar)
      for (const ex of relacion.getExPartners()) {
        if (!visited.has(ex.id)) queue.push(ex);
      }
    }

    return allPeople;
  }

}
