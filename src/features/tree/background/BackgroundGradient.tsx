import { Rect } from "react-konva";
import type { Person } from "../../../Model/Person";
import { PositionUtils } from "../UtilTree/PositionUtils";

export const BackgroundGradient = ({ people, canvasWidth, canvasHeight }: {
  people: Person[];
  canvasWidth: number;
  canvasHeight: number;
}) => {
  const { minX, maxX } = PositionUtils.getMainTreeWidth(people);
  const centerX = (minX + maxX) / 2;
  const centerY = 300;
  const gradientRadius = Math.max(canvasWidth, canvasHeight) * 1.2;

  return (
    <Rect
      x={0}
      y={0}
      width={canvasWidth}
      height={canvasHeight}
      fillRadialGradientStartPoint={{ x: centerX, y: centerY }}
      fillRadialGradientEndPoint={{ x: centerX, y: centerY }}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={gradientRadius}
      fillRadialGradientColorStops={[
        0, "#fff",
        0.4, "#d0e8ff",
        1, "transparent"
      ]}
      listening={false}
    />
  );
};
