import { Person } from "../../../Model/Person";

export type TipoRelacion = "pareja" | "hijo" | "root" | "expareja" | "padre";

type Position = { x: number; y: number };



export class PositionUtils {

  static calcularPosicion(persona: Person, newRelation: TipoRelacion, canvasWidth = window.innerWidth, people: Person[]): Position {

    let tempPosition: Position = { x: 0, y: 0 };
    switch (newRelation) {
      case "root":
        tempPosition = this.posicionarRoot(persona, canvasWidth);
        break
      case "pareja":
        tempPosition = this.posicionarPareja(persona, people);

        break
      // return this.posicionarPareja(persona, persona.relacion.getAllPeople());
      case "hijo":
        tempPosition = this.posicionarHijo(persona, people);

        break
      case "expareja":
        tempPosition = this.posicionarExPareja(persona);

        break
      case "padre":
        tempPosition = this.posicionarPadre(persona);
        break;;
      default:

    }

    // this.detectarColision(people);

    return tempPosition
  }

  static detectarColision(people: Person[], persona: Person): void {
    const colision = PositionUtils.detectarPrimeraColision(people);
    if (colision) {
      const [a, b] = colision.nodoA;

      //busca parent
      let parent: Person | null;
      if (a.id === persona.id) {
        parent = a.relacion.getParents()[0];
      } else {
        parent = b.relacion.getParents()[0];
      }

      console.log("Colisión detectada entre:", a.getFirstName(), a.positionX, "y", b.getFirstName(), b.positionX);
      if (parent) {
        let newPeople: Person[];
        if (a.positionX < b.positionX) {
          newPeople = PositionUtils.desplazarFamiliaAfectada(parent, 0, 100);
        } else {
          newPeople = PositionUtils.desplazarFamiliaAfectada(parent, 0, 100);
        }

        // console.log(newPeople);
        // Check if anything actually changed
        const changed = newPeople.some((p, i) =>
          p.positionX !== people[i].positionX || p.positionY !== people[i].positionY
        );
      }
      //this.detectarColision(people, persona);
    }
  }

  static getRootAncestor(person: Person): Person {
    const [parent1, parent2] = person.relacion.getParents();
    if (parent1) return this.getRootAncestor(parent1);
    if (parent2) return this.getRootAncestor(parent2);
    return person;
  }


  ////////////////////////////////////////////////////////7
  static posicionarRoot(persona: Person, canvasWidth: number): Position {
    console.log("posicionarRoot:", persona.getFullName(), persona.positionX);
    const x = canvasWidth / 2;
    const y = 100;
    persona.setPosition(x, y);
    return { x, y };
  }

  static posicionarPareja(persona: Person, people: Person[]): Position {
    console.log("posicionarPareja:", persona.getFullName(), persona.positionX);
    const currentPartner = persona.relacion.getCurrentPartner();
    if (!currentPartner) {
      return { x: persona.positionX + 100, y: persona.positionY };
    }

    const refPos = currentPartner.getPosition();
    const siblings = currentPartner.relacion.getSiblings();
    const targetX = refPos.x + 100;
    const targetY = refPos.y;

    const collision = this.isPositionOccupiedBySibling(targetX, targetY, siblings);
    if (collision) {
      console.log("isPositionOccupiedBySibling:", persona.getPosition());

      // Ordenar por birthDate
      const ordered = [...siblings, currentPartner].sort((a, b) =>
        (a.birthDate || "").localeCompare(b.birthDate || "")
      );

      // Buscar el índice del currentPartner usando ID
      const referenceIndex = ordered.findIndex(p => p.id === currentPartner.id);

      const affected = ordered.slice(0, referenceIndex + 1);

      affected.forEach(p => {
        const pos = p.getPosition();
        p.setPosition(pos.x - 100, pos.y);
        this.shiftDescendants(p, -100, 0);
      });

      persona.setPosition(refPos.x, refPos.y);

      this.detectarColision(people, persona);
      return { x: refPos.x, y: refPos.y };
    }

    persona.setPosition(targetX, targetY);
    
    this.detectarColision(people, persona);

    return { x: targetX, y: targetY };
  }



  static posicionarHijo(persona: Person, people: Person[]): Position {
    console.log("posicionarHijo:", persona.getFullName(), persona.positionX);
    const [p1, p2] = persona.relacion.getParents();
    this.reorganizarHijosConRelaciones([p1, p2], persona);
    //this.detectarColision(people, persona);
    return persona.getPosition();
  }


  static posicionarExPareja(persona: Person): Position {
    const ex = persona.relacion.getExPartners()[0];
    if (!ex) return { x: persona.positionX - 100, y: persona.positionY };

    const x = ex.positionX + 500;
    const y = ex.positionY;
    persona.setPosition(x, y);
    return { x, y };
  }

  static posicionarPadre(persona: Person): Position {
    console.log("posicionarPadre:", persona.getFullName());
    const hijo = persona.relacion.getChildren()[0];
    if (!hijo?.getIsRoot()) return { x: persona.positionX, y: persona.positionY };

    const { x, y } = hijo.getPosition();
    const padreX = x - 50;
    const padreY = y - 100;
    persona.setPosition(padreX, padreY);
    return { x: padreX, y: padreY };
  }

