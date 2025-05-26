import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TreeView from './features/tree/TreeView'
import { CanvasMenu } from './components/Menu/CanvasMenu'
import type { CircleData } from './types/types'


function App() {
const [circles, setCircles] = useState<CircleData[]>([]);

  const addCircle = () => {
    const newCircle: CircleData = {
      id: crypto.randomUUID(),
      x: Math.random() * 300,
      y: Math.random() * 300,
      radius: 30,
      fill: 'red',
      draggable: true,
    };
    setCircles([...circles, newCircle]);
  };

 

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <CanvasMenu className='col-span-1' onAddNode={addCircle} />
        <TreeView className='col-span-3' circles={circles} />
      </div>
    </>
  )
}

export default App
