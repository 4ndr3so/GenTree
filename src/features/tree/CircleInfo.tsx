import React from 'react'
import { Stage, Layer, Circle, Text, Line } from 'react-konva';

type CircleInfoProps = {
    text:string,
    x:number,
    y:number,
    radius:number,
    fill?:string,
    stroke?:string
}
export const CircleInfo = ({ text, x, y, radius, fill = '#bdb9b9', stroke = 'black', }: CircleInfoProps) => {

    
    const numeLetters = text.length;
  return (
    <>
        <Circle x={x} y={y} radius={radius} fill={fill} stroke={stroke} />
        <Text text={text} x={x -(numeLetters*3.2)} y={y-6 } fontSize={14} />
    </>
  )
}
