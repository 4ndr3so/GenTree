import { Circle } from "react-konva";

export const CircleS = (props: any) => {
    console.log("CircleS", props.id, props.x, props.y, props.radius, props.fill, props.stroke);
  return <Circle id={props.id} {...props} radius={props.radius} />;
};
