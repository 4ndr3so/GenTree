import React, { use, useEffect, useRef, useState } from 'react';
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
  const stageRef = useRef<any>(null); 
  const { people, addPersonToCanvasAndState, addTreeSavedToState, loadSavedTree, selectPersonFromState } = useFamilyTree();
  useEffect(() => {
    //createa the first person 
    const padre = new Person('First', 'Prime', 'p1', 'M', '2023-01-01');
    padre.setIsRoot(true);
    addPersonToCanvasAndState(padre, 'root');
    selectPersonFromState(padre);

  }, []);

    //mouse click center
    useEffect(() => {
  const stage = stageRef.current;
  const container = stage.container();

  let isMiddleDown = false;
  let lastPos = { x: 0, y: 0 };

  container.addEventListener("mousedown", (e: MouseEvent) => {
    if (e.button === 1) {
      isMiddleDown = true;
      lastPos = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  });

  container.addEventListener("mousemove", (e: MouseEvent) => {
    if (isMiddleDown) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      const oldPos = stage.position();

      stage.position({
        x: oldPos.x + dx,
        y: oldPos.y + dy,
      });

      lastPos = { x: e.clientX, y: e.clientY };
      stage.batchDraw();
    }
  });

  container.addEventListener("mouseup", (e: MouseEvent) => {
    if (e.button === 1) {
      isMiddleDown = false;
    }
  });

  // Limpieza opcional si desmontas el componente
}, []);
      //zoom con el mouse
     useEffect(() => {
    const stage = stageRef.current;
    const container = stage.container();

    container.addEventListener("wheel", (e: WheelEvent) => {
      e.preventDefault();

      const scaleBy = 1.05;
      const oldScale = stage.scaleX();

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // Zoom in or out
      const direction = e.deltaY > 0 ? 1 / scaleBy : scaleBy;
      const newScale = oldScale * direction;

      stage.scale({ x: newScale, y: newScale });

      // Ajustar posición para hacer zoom hacia el mouse
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();
    });
  }, []);

   const handleClick = (e: any) => {
    const shape = e.target;
    const personId = shape.id(); // Ej: @F_p1_xxxx@-p1
    
    if (personId) {
      const person = people.find(p => p.id === personId);
      if (person) {
        selectPersonFromState(person);
      }
    }
  };

  return (
    <>

      <Stage width={window.innerWidth} ref={stageRef} height={window.innerHeight}>
        <Layer>
          {DrawChildrenLines(people)}
          {drawPartnerLines(people)}  
          {people.map(p => (
            <CircleInfo
              id={p.getId()}
              key={p.getId()}
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
