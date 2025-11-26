import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App_v2'
import './styles.css'

// Performance monitoring
if (import.meta.env.PROD) {
  // Initialize analytics (add Google Analytics, Plausible, etc.)
  console.log('PaiperSum V2 - Production Mode')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
