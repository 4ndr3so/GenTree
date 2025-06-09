import { Text } from "react-konva";
import { CircleS } from "./shapes/CircleS";
import { SquareS } from "./shapes/SquareS";
import { LeafS } from "./shapes/LeafS";
import { GranS } from "./shapes/GranS";


export type ShapeType = "circle" | "square" | "leaf" | "grand";

type Props = {
  id: string;
  x: number;
  y: number;
  radius: number;
  text: string;
  fill?: string;
  stroke?: string;
  shapeType: ShapeType;
  onClick?: (e: any) => void;
};

export const NodeShape = ({
  id,
  x,
  y,
  radius,
  text,
  fill = "#bdb9b9",
  stroke = "black",
  shapeType,
  onClick,
}: Props) => {
  const numLetters = text.length;

  const commonProps = {
    id,
    x,
    y,
    fill,
    stroke,
    onClick,
    radius,
  };

  const shapeComponent = {
    grand: <GranS {...commonProps} imageUrl="../assets/img/person.png" label={text} />,
    circle: <CircleS {...commonProps} />,
    square: <SquareS {...commonProps} />,
    leaf: <LeafS {...commonProps} />,
  }[shapeType];

  return (
    <>
      {shapeComponent}
      {/*<Text text={text} x={x - numLetters * 3.2} y={y - 6} fontSize={14} />*/}
    </>
  );
};
