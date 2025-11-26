import React from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './styles.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

const domain = import.meta.env.VITE_AUTH0_DOMAIN || ''
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || ''
const redirectUri = window.location.origin

if (!domain || !clientId) {
  console.warn('Auth0 credentials not configured. Using localStorage fallback.')
}

createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      {domain && clientId ? (
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: redirectUri,
            audience: audience || undefined,
          }}
          cacheLocation="localstorage"
          useRefreshTokens={true}
        >
          <App />
        </Auth0Provider>
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </React.StrictMode>
)
