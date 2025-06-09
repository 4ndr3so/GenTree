//family tree visualization using React and Konva
{nodes.map((node) => {
            const parent = nodes.find((n) => n.id === node.parentId);

            return (
              <React.Fragment key={node.id}>
                {/* Draw line to parent */}
                {parent && (
                  <Line
                    points={[parent.x, parent.y, node.x, node.y]}
                    stroke="black"
                    strokeWidth={2}
                  />
                )}
                {/* Node */}
                <Circle x={node.x} y={node.y} radius={20} fill="skyblue" />
                <Text
                  text={node.label}
                  x={node.x - 30}
                  y={node.y + 25}
                  fontSize={14}
                  fill="black"
                />
              </React.Fragment>
            );
          })}

           {/* Parents */}
          <Circle x={danielX} y={parentY} radius={parentRadius} fill="#eee" stroke="#555" />
          <Text text="Daniel" x={danielX - 30} y={parentY + 40} fontSize={14} />

          <Circle x={lornaX} y={parentY} radius={parentRadius} fill="#eee" stroke="#555" />
          <Text text="Lorna" x={lornaX - 25} y={parentY + 40} fontSize={14} />

          {/* Horizontal line connecting parents */}
          <Line points={[danielX, connectorY-20, lornaX, connectorY-20]} stroke="black" />

          {/* Vertical line down from center */}
          <Line points={[centerX, connectorY, centerX, verticalLineYEnd]} stroke="black" />

          {/* Horizontal line across all children */}
          <Line
            points={[children[0].x, verticalLineYEnd, children[2].x, verticalLineYEnd]}
            stroke="black"
          />

          {/* Lines down to each child */}
          {children.map((child) => (
            <Line
              key={child.name}
              points={[child.x, verticalLineYEnd, child.x, childrenY - 30]}
              stroke="black"
            />
          ))}

          {/* Children nodes */}
          {children.map((child) => (
            <React.Fragment key={child.name}>
              <Circle x={child.x} y={childrenY} radius={25} fill="#fff" stroke="#555" />
              <Text text={child.name} x={child.x - 25} y={childrenY + 30} fontSize={14} />
            </React.Fragment>
          ))}

            const nodes: TreeNode[] = [
    { id: '1', parentId: null, x: 250, y: 50, label: 'Root' },
    { id: '2', parentId: '1', x: 150, y: 150, label: 'Child 1' },
    { id: '3', parentId: '1', x: 350, y: 150, label: 'Child 2' },
    { id: '4', parentId: '2', x: 100, y: 250, label: 'Grandchild 1' },
  ];
  const parentY = 50;
  const parentRadius = 40;
  const danielX = 100;
 
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

        //testing TreeView
        
  useEffect(() => {
    //loadSavedTree();
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



  static posicionarHijo(persona: Person): Position {
      const [p1, p2] = persona.relacion.getParents();
      const canvasWidth = window.innerWidth;
  
      const centroX = p1 && p2
        ? (p1.postionX + p2.postionX) / 2
        : (p1?.postionX || p2?.postionX || canvasWidth / 2);
  
      const baseY = (p1?.postionY || p2?.postionY || 100) + 100;
  
      const hermanosPadre1 = p1?.relacion.getChildren() || [];
      const hermanosPadre2 = p2?.relacion.getChildren() || [];
  
      const allSiblings = [...hermanosPadre1, ...hermanosPadre2];
  
      // Filtrar duplicados por id
      const uniqueSiblings = Array.from(
        new Map([...allSiblings, persona].map(p => [p.id, p])).values()
      ).sort((a, b) => a.id.localeCompare(b.id));
  
      const offset = Math.floor(uniqueSiblings.length / 2);
  
      uniqueSiblings.forEach((child, i) => {
        let x = centroX + (i - offset) * 100;
        if (uniqueSiblings.length % 2 === 0) x += 50;
        child.setPosition(x, baseY);
      });
  
      return persona.getPosition();
    }