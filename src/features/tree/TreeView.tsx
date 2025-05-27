import React, { useState } from 'react';
// ✅ GOOD: React components from react-konva
import { Stage, Layer, Circle, Text, Line } from 'react-konva';
import type { BaseProps, TreeNode,PersonNode } from '../../types/types';
import { CircleInfo } from './CircleInfo';
import { CreateConection } from './UtilTree/CreateConection';
import { Person } from '../../Model/Person';


type TreeViewProps = BaseProps & {
  
};


const TreeView = ({ className }: TreeViewProps) => {
  const radius = 40; // Default radius for the circles
  const defaultSpace=100;
  const [selectedNode, setSelectedNode] = useState<Person[] | null>(
    [
      new Person(100, 50, 'Daniela', '1'),
      new Person(250, 50, 'Lorna', '2')
    ]
  );


  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-4">Tree View</h1>
      <p className="mb-4">This is a placeholder for the tree view component.</p>
      <Stage width={window.innerWidth} height={window.innerHeight}>
       
        <Layer>
          {selectedNode && selectedNode.map((node) => (
            <React.Fragment key={node.id}>
              <CircleInfo
                text={node.getName()}
                x={node.getPosition().x}
                y={node.getPosition().y}
                radius={radius}
   
              />
 
            </React.Fragment>
          ))}


        </Layer>
      </Stage>
    </div>
  );
};

export default TreeView;