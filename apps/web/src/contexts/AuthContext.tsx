import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { PaiperSumUser } from '../lib/auth0-config'

interface AuthContextType {
  user: PaiperSumUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => void
  signup: () => Promise<void>
  updateUser: (updates: Partial<PaiperSumUser>) => Promise<void>
  getAccessToken: () => Promise<string | undefined>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0()

  const [user, setUser] = useState<PaiperSumUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Sync Auth0 user with our backend
  useEffect(() => {
    async function syncUser() {
      if (auth0IsAuthenticated && auth0User) {
        try {
          const token = await getAccessTokenSilently()
          
          // Call your backend API to get/create user profile
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else if (response.status === 404) {
            // User doesn't exist in our DB, create them
            const createResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/users`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: auth0User.email,
                name: auth0User.name || auth0User.email?.split('@')[0],
              }),
            })

            if (createResponse.ok) {
              const newUser = await createResponse.json()
              setUser(newUser)
            }
          }
        } catch (error) {
          console.error('Failed to sync user:', error)
          // Fallback to localStorage for now
          const savedUser = localStorage.getItem('paipersum_user')
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
      } else {
        // Not authenticated, check localStorage for backward compatibility
        const savedUser = localStorage.getItem('paipersum_user')
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch (e) {
            console.error('Failed to load user from localStorage', e)
          }
        } else {
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    if (!auth0IsLoading) {
      syncUser()
    }
  }, [auth0IsAuthenticated, auth0User, auth0IsLoading, getAccessTokenSilently])

  const login = async () => {
    await loginWithRedirect({
      appState: { returnTo: window.location.pathname },
    })
  }

  const signup = async () => {
    await loginWithRedirect({
      appState: { returnTo: window.location.pathname },
      authorizationParams: {
        screen_hint: 'signup',
      },
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('paipersum_user')
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  const updateUser = async (updates: Partial<PaiperSumUser>) => {
    if (!user) return

    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        localStorage.setItem('paipersum_user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      // Fallback to localStorage
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('paipersum_user', JSON.stringify(updatedUser))
    }
  }

  const getAccessToken = async () => {
    if (auth0IsAuthenticated) {
      return await getAccessTokenSilently()
    }
    return undefined
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: auth0IsAuthenticated,
        login,
        logout,
        signup,
        updateUser,
        getAccessToken,
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
