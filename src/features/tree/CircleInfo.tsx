import React from 'react'
import { Stage, Layer, Circle, Text, Line } from 'react-konva';

type CircleInfoProps = {
    text:string,
    x:number,
    y:number,
    radius:number,
    fill?:string,
    stroke?:string
    id: string
    onClick?: (e: any) => void;
}
export const CircleInfo = ({id, text, x, y, radius, fill = '#bdb9b9', stroke = 'black', onClick }: CircleInfoProps) => {
  //console.log("CircleInfo", id, text, x, y, radius, fill, stroke);
    
    const numeLetters = text.length;
  return (
    <>
        <Circle id={id} x={x} y={y} radius={radius} fill={fill} stroke={stroke} onClick={onClick} />
        <Text text={text} x={x -(numeLetters*3.2)} y={y-6 } fontSize={14} />
    </>
  )
}
