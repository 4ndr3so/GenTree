import React from 'react';
// ✅ GOOD: React components from react-konva
import { Stage, Layer, Circle, Text } from 'react-konva';

const TreeView: React.FC = () => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Circle x={200} y={200} radius={50} fill="lightblue" />
        <Text x={170} y={190} text="Person" fontSize={18} />
      </Layer>
    </Stage>
  );
};

export default TreeView;