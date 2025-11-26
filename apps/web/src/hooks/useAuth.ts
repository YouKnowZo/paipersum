import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { syncUser, getCurrentUser, type User } from '../lib/auth'

export function useAuth() {
  const { 
    isAuthenticated, 
    isLoading: auth0Loading, 
    user: auth0User,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sync user with backend when Auth0 user is available
  useEffect(() => {
    const syncUserData = async () => {
      if (!isAuthenticated || !auth0User) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Get access token
        const token = await getAccessTokenSilently()
        
        // Sync user with backend
        const syncedUser = await syncUser()
        setUser(syncedUser)
        setError(null)
      } catch (err) {
        console.error('Failed to sync user:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user')
        // Fallback to Auth0 user data
        if (auth0User) {
          setUser({
            id: auth0User.sub || '',
            email: auth0User.email || '',
            name: auth0User.name || auth0User.nickname || '',
            picture: auth0User.picture,
            subscriptionTier: 'free',
            docsThisMonth: 0,
            totalDocsAnalyzed: 0,
            totalSavings: 0,
            canAnalyze: true
          })
        }
      } finally {
        setLoading(false)
      }
    }

    if (!auth0Loading) {
      syncUserData()
    }
  }, [isAuthenticated, auth0User, auth0Loading, getAccessTokenSilently])

  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    })
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }

  return {
    user,
    isAuthenticated,
    isLoading: loading || auth0Loading,
    error,
    login,
    logout: handleLogout
  }
}
