import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TreeView from './features/tree/TreeView'
import { CanvasMenu } from './components/Menu/CanvasMenu'
import type { CircleData } from './types/types'
import AppLayout from './components/Menu/AppLayout'


function App() {

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <AppLayout>
          <TreeView className='col-span-3' />
        </AppLayout> 
      </div>
    </>
  )
}

export default App
