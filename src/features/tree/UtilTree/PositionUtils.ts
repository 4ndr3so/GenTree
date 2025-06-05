import { Person } from "../../../Model/Person";

export type TipoRelacion = "pareja" | "hijo" | "root" | "expareja" | "padre";
type Position = { x: number; y: number };

export class PositionUtils {
  static calcularPosicion(
    persona: Person,
    newRelation: TipoRelacion
  ): { x: number; y: number } {
    //console.log("Calculando posición para:", persona.getFullName());
    const { currentPartner, parents, siblings, exPartners } = persona.getRelation();

    //get todas las personas que pueden influir en la posición
    const relations = persona.getRelation();

    const temp: Person[] = [
      ...(relations.currentPartner ? [relations.currentPartner] : []),
      ...relations.exPartners,
      ...relations.children,
      ...relations.parents.filter((p): p is Person => p !== null),
      ...relations.siblings,
    ];

    // crea una person temporal para evitar modificar la original
    // y para poder calcular la posición sin afectar el estado actual
    const persTempPos = new Person(persona.getFirstName(), persona.getLastName(),  persona.getId(),persona.getGender(),persona.getBirthDate());
    persTempPos.setPosition(persona.postionX, persona.postionY);
    const canvasWidth: number = window.innerWidth;
    let x = 0;
    let y = 0;
    //console.log("Relaciones:", persona);
    // 1️⃣ Nodo raíz — sin padres ni pareja
    if (persTempPos.getIsRoot()) {

      persTempPos.postionX = canvasWidth / 2;
      persTempPos.postionY = 100;

      return { x: persTempPos.postionX, y: persTempPos.postionY };

    }

    // 2️⃣ Pareja actual — a la derecha del actual
    if (newRelation === "pareja" && currentPartner) {
      persTempPos.postionX = currentPartner.postionX + 100;
      persTempPos.postionY = currentPartner.postionY;
      this.tryPlacePartner(currentPartner, persona);
      return { x: persTempPos.postionX, y: persTempPos.postionY };
    }

    // 3️⃣ Hijo — debe tener al menos un padre
    const [p1, p2] = parents;

    if (newRelation === "hijo" && (p1 || p2)) {
      const centroX = p1 && p2
        ? (p1.postionX + p2.postionX) / 2
        : (p1?.postionX || p2?.postionX || canvasWidth / 2);

      const baseY = (p1?.postionY || p2?.postionY || 100) + 100;
     // console.log(baseY, p1?.getName(), p1?.postionY, p2?.getName(), p2?.postionY);
      // Agrupar hermanos reales (incluyendo el actual)
      const hermanos = (p1?.relacion.getChildren() || [])
        .filter(h => (p2 ? p2.relacion.getChildren().includes(h) : true));

      // Evitar duplicados
      const uniqueHermanos = Array.from(new Set([...hermanos, persona]));

      // Ordenar por ID para consistencia (puedes cambiar esto)
      uniqueHermanos.sort((a, b) => a.id.localeCompare(b.id));

      const offset = Math.floor(uniqueHermanos.length / 2);

      for (let i = 0; i < uniqueHermanos.length; i++) {
        let x = centroX + (i - offset) * 100;
        if (uniqueHermanos.length % 2 === 0) x += 50;

        uniqueHermanos[i].postionX = x;
        uniqueHermanos[i].postionY = baseY;
      }
      return { x: persona.postionX, y: persona.postionY };
    }
    // 3️⃣ Ex-pareja — a la izquierda de la actual
    if (newRelation === "expareja" && exPartners.length > 0) {
      const baseX = exPartners[0].postionX;
      const baseY = exPartners[0].postionY;



      // Posicionar la nueva pareja (persona actual) al final de la secuencia
      persona.postionX = baseX + 500;
      persona.postionY = baseY;

      return { x: persona.postionX, y: persona.postionY };
    }

    if (newRelation === "padre") {
      const p1 = persona.relacion.getChildren()[0];
     
      // Solo se puede agregar padre si no tiene, y si es root
      if (p1.getIsRoot()) {
        // Convertir al nuevo padre en root
        //no se puede cambiar root, se recalcula la posición
       // p1.setIsRoot(false);
       // persona.setIsRoot(true);

        // Posicionarlo 50px a la izquierda y 100px arriba
        const { x, y } = p1.getPosition();
       
        
        persTempPos.postionX = x - 50;
        persTempPos.postionY = y - 100;
        
        return { x: persTempPos.postionX, y: persTempPos.postionY };
      }
    }

    // 4️⃣ Fallback
    console.log("No se pudo calcular la posición para la relación:", persona.getFullName());
    persona.postionX = canvasWidth / 2;
    persona.postionY = 100;
    return { x: persona.postionX, y: persona.postionY };
  }

