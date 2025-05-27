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