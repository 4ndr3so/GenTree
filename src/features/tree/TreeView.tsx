import React, { use, useEffect, useState } from 'react';
// ✅ GOOD: React components from react-konva
import { Stage, Layer, Circle, Text, Line } from 'react-konva';

import { CircleInfo } from './CircleInfo';


import { useFamilyTree } from '../../hooks/useFamilyTree';
import { drawPartnerLines } from './drawPartnerLines';
import { DrawChildrenLines } from './DrawChildrenLines';
import { Person } from '../../Model/Person';


type TreeViewProps = {
  className?: string;
};



const TreeView = ({ className }: TreeViewProps) => {
  const { people, addPersonToCanvasAndState, addTreeSavedToState, loadSavedTree, selectPersonFromState } = useFamilyTree();
  useEffect(() => {
    //createa the first person 
    const padre = new Person('First', 'Prime', 'p1', 'M', '2023-01-01');
    padre.setIsRoot(true);
    addPersonToCanvasAndState(padre, 'root');
    selectPersonFromState(padre);

  }, []);

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
              id={p.getFamilyId()+"-"+p.getId()}
              key={p.getFamilyId()+"-"+p.getId()}
              text={p.getFirstName()}
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
