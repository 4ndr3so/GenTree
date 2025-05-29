import React, { useEffect, useState } from 'react';
// ✅ GOOD: React components from react-konva
import { Stage, Layer, Circle, Text, Line } from 'react-konva';
import type { BaseProps, TreeNode,PersonNode } from '../../types/types';
import { CircleInfo } from './CircleInfo';
import { CreateConection } from './UtilTree/CreateConection';
import { Person } from '../../Model/Person';
import { useFamilyTree } from '../../hooks/useFamilyTree';

type TreeViewProps = {
  className?: string;
};



const TreeView = ({ className }: TreeViewProps) => {
  const { people, addPerson } = useFamilyTree();

  useEffect(() => {
    // Crear árbol genealógico
    const padre = new Person(100, 50, 'Padre', 'p1');
    const madre = new Person(0, 0, 'Madre', 'm1');
    //const hijo1 = new Person(0, 0, 'Hijo 1', 'h1');
    //const hijo2 = new Person(0, 0, 'Hijo 2', 'h2');

    padre.relacion.setPartner(madre);
    //padre.relacion.addChild(hijo1, madre);
    //padre.relacion.addChild(hijo2, madre);

    addPerson(padre);
 
    //addPerson(hijo2);

  }, []);

  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-4">Tree View</h1>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {people.map(p => (
            <CircleInfo
              key={p.id}
              text={p.name}
              x={p.postionX}
              y={p.postionY}
              radius={25}
            />
          ))}
          
        </Layer>
      </Stage>
    </div>
  );
};

export default TreeView;