  //expareja 
  static isPositionOccupiedBySibling(x: number, y: number, siblings: Person[]): boolean {
    return siblings.some(sibling => {
      const pos = sibling.getPosition();
      return pos.x === x && pos.y === y;
    });
  }
  static tryPlacePartner(reference: Person, newPartner: Person): void {
    const refPos = reference.getPosition();
    const siblings = reference.relacion.getSiblings();
    const targetX = refPos.x + 100;
    const targetY = refPos.y;

    const collision = this.isPositionOccupiedBySibling(targetX, targetY, siblings);

    if (collision) {
      // Ordenar hermanos por ID (menor ID = mayor)
      const ordered = [...siblings, reference].sort((a, b) => a.id.localeCompare(b.id));

      // Obtener índice de referencia
      const referenceIndex = ordered.findIndex(p => p.getId() === reference.getId());

      // Obtener referencia y hermanos mayores (a la izquierda en orden)
      const affected = ordered.slice(0, referenceIndex + 1); // incluye reference

      // Mover hacia la izquierda
      affected.forEach(p => {
        const pos = p.getPosition();
        p.setPosition(pos.x - 100, pos.y);

        // También mover pareja e hijos (recursivamente)
        this.shiftDescendants(p, -100);
      });

      // Colocar pareja en la posición original de reference
      newPartner.setPosition(refPos.x, refPos.y);
    } else {
      // No hay colisión, colocar normalmente a la derecha
      newPartner.setPosition(targetX, targetY);
    }
  }


  static shiftDescendants(person: Person, dx: number): void {
    const pareja = person.relacion.getCurrentPartner();
    const children = person.relacion.getChildren();

    // Mover pareja si existe
    if (pareja) {
      const pos = pareja.getPosition();
      pareja.setPosition(pos.x + dx, pos.y);
    }

    // Mover hijos y sus descendientes recursivamente
    for (const child of children) {
      const pos = child.getPosition();
      child.setPosition(pos.x + dx, pos.y);
      this.shiftDescendants(child, dx); // recursividad para nietos, bisnietos, etc.
    }
  }

  static posicionarEnArbolSecundario(
    reference: Person,
    allPeople: Person[]
  ): { x: number; y: number } {
    const { maxX, width } = this.getMainTreeWidth(allPeople);

    // Posicionar el nuevo nodo fuera del árbol principal
    const referencePos = reference.getPosition();
    const x = maxX + 200;         // +200 px desde el final del árbol
    const y = referencePos.y - 100; // 100 px encima de la persona a la que se está uniendo

    return { x, y };
  }

  static getMainTreeWidth(people: Person[]): { minX: number; maxX: number; width: number } {
    // Encuentra el root
    const root = people.find(p => p.getIsRoot());
    if (!root) return { minX: 0, maxX: 0, width: 0 };

    // Busca todos los descendientes desde el root
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

      // Encolar pareja e hijos
      const partner = current.relacion.getCurrentPartner();
      const children = current.relacion.getChildren();

      if (partner && !visited.has(partner.getId())) {
        queue.push(partner);
      }

      for (const child of children) {
        if (!visited.has(child.getId())) {
          queue.push(child);
        }
      }
    }

    return { minX, maxX, width: maxX - minX };
  }

}
