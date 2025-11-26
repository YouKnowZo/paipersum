import { useAuth0 } from '@auth0/auth0-react'

// Safe wrapper for useAuth0
// Note: This hook MUST be called unconditionally (React rules)
// Auth0Provider should always be rendered in main.tsx if Auth0 is configured
export function useAuth0Safe() {
  const auth0Configured = !!import.meta.env.VITE_AUTH0_DOMAIN && !!import.meta.env.VITE_AUTH0_CLIENT_ID
  
  // Always call the hook (React rules require this)
  // If Auth0Provider isn't present, this will throw - but main.tsx ensures provider is rendered when configured
  const auth0Data = useAuth0()
  
  // Return Auth0 data if configured, otherwise return defaults
  // The hook will still be called but values will be defaults if provider isn't configured
  if (!auth0Configured) {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      loginWithRedirect: async () => {},
      logout: async () => {},
      getAccessTokenSilently: async () => ''
    }
  }
  
  return auth0Data
}
