import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CardsProvider } from '@/context/CardsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CardsProvider>
      <App />
    </CardsProvider>
  </StrictMode>,
)
