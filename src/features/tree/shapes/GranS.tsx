import { Group, Image, Rect, Text, Circle, Path, Line } from "react-konva";
import useImage from "use-image";

type GranS = {
  id: string;
  x: number;
  y: number;
  radius: number;
  fill?: string;
  imageUrl: string;
  label: string;
  onClick?: (e: any) => void;
};

export const GranS = ({ id, x, y, radius, imageUrl, label, onClick, fill }: GranS) => {
  //console.log("GranS", id, x, y, radius, imageUrl, label, fill);
  const [image] = useImage(imageUrl);

  const ribbonWidth = radius * 2 + 40;
  const ribbonHeight = 30;
  const labelY = 30;

  return (
    <Group id={id} x={x} y={y} onClick={onClick}>
      {/* Imagen circular */}
      <Circle
        id={id}
        x={0}
        y={0}
        radius={radius + 4}
        fill="white"
        shadowBlur={4}
      />
      {image && (
        <Image id={id}
          image={image}
          x={-radius}
          y={-radius}
          width={radius * 2}
          height={radius * 2}
          cornerRadius={radius}
        />
      )}

      {/* Cinta decorativa */}
      <Group id={id} x={-48} y={-15} scaleX={0.08} scaleY={0.08}>
        <Line id={id}
          points={[
            157.55, 548.667,
            50, 589.352,
            157.02, 651.779,
            121.94, 777.233,
            318.269, 706.678,
            252.428, 695.898
          ]}
          fill={fill}
          closed
        />
        <Line id={id}
          points={[
            1150, 592.986,
            1045.46, 551.939,
            949.2, 699.961,
            887.199, 707.46,
            1076.512, 773.575,
            1043.678, 652.399
          ]}
          fill={fill}
          closed
        />
        <Path id={id}
          data="M1034.779,541.259l24.609-37.842c0,0-397.123-180.783-914.09-1.017l22.932,35.586l94.878,147.231
      c0,0,19.669-6.971,54.701-15.65c0.264-0.065,0.52-0.129,0.784-0.194c99.385-24.531,320.663-62.302,568.047,4.462
      c0.14,0.038,0.279,0.073,0.419,0.11c17.041,4.606,34.202,9.697,51.46,15.335L1034.779,541.259z"
          fill={fill}
        />
      </Group>

      {/* Texto */}
      <Text id={id}
        text={label}
        x={-ribbonWidth / 2}
        y={labelY -7}
        width={ribbonWidth}
        fontSize={12}
        fontStyle="bold"
        fill="#333"
        align="center"
      />
    </Group>
  );
};
