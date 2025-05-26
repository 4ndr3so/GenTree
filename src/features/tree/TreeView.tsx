import React, { useState } from 'react';
// ✅ GOOD: React components from react-konva
import { Stage, Layer, Circle, Text } from 'react-konva';
import type { BaseProps } from '../../types/types';


type TreeViewProps = BaseProps & {
    circles: CircleData[];
};
interface CircleData {
  x: number;
  y: number;
  radius: number;
  fill: string;
  id: string;
  draggable: boolean;
}


const TreeView = ({ className ,circles}: TreeViewProps) => {
  

  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-4">Tree View</h1>
      <p className="mb-4">This is a placeholder for the tree view component.</p>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            {circles.map((circle) => (
            <Circle
              key={circle.id}
              x={circle.x}
              y={circle.y}
              radius={circle.radius}
              fill={circle.fill}
              draggable={circle.draggable}
            />
          ))}
          </Layer>
        </Stage>
    </div>
  );
};

export default TreeView;