import React from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import './styles.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined
const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL as string | undefined || window.location.origin

if (!domain || !clientId) {
  console.warn('Auth0 environment variables are not set. Login will be disabled.')
}

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <React.StrictMode>
    {domain && clientId ? (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }}
        cacheLocation="localstorage"
        useRefreshTokens
      >
        <App />
      </Auth0Provider>
    ) : (
      <App />
    )}
  </React.StrictMode>
)
