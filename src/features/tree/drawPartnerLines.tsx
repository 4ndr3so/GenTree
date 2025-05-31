import { Line } from "react-konva";
import type { Person } from "../../Model/Person";


export function drawPartnerLines(people: Person[]) {
  const drawnPairs = new Set<string>();

  return people.flatMap((p) => {
    const partner = p.relacion.getCurrentPartner();
    if (!partner) return [];

    const key = [p.getId(), partner.getId()].sort().join("-");
    if (drawnPairs.has(key)) return [];

    drawnPairs.add(key);

    const posA = p.getPosition();
    const posB = partner.getPosition();

    // Calcular punto medio entre la pareja
    const midX = (posA.x + posB.x) / 2;
    const midY = (posA.y + posB.y) / 2;
    const middleY = midY + 50;

    return [
      // Línea vertical desde punto medio hacia abajo
      <Line
        key={`${key}-vertical`}
        points={[midX, midY, midX, middleY]}
        stroke="black"
        strokeWidth={2}
      />,
      // Línea horizontal entre pareja, a la altura y + 50
      <Line
        key={`${key}-horizontal`}
        points={[posA.x, posA.y, posB.x, posA.y]}
        stroke="black"
        strokeWidth={2}
      />,
    ];
  });
}
