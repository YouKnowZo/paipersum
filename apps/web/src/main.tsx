import React from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './lib/auth'
import App from './App'
import './styles.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
