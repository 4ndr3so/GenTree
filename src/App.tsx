import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TreeView from './features/tree/TreeView'
import { CanvasMenu } from './components/Menu/CanvasMenu'
import type { CircleData } from './types/types'
import AppLayout from './components/Menu/AppLayout'
import { CanvasDimensionsProvider } from './components/context/CanvasDimensionsContext'


function App() {

  return (
 
        <AppLayout>
          <CanvasDimensionsProvider>
            <TreeView />
          </CanvasDimensionsProvider>
        </AppLayout> 
     
  )
}

export default App
