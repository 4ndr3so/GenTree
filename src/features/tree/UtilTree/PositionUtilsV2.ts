
import type { Person } from "../../../Model/Person";

import { TreeLayoutUtils } from "../treeNode/TreeLayoutUtils";

type TipoRelacion = "pareja" | "hijo" | "root" | "expareja" | "padre";

type Position = { x: number; y: number };

export class PositionUtilsV2 {
  static getRootAncestor(person: Person): Person {
    const [p1, p2] = person.relacion.getParents();
    if (p1) return this.getRootAncestor(p1);
    if (p2) return this.getRootAncestor(p2);
    return person;
  }

  static posicionarRoot(persona: Person, canvasWidth: number): Position {
    return { x: canvasWidth / 2, y: 100 };
  }

  static calcularPosicion(
    persona: Person,
    newRelation: TipoRelacion,
    canvasWidth = window.innerWidth,
    allPeople: Person[] = []
  ): Position {
    switch (newRelation) {
      case "root":
        return this.posicionarRoot(persona, canvasWidth);

      case "hijo":
      case "pareja":
      case "expareja":
      case "padre": {
        // 1. Encontrar el ancestro más alto
        const root = this.getRootAncestor(persona);

        // 2. Aplicar Walker layout a todo el árbol
        TreeLayoutUtils.layoutFromRoot(root);

        // 3. La persona ya fue posicionada durante el layout
        return persona.getPosition();
      }

      default:
        return { x: canvasWidth / 2, y: 100 };
    }
  }
}
