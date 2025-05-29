import type { Person } from "../../../Model/Person";

export class PositionUtils {
  static calcularPosicion(persona: Person): { x: number; y: number } {
    const relation = persona.getRelation();
    const { currentPartner, children, parents } = relation;

    // 1️⃣ PAREJA ACTUAL
    if (currentPartner) {
      persona.postionX = currentPartner.postionX + 100;
      persona.postionY = currentPartner.postionY;
      return { x: persona.postionX, y: persona.postionY };
    }

    // 2️⃣ HIJO/A
    const [padre, madre] = parents;

    if (padre || madre) {
      const centroX = padre && madre
        ? (padre.postionX + madre.postionX) / 2
        : (padre?.postionX ?? madre?.postionX ?? 100);

      const baseY = (Math.max(
        padre?.postionY ?? 0,
        madre?.postionY ?? 0
      )) + 100;

      // Obtener hermanos (comunes entre padre y madre)
      const hermanos = (padre?.relacion.getChildren() || []).filter(
        h =>
          (!madre || madre.relacion.getChildren().includes(h)) &&
          h.id !== persona.id
      );

      // Incluir al nuevo hijo para que se reposicionen todos
      hermanos.push(persona);

      const offset = Math.floor(hermanos.length / 2);
      for (let i = 0; i < hermanos.length; i++) {
        let x = centroX + (i - offset) * 100;
        if (hermanos.length % 2 === 0) x += 50;

        hermanos[i].postionX = x;
        hermanos[i].postionY = baseY;
      }

      return { x: persona.postionX, y: persona.postionY };
    }

    // 3️⃣ Posición fija si no tiene relaciones (no es root, pero tampoco tiene padres/pareja aún)
    persona.postionX = persona.postionX !== -1 ? persona.postionX : 100;
    persona.postionY = persona.postionY !== -1 ? persona.postionY : 100;

    return { x: persona.postionX, y: persona.postionY };
  }
}

