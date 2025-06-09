import { Path } from "react-konva";

export const LeafS = ({ x, y, radius, ...rest }: any) => {
  console.log("LeafS", rest.id, x, y, radius, rest.fill, rest.stroke);
  return (
    <Path id={rest.id}
      {...rest}
      data={`
        M ${x} ${y - radius}
        Q ${x + radius} ${y}, ${x} ${y + radius}
        Q ${x - radius} ${y}, ${x} ${y - radius}
        Z
      `}
    />
  );
};
