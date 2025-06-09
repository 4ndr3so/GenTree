import React, { use, useEffect, useRef, useState } from 'react';
// ✅ GOOD: React components from react-konva
import { Stage, Layer, Circle, Text, Line, Group } from 'react-konva';

import { CircleInfo } from './CircleInfo';


import { useFamilyTree } from '../../hooks/useFamilyTree';
import { drawPartnerLines } from './drawPartnerLines';
import { DrawChildrenLines } from './DrawChildrenLines';
import { Person } from '../../Model/Person';
import { NodeShape, type ShapeType } from './NodeShape';
import { BackgroundGradient } from './background/BackgroundGradient';
import type Konva from 'konva';


type TreeViewProps = {
  className?: string;
  shapeType?: ShapeType; // ✅ opcional para evitar error en <App />
};
export default function TreeView({ shapeType = "grand", className }: TreeViewProps) {
  // ✅ GOOD: useRef for the Konva Stage
  const stageRef = useRef<any>(null);

  //group ref for the shapes
  const groupRef = useRef<Konva.Group>(null);
  //adjunst the canva screen size
  const containerRef = useRef<HTMLDivElement>(null);
  //delays the creation of root person
  const [dimensions, setDimensions] = useState({ width: 10, height: 600 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  //for the use of the weells and scroll of the canva

  const { people, addPersonToCanvasAndState, addTreeSavedToState, loadSavedTree, selectPersonFromState } = useFamilyTree();
  useEffect(() => {
    //delays the creation of the root person until the canvas is ready
    if (dimensions.width > 20) {
      const padre = new Person('First', 'Prime', 'p1', 'M', '2023-01-01');
      padre.setIsRoot(true);
      addPersonToCanvasAndState(padre, 'root');
      
      selectPersonFromState(padre);
    }
  }, [dimensions.width]); // <- ahora solo se ejecuta cuando width se actualiza

  //mouse click center
  useEffect(() => {
    const stage = stageRef.current;
    const container = stage.container();
    let isMiddleDown = false;
    let lastPos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        isMiddleDown = true;
        lastPos = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMiddleDown) {
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        const group = groupRef.current;

        if (group) {
          group.position({
            x: group.x() + dx,
            y: group.y() + dy,
          });
          group.getLayer()?.batchDraw();
        }

        lastPos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        isMiddleDown = false;
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const container = stage.container();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const scaleBy = 1.05;
      const oldScale = groupRef.current?.scaleX() ?? 1;

      const pointer = stage.getPointerPosition();
      if (!pointer || !groupRef.current) return;

      const mousePointTo = {
        x: (pointer.x - groupRef.current.x()) / oldScale,
        y: (pointer.y - groupRef.current.y()) / oldScale,
      };

      const direction = e.deltaY > 0 ? 1 / scaleBy : scaleBy;
      const newScale = oldScale * direction;

      groupRef.current.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      groupRef.current.position(newPos);
      groupRef.current.getLayer()?.batchDraw();
    };

    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);


  const handleClick = (e: any) => {
   // console.log("Clicked on shape:", e.target);
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
    <div ref={containerRef} className="w-full h-full">

      <Stage width={dimensions.width} height={dimensions.height} ref={stageRef}>
        <Layer listening={false}>
          <BackgroundGradient people={people} canvasWidth={dimensions.width} canvasHeight={dimensions.height} />
        </Layer>
        <Layer>
          <Group ref={groupRef}>
            {DrawChildrenLines(people)}
            {drawPartnerLines(people)}
            {people.map(p => (
              <NodeShape
                id={p.getId()}
                key={p.getId()}
                text={p.getFirstName()}
                x={p.postionX}
                y={p.postionY}
                radius={25}

                shapeType={shapeType}
                onClick={handleClick}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};


