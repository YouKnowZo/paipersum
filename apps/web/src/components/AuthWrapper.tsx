import { ReactNode } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface AuthWrapperProps {
  children: (auth: {
    isAuthenticated: boolean
    isLoading: boolean
    user: any
    loginWithRedirect: () => Promise<void>
    logout: () => Promise<void>
    getAccessTokenSilently: () => Promise<string>
  }) => ReactNode
}

// Safe Auth0 wrapper that handles missing provider
export default function AuthWrapper({ children }: AuthWrapperProps) {
  const auth0Configured = !!import.meta.env.VITE_AUTH0_DOMAIN && !!import.meta.env.VITE_AUTH0_CLIENT_ID
  
  // Try to use Auth0 hook - will work if Auth0Provider is present
  let authData = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: async () => {},
    logout: async () => {},
    getAccessTokenSilently: async () => ''
  }

  if (auth0Configured) {
    try {
      const hookResult = useAuth0()
      authData = hookResult
    } catch (e) {
      // Auth0Provider not available - use defaults
      console.log('Auth0Provider not available, using fallback')
    }
  }

  return <>{children(authData)}</>
}
