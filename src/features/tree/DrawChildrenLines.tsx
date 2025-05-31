import React from "react";
import { Line } from "react-konva";
import type { Person } from "../../Model/Person";

export function DrawChildrenLines(people: Person[]): React.JSX.Element[] {
  const lines: React.JSX.Element[] = [];

  for (const parent of people) {
    const children = parent.relacion.getChildren();
    if (children.length === 0) continue;

    // Dibujar líneas verticales hacia arriba desde cada hijo
    const verticalLines: React.JSX.Element[] = [];
    const topPoints: number[] = [];

    children.forEach((child, index) => {
      const { x, y } = child.getPosition();
      const topY = y - 50;

      // Guardamos la x para la línea horizontal final
      topPoints.push(x);

      verticalLines.push(
        <Line
          key={`line-child-${child.getId()}-${parent.getId()}`}
          points={[x, y, x, topY]}
          stroke="black"
          strokeWidth={2}
        />
      );
    });

    lines.push(...verticalLines);

    // Ordenar las x para tomar el primer y último hijo
    const sortedX = topPoints.sort((a, b) => a - b);
    const firstX = sortedX[0];
    const lastX = sortedX[sortedX.length - 1];
    const topY = children[0].getPosition().y - 50;

    // Dibujar línea horizontal en la parte superior
    lines.push(
      <Line
        key={`line-h-top-${parent.getId()}`}
        points={[firstX, topY, lastX, topY]}
        stroke="black"
        strokeWidth={2}
      />
    );
  }

  return lines;
}