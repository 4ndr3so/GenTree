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

  useEffect(() => {
    loadSavedTree();
    // Crear árbol genealógico
   /*const padre = new Person( 'Padre a', 'p1');
    padre.setIsRoot(true);
    const madre = new Person( 'Madre a', 'm1');
    const hijo1 = new Person( 'Hijo 1a', 'h1');
   const hijo2 = new Person('Hijo 2a', 'h2');
    const hijo3 = new Person('Hijo 3a', 'h3');
    const hijo4 = new Person('Hijo 4a', 'h4');
    

    padre.relacion.setPartner(madre);
    padre.relacion.addChild(hijo1, madre);
    //padre.relacion.addChild(hijo2, madre);
    //padre.relacion.addChild(hijo3, madre);
    //padre.relacion.addChild(hijo4, madre);

    
    addPerson(padre, 'root');
    addPerson(madre, 'pareja');
    addPerson(hijo1, 'hijo');
    /*addPerson(hijo2, 'hijo');
    addPerson(hijo3, 'hijo');
    addPerson(hijo4, 'hijo');*/

    //deserializar desde JSON
    
    
 /*

const p1= deserializePerson(jsonDto);
const p2= deserializePerson(jsonDto2);
const p3= deserializePerson(jsondto3);
const peopleSaved: Person[] = [p1,p2,p3];

addTreeSaved(peopleSaved)
*/
/*
    //agregando parejas
    const pareja1 = new Person('P1 h2a', 'p2');
    hijo2.relacion.setPartner(pareja1);
    addPerson(pareja1, 'pareja');

    //pareja hijo 4
    const pareja2 = new Person('P2 h4a', 'p3');
    hijo4.relacion.setPartner(pareja2);
    addPerson(pareja2, 'pareja');

    //pareja hijo 3
    const pareja3 = new Person('P3 h3a', 'p4');
    hijo3.relacion.setPartner(pareja3);
    addPerson(pareja3, 'pareja');

    //pareja hijo 1
    const pareja4 = new Person('P4 h1a', 'p5');
    hijo1.relacion.setPartner(pareja4);
    addPerson(pareja4, 'pareja');
    //agregar nieto 1
    const nieto1 = new Person('Nieto 1 h1a', 'n1');
    hijo1.relacion.addChild(nieto1, pareja4);
    addPerson(nieto1, 'hijo');
    //agregar nieto 2
    const nieto2 = new Person('Nieto 2 h1a', 'n2');
    hijo1.relacion.addChild(nieto2, pareja4);
    addPerson(nieto2, 'hijo');
    //agregar pareja nieto 1
    const parejaNieto1 = new Person('P1 n1a', 'p6');
    nieto1.relacion.setPartner(parejaNieto1);
    addPerson(parejaNieto1, 'pareja');
    //agregar nieto hijo4
    const nietoHijo4 = new Person('Nieto hijo 4a', 'n3');
    hijo4.relacion.addChild(nietoHijo4, pareja2);
    addPerson(nietoHijo4, 'hijo');

    //agregar pareja a nieto hijo 4
    const parejaNietoHijo4 = new Person('P1 n3a', 'p7');
    nietoHijo4.relacion.setPartner(parejaNietoHijo4);
    addPerson(parejaNietoHijo4, 'pareja');

    //agregar hijo a nieto hijo 4
    const bisnieto = new Person('Bisnieto n3a', 'n4');
    nietoHijo4.relacion.addChild(bisnieto, parejaNietoHijo4);
    addPerson(bisnieto, 'hijo');

    //add parent to root
    const abuelo = new Person('Abuelo', 'abuelo');
    padre.relacion.setParent(abuelo);
    addPerson(abuelo, 'padre');
*/

  }, []);

  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-4">Tree View</h1>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {DrawChildrenLines(people)}
          {drawPartnerLines(people)}  
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