  static isPositionOccupiedBySibling(x: number, y: number, siblings: Person[]): boolean {

    return siblings.some(sibling => {
      const pos = sibling.getPosition();
      return pos.x === x && pos.y === y;
    });
  }

  static shiftDescendants(person: Person, dx: number, dy: number): void {
    console.log("shiftDescendants: ", person.getFullName(), "dx:", dx, "dy:", dy);
    const pareja = person.relacion.getCurrentPartner();
    const children = person.relacion.getChildren();

    if (pareja) {
      const pos = pareja.getPosition();
      pareja.setPosition(pos.x + dx, pos.y + dy);
    }

    for (const child of children) {
      const pos = child.getPosition();
      child.setPosition(pos.x + dx, pos.y + dy);
      this.shiftDescendants(child, dx, dy);
    }
  }



  static posicionarEnArbolSecundario(reference: Person, allPeople: Person[]): Position {
    const { maxX } = this.getMainTreeWidth(allPeople);
    const refPos = reference.getPosition();
    const x = maxX + 200;
    const y = refPos.y - 100;
    return { x, y };
  }

  static getMainTreeWidth(people: Person[]): { minX: number; maxX: number; width: number } {
    const root = people.find(p => p.getIsRoot());
    if (!root) return { minX: 0, maxX: 0, width: 0 };

    const visited = new Set<string>();
    const queue: Person[] = [root];
    let minX = root.positionX;
    let maxX = root.positionX;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.getId())) continue;
      visited.add(current.getId());

      const { x } = current.getPosition();
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;

      const partner = current.relacion.getCurrentPartner();
      const children = current.relacion.getChildren();

      if (partner && !visited.has(partner.getId())) queue.push(partner);
      for (const child of children) {
        if (!visited.has(child.getId())) queue.push(child);
      }
    }

    return { minX, maxX, width: maxX - minX };
  }
  static desplazarFamiliaAfectada(person: Person, dx: number, dy: number): Person[] {
    function clonePerson(p: Person): Person {
      const clone = new Person(p.firstName, p.lastName, p.id);
      clone.positionX = p.positionX;
      clone.positionY = p.positionY;
      clone.relacion = p.relacion; // share or clone depending on design
      return clone;
    }
    let clone = clonePerson(person);
    
    const pareja = clone.relacion.getCurrentPartner() || new Person("No Partner", "No Partner", "No Partner");
    const hijos = clone.relacion.getChildren();

    // Desplazar persona base
    const pos = clone.getPosition();
    clone.setPosition(pos.x + dx, pos.y + dy);
    console.log("desplazarFamiliaAfectada", clone.getFullName(), clone.positionX, clone.positionY);
    // Desplazar pareja (mantener 200px)
    if (pareja) {
      const parejaPos = pareja.getPosition();
      const newX = clone.positionX + dx;
      const newY = clone.positionY + dy;
      pareja.setPosition(newX, newY);
    }

    // Desplazar descendientes con función recursiva existente
    this.shiftDescendants(clone, dx, dy);

    // Si pareja tiene hijos en común, desplazarlos también
    if (pareja) {
      this.shiftDescendants(pareja, dx, dy);
    }
    return [clone, pareja, ...hijos];
  }

  static getAncestroRaiz(person: Person): Person {
    let current = person;
    while (true) {
      const [p1, p2] = current.relacion.getParents();
      if (!p1 && !p2) break;
      current = p1 ?? p2 ?? current;
    }
    return current;
  }

  static reorganizarHijosConRelaciones(parents: [Person | null, Person | null], includeNew?: Person) {
    console.log("reorganizarHijosConRelaciones:", parents.map(p => p?.getFullName() + " " + p?.positionX).join(" y "));
    const [p1, p2] = parents;
    if (!p1 && !p2) return;

    const rawChildren = [
      ...(p1?.relacion.getChildren() ?? []),
      ...(p2?.relacion.getChildren() ?? []),
      ...(includeNew ? [includeNew] : []),
    ];

    const hijosUnicos = Array.from(new Map(rawChildren.map(p => [p.id, p])).values())
      .sort((a, b) => a.birthDate.localeCompare(b.birthDate));

    if (hijosUnicos.length === 0) return;

    const centroX = p1 && p2
      ? (p1.positionX + p2.positionX) / 2
      : (p1?.positionX || p2?.positionX || window.innerWidth / 2);

    const baseY = (p1?.positionY || p2?.positionY || 100) + 100;
    const spacing = 100;

    // Paso 1: construir la lista de "nodos visuales" (hijos + parejas)
    const nodosVisuales: Person[] = [];
    for (const hijo of hijosUnicos) {
      nodosVisuales.push(hijo);
      const pareja = hijo.relacion.getCurrentPartner();
      if (pareja) nodosVisuales.push(pareja);
    }

    // Paso 2: calcular inicio centrado
    const totalWidth = (nodosVisuales.length - 1) * spacing;
    const startX = centroX - totalWidth / 2;

    // Paso 3: asignar posiciones a todos
    nodosVisuales.forEach((node, index) => {
      const newX = startX + index * spacing;
      const oldX = node.positionX;
      const dx = newX - oldX;

      node.setPosition(newX, baseY);
      this.shiftDescendants(node, dx, 0);
    });
  }

  static desplazarFamiliaAfectadaPure(person: Person, dx: number, people: Person[]): Person[] {
    const updatedMap = new Map<string, Person>();
    console.log("desplazarFamiliaAfectadaPure :", person.getFullName());
    function clonePerson(p: Person): Person {
      if (updatedMap.has(p.id)) return updatedMap.get(p.id)!;
      const clone = new Person(p.firstName, p.lastName, p.id);
      clone.positionX = p.positionX;
      clone.positionY = p.positionY;
      clone.relacion = p.relacion; // still shared
      updatedMap.set(clone.id, clone);
      return clone;
    }

    function cloneAndShift(p: Person) {
      const c = clonePerson(p);
      c.setPosition(c.positionX + dx, c.positionY);
      return c;
    }

    // Clone and shift core nodes
    cloneAndShift(person);
    const pareja = person.relacion.getCurrentPartner();
    if (pareja) cloneAndShift(pareja);
    const hijos = person.relacion.getChildren();
    hijos.forEach(cloneAndShift);

    // Use pure descendant shifter
    this.shiftDescendantsPure(person, dx, 0, updatedMap);
    if (pareja) this.shiftDescendantsPure(pareja, dx, 0, updatedMap);

    // Replace updated nodes in the array
    const newPeople = people.map(p => updatedMap.get(p.id) || p);
    return newPeople;
  }


  static shiftDescendantsPure(person: Person, dx: number, dy: number, updatedMap: Map<string, Person>): void {
    const pareja = person.relacion.getCurrentPartner();
    const children = person.relacion.getChildren();

    if (pareja && updatedMap.has(pareja.id)) {
      const parejaClone = updatedMap.get(pareja.id)!;
      const pos = parejaClone.getPosition();
      parejaClone.setPosition(pos.x + dx, pos.y + dy);
    }

    for (const child of children) {
      if (updatedMap.has(child.id)) {
        const childClone = updatedMap.get(child.id)!;
        const pos = childClone.getPosition();
        childClone.setPosition(pos.x + dx, pos.y + dy);
        this.shiftDescendantsPure(childClone, dx, dy, updatedMap);
      }
    }
  }
  static detectarPrimeraColision(
    personas: Person[],
    tolerancia = 50
  ): { nodoA: [Person, Person] } | null {
    console.log("people=" + personas.length)
    for (let i = 0; i < personas.length; i++) {
      const a = personas[i];
      const posA = a.getPosition();

      for (let j = i + 1; j < personas.length; j++) {
        const b = personas[j];
        const posB = b.getPosition();
        //console.log(`Comparando ${posB.x} con ${posA.x}`);
        const dx = Math.abs(posA.x - posB.x);
        const dy = Math.abs(posA.y - posB.y);

        if (dx <= tolerancia && dy <= tolerancia) {
          return { nodoA: [a, b] };
        }
      }
    }

    return null; // No hay colisiones
  }
  private clonePerson(p: Person, updatedMap: Map<string, Person>): Person {
    if (updatedMap.has(p.id)) return updatedMap.get(p.id)!;

    const clone = new Person(p.firstName, p.lastName, p.id);
    clone.positionX = p.positionX;
    clone.positionY = p.positionY;
    clone.familyId = p.familyId;
    clone.gender = p.gender;
    updatedMap.set(clone.id, clone); // Prevent infinite recursion

    const rel = p.relacion;

    // Clone current partner
    const partner = rel.getCurrentPartner();
    if (partner) {
      const partnerClone = this.clonePerson(partner, updatedMap);
      clone.relacion.setPartner(partnerClone);
    }

    // Clone ex-partners
    for (const ex of rel.getExPartners()) {
      const exClone = this.clonePerson(ex, updatedMap);
      clone.relacion.setExPartner(exClone);
    }

    // Clone parents
    const [parent1, parent2] = rel.getParents();
    if (parent1 && parent2) {
      const p1Clone = this.clonePerson(parent1, updatedMap);
      const p2Clone = this.clonePerson(parent2, updatedMap);
      clone.relacion.setParents(p1Clone, p2Clone);
    } else if (parent1) {
      const p1Clone = this.clonePerson(parent1, updatedMap);
      clone.relacion.setParent(p1Clone);
    } else if (parent2) {
      const p2Clone = this.clonePerson(parent2, updatedMap);
      clone.relacion.setParent(p2Clone);
    }

    // Clone children
    for (const child of rel.getChildren()) {
      const childClone = this.clonePerson(child, updatedMap);
      const otherParent = clone.relacion.getCurrentPartner() ?? new Person("Temp", "Temp", "temp");
      clone.relacion.addChild(childClone, otherParent);
    }

    return clone;
  }


}
