import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TreeView from './features/tree/TreeView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TreeView />
    </>
  )
}

export default App
