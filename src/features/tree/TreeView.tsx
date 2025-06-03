import React, { useEffect, useState } from 'react';
// ✅ GOOD: React components from react-konva
import { Stage, Layer, Circle, Text, Line } from 'react-konva';

import { CircleInfo } from './CircleInfo';


import { useFamilyTree } from '../../hooks/useFamilyTree';
import { drawPartnerLines } from './drawPartnerLines';
import { DrawChildrenLines } from './DrawChildrenLines';


type TreeViewProps = {
  className?: string;
};



const TreeView = ({ className }: TreeViewProps) => {
  const { people, addPerson, addTreeSaved, loadSavedTree } = useFamilyTree();


   const handleClick = (e: any) => {
    const shape = e.target;
    console.log("Clicked ID:", shape.id());
  };

  return (
    <>

      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {DrawChildrenLines(people)}
          {drawPartnerLines(people)}  
          {people.map(p => (
            <CircleInfo
              id={p.id}
              key={p.id}
              text={p.name}
              x={p.postionX}
              y={p.postionY}
              radius={25}
              onClick={handleClick}
            />
          ))}
           
        </Layer>
      </Stage>
    </>
  );
};

export default TreeView;
