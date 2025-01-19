import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { SidebarProvider } from './components/ui/sidebar'
import { DnDProvider } from './contexts/DnDContext'
import { ReactFlowProvider } from '@xyflow/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactFlowProvider>
      <SidebarProvider>
        <DnDProvider>
          <App />
        </DnDProvider>
      </SidebarProvider>
    </ReactFlowProvider>
  </StrictMode>,
)
