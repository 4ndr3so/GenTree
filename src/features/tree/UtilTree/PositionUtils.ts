import { Person } from "../../../Model/Person";

export type TipoRelacion = "pareja" | "hijo" | "root" | "expareja" | "padre";

type Position = { x: number; y: number };



export class PositionUtils {
  static calcularPosicion(persona: Person, newRelation: TipoRelacion): Position {
    switch (newRelation) {
      case "root":
        return this.posicionarRoot(persona);
      case "pareja":
        return this.posicionarPareja(persona);
      case "hijo":

        return this.posicionarHijo(persona);
      case "expareja":
        return this.posicionarExPareja(persona);
      case "padre":
        return this.posicionarPadre(persona);
      default:
        return { x: window.innerWidth / 2, y: 100 };
    }
  }

  static posicionarRoot(persona: Person): Position {
    const x = window.innerWidth / 2;
    const y = 100;
    persona.setPosition(x, y);
    return { x, y };
  }

  static posicionarPareja(persona: Person): Position {
    const currentPartner = persona.relacion.getCurrentPartner();
    if (!currentPartner) return { x: persona.postionX + 100, y: persona.postionY };

    const refPos = currentPartner.getPosition();
    const siblings = currentPartner.relacion.getSiblings();
    const targetX = refPos.x + 100;
    const targetY = refPos.y;

    const collision = this.isPositionOccupiedBySibling(targetX, targetY, siblings);
    if (collision) {
      const ordered = [...siblings, currentPartner].sort((a, b) => a.id.localeCompare(b.id));
      const referenceIndex = ordered.findIndex(p => p.getId() === currentPartner.getId());
      const affected = ordered.slice(0, referenceIndex + 1);

      affected.forEach(p => {
        const pos = p.getPosition();
        p.setPosition(pos.x - 100, pos.y);
        this.shiftDescendants(p, -100);
      });

      persona.setPosition(refPos.x, refPos.y);
      return { x: refPos.x, y: refPos.y };
    }

    persona.setPosition(targetX, targetY);
    return { x: targetX, y: targetY };
  }

  static posicionarHijo(persona: Person): Position {
    const [p1, p2] = persona.relacion.getParents();
    this.reorganizarHijosConRelaciones([p1, p2], persona);
    return persona.getPosition();
  }


  static posicionarExPareja(persona: Person): Position {
    const ex = persona.relacion.getExPartners()[0];
    if (!ex) return { x: persona.postionX - 100, y: persona.postionY };

    const x = ex.postionX + 500;
    const y = ex.postionY;
    persona.setPosition(x, y);
    return { x, y };
  }

  static posicionarPadre(persona: Person): Position {
    const hijo = persona.relacion.getChildren()[0];
    if (!hijo?.getIsRoot()) return { x: persona.postionX, y: persona.postionY };

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

  static shiftDescendants(person: Person, dx: number): void {
    const pareja = person.relacion.getCurrentPartner();
    const children = person.relacion.getChildren();

    if (pareja) {
      const pos = pareja.getPosition();
      pareja.setPosition(pos.x + dx, pos.y);
    }

    for (const child of children) {
      const pos = child.getPosition();
      child.setPosition(pos.x + dx, pos.y);
      this.shiftDescendants(child, dx);
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
    let minX = root.postionX;
    let maxX = root.postionX;

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
  static desplazarFamiliaAfectada(person: Person, dx: number): void {
    const pareja = person.relacion.getCurrentPartner();
    const hijos = person.relacion.getChildren();

    // Desplazar persona base
    const pos = person.getPosition();
    person.setPosition(pos.x + dx, pos.y);

    // Desplazar pareja (mantener 200px)
    if (pareja) {
      const parejaPos = pareja.getPosition();
      const newX = person.postionX + 200;
      pareja.setPosition(newX, parejaPos.y);
    }

    // Desplazar descendientes con función recursiva existente
    this.shiftDescendants(person, dx);

    // Si pareja tiene hijos en común, desplazarlos también
    if (pareja) {
      this.shiftDescendants(pareja, dx);
    }
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
  const [p1, p2] = parents;
  if (!p1 && !p2) return;

  const rawChildren = [
    ...(p1?.relacion.getChildren() ?? []),
    ...(p2?.relacion.getChildren() ?? []),
    ...(includeNew ? [includeNew] : []),
  ];

  const hijosUnicos = Array.from(new Map(rawChildren.map(p => [p.id, p])).values())
    .sort((a, b) => a.id.localeCompare(b.id));

  if (hijosUnicos.length === 0) return;

  const centroX = p1 && p2
    ? (p1.postionX + p2.postionX) / 2
    : (p1?.postionX || p2?.postionX || window.innerWidth / 2);

  const baseY = (p1?.postionY || p2?.postionY || 100) + 100;
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
    const oldX = node.postionX;
    const dx = newX - oldX;

    node.setPosition(newX, baseY);
    this.shiftDescendants(node, dx);
  });
}


}
