import React from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import './styles.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

const domain = import.meta.env.VITE_AUTH0_DOMAIN || ''
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
const audience = import.meta.env.VITE_AUTH0_AUDIENCE

// Always render Auth0Provider to satisfy React hooks rules
// If credentials aren't provided, Auth0Provider will handle it gracefully
createRoot(root).render(
  <React.StrictMode>
    {domain && clientId ? (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: audience,
          scope: 'openid profile email'
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <App />
      </Auth0Provider>
    ) : (
      // Render a dummy Auth0Provider with empty values to satisfy hook requirements
      // The hook will return default values when provider isn't properly configured
      <Auth0Provider
        domain=""
        clientId=""
        authorizationParams={{}}
      >
        <App />
      </Auth0Provider>
    )}
  </React.StrictMode>
)
