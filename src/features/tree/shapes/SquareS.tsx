import { Rect } from "react-konva";

export const SquareS = ({ radius, ...rest }: any) => {
    console.log("SquareS", rest.id, rest.x, rest.y, radius, rest.fill, rest.stroke);
  return (
    <Rect id={rest.id}
      {...rest}
      width={radius * 2}
      height={radius * 2}
      offsetX={radius}
      offsetY={radius}
      cornerRadius={8}
    />
  );
};
