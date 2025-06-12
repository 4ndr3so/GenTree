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
import { PositionUtilsV2 } from './UtilTree/PositionUtilsV2';


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
      const root = new Person('Mama Lilia', 'Pardo', 'r1', 'M', '2023-01-01');
      root.setIsRoot(true);
      const madre = new Person('Papa Gonzalo', 'PArdo', 'r2', 'F', '2023-01-01');

      const hijo1 = new Person('h1', 'h1', 'h1', 'M', '2023-01-01');
      const hijo2 = new Person('h2', 'h2', 'h2', 'M', '2023-02-01');
      const hijo3 = new Person('h3', 'h3', 'h3', 'M', '2023-03-01');
      const hijo4 = new Person('h4', 'h4', 'h4', 'M', '2023-04-01');
      const hijo5 = new Person('h5', 'h5', 'h5', 'M', '2023-05-01');
      const hijo6 = new Person('h6', 'h6', 'h6', 'M', '2023-06-01');  
      const hijo7 = new Person('h7', 'h7', 'h7', 'M', '2023-07-01');
      const hijo8 = new Person('h8', 'h8', 'h8', 'M', '2023-08-01');

      const parejaHijo1= new Person('p1', 'parejaHijo1', 'p1h1', 'F', '2023-01-01');
      const hijo1Hijo1 = new Person('hijo1Hijo1', 'hijoHijo1', 'h1h1', 'M', '2023-01-01');
      const hijo2Hijo1 = new Person('hijo2Hijo1', 'hijo2Hijo1', 'h2h1', 'M', '2023-02-01');

      const parejaHijo2 = new Person('p2', 'parejaHijo2', 'p2h2', 'F', '2023-01-01');
      const hijo1Hijo2 = new Person('hijo1Hijo2', 'hijoHijo2', 'h1h2', 'M', '2023-01-01');
      const hijo2Hijo2 = new Person('hijo2Hijo2', 'hijo2Hijo2', 'h2h2', 'M', '2023-02-01');

      const parejaHijo2Hijo1 = new Person('parejaHijo2Hijo1', 'parejaHijo2Hijo1', 'ph2h1', 'F', '2023-01-01');
      

      root.relacion.setPartner(madre);
      root.relacion.addChild(hijo1, madre);
      root.relacion.addChild(hijo2, madre);
      root.relacion.addChild(hijo3, madre);
      root.relacion.addChild(hijo4, madre);
      root.relacion.addChild(hijo5, madre);
      root.relacion.addChild(hijo6, madre);
      root.relacion.addChild(hijo7, madre);
      root.relacion.addChild(hijo8, madre);
/*
      hijo1.relacion.setPartner(parejaHijo1);
      hijo1.relacion.addChild(hijo1Hijo1, parejaHijo1);
      hijo1.relacion.addChild(hijo2Hijo1, parejaHijo1);


      hijo2.relacion.setPartner(parejaHijo2);
      hijo2.relacion.addChild(hijo1Hijo2, parejaHijo2);
      hijo2.relacion.addChild(hijo2Hijo2, parejaHijo2);
*/
     // hijo1Hijo1.relacion.setPartner(parejaHijo2Hijo1);
      
      

      ///
      addPersonToCanvasAndState(root, 'root');
      addPersonToCanvasAndState(madre, 'pareja');
      addPersonToCanvasAndState(hijo1, 'hijo');
      addPersonToCanvasAndState(hijo2, 'hijo');
      addPersonToCanvasAndState(hijo3, 'hijo');
      addPersonToCanvasAndState(hijo4, 'hijo');
      addPersonToCanvasAndState(hijo5, 'hijo');
      addPersonToCanvasAndState(hijo6, 'hijo');
      addPersonToCanvasAndState(hijo7, 'hijo');
      addPersonToCanvasAndState(hijo8, 'hijo');
      //parejas
    //  addPersonToCanvasAndState(parejaHijo1, 'pareja');
     //addPersonToCanvasAndState(hijo1Hijo1, 'hijo');
      //addPersonToCanvasAndState(hijo2Hijo1, 'hijo');

      
     // addPersonToCanvasAndState(parejaHijo2, 'pareja');
     // addPersonToCanvasAndState(hijo1Hijo2, 'hijo');
     // addPersonToCanvasAndState(hijo2Hijo2, 'hijo');
    // addPersonToCanvasAndState(parejaHijo2Hijo1, 'pareja');
      
     // const parejaHijo1Hijo2 = new Person('parejaHijo1Hijo2', 'parejaHijo1Hijo2', 'ph1h2', 'F', '2023-01-01');
     // hijo1Hijo2.relacion.setPartner(parejaHijo1Hijo2);
      //addPersonToCanvasAndState(parejaHijo1Hijo2, 'pareja');
    
      
      selectPersonFromState(root);
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
                x={p.positionX}
                y={p.positionY}
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


