import { createContext, useContext, ReactNode } from 'react'
import { useAuth0, User as Auth0User } from '@auth0/auth0-react'

interface User {
  email: string
  name: string
  isPro: boolean
  docsThisMonth: number
  address?: string
  phone?: string
  company?: string
  auth0Id?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithRedirect: () => Promise<void>
  logout: (options?: { returnTo?: string }) => Promise<void>
  getAccessTokenSilently: () => Promise<string>
  auth0User: Auth0User | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user: auth0User,
    isLoading,
    isAuthenticated: auth0IsAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0()

  // Transform Auth0 user to our User type
  const user: User | null = auth0User
    ? {
        email: auth0User.email || '',
        name: auth0User.name || auth0User.nickname || auth0User.email?.split('@')[0] || 'User',
        isPro: false, // Will be fetched from backend
        docsThisMonth: 0, // Will be fetched from backend
        auth0Id: auth0User.sub
      }
    : null

  const logout = async (options?: { returnTo?: string }) => {
    await auth0Logout({
      returnTo: options?.returnTo || window.location.origin
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: auth0IsAuthenticated,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        auth0User
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
