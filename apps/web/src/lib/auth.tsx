/**
 * PaiperSum Authentication Context
 * 
 * Provides Auth0 integration with local user persistence fallback.
 * Handles user state across sessions and syncs with backend.
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

// User types
export interface User {
  id: string
  email: string
  name: string
  picture?: string
  isPro: boolean
  docsThisMonth: number
  totalDocsAnalyzed: number
  totalSavings: number
  address?: string
  phone?: string
  company?: string
  createdAt: string
  lastLoginAt: string
  auth0Id?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  login: (email: string, name: string) => Promise<void>
  loginWithAuth0: () => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
  incrementDocsAnalyzed: () => void
  addSavings: (amount: number) => void
  upgradeToProx: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || ''
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
const AUTH0_REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin : ''

// Storage keys
const STORAGE_KEYS = {
  user: 'paipersum_user_v2',
  accessToken: 'paipersum_access_token',
  docsAnalyzed: 'paipersum_docs_analyzed',
  totalSavings: 'paipersum_total_savings',
  savedAnalyses: 'paipersum_saved_analyses'
} as const

// Generate a unique device ID for tracking anonymous users
function getDeviceId(): string {
  let deviceId = localStorage.getItem('paipersum_device_id')
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('paipersum_device_id', deviceId)
  }
  return deviceId
}

// Sync user data to backend
async function syncUserToBackend(user: User): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...user,
        deviceId: getDeviceId()
      })
    })
    
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.warn('Failed to sync user to backend:', error)
    return null
  }
}

// Fetch user from backend by email
async function fetchUserFromBackend(email: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/users/lookup?email=${encodeURIComponent(email)}`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.warn('Failed to fetch user from backend:', error)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  })

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check for Auth0 callback
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const authState = urlParams.get('state')
        
        if (code && authState) {
          // Handle Auth0 callback
          await handleAuth0Callback(code, authState)
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
          return
        }

        // Try to load from localStorage
        const storedUser = localStorage.getItem(STORAGE_KEYS.user)
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser) as User
            
            // Try to sync/fetch latest from backend
            const backendUser = await fetchUserFromBackend(user.email)
            
            if (backendUser) {
              // Merge local and backend data (prefer backend)
              const mergedUser = {
                ...user,
                ...backendUser,
                // Keep local data if backend is stale
                docsThisMonth: Math.max(user.docsThisMonth, backendUser.docsThisMonth),
                totalDocsAnalyzed: Math.max(user.totalDocsAnalyzed, backendUser.totalDocsAnalyzed),
                totalSavings: Math.max(user.totalSavings, backendUser.totalSavings)
              }
              localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(mergedUser))
              setState({
                user: mergedUser,
                isLoading: false,
                isAuthenticated: true,
                error: null
              })
            } else {
              setState({
                user,
                isLoading: false,
                isAuthenticated: true,
                error: null
              })
            }
          } catch (e) {
            console.error('Failed to parse stored user', e)
            localStorage.removeItem(STORAGE_KEYS.user)
            setState({ user: null, isLoading: false, isAuthenticated: false, error: null })
          }
        } else {
          setState({ user: null, isLoading: false, isAuthenticated: false, error: null })
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setState({ user: null, isLoading: false, isAuthenticated: false, error: 'Failed to load user' })
      }
    }

    loadUser()
  }, [])

  // Handle Auth0 OAuth callback
  const handleAuth0Callback = async (code: string, authState: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      // Exchange code for tokens via backend
      const response = await fetch(`${API_URL}/api/auth/auth0/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state: authState, redirect_uri: AUTH0_REDIRECT_URI })
      })
      
      if (!response.ok) {
        throw new Error('Auth0 callback failed')
      }
      
      const { user, accessToken } = await response.json()
      
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
      localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      })
    } catch (error) {
      console.error('Auth0 callback error:', error)
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Authentication failed'
      })
    }
  }

  // Simple email/name login (with backend persistence)
  const login = useCallback(async (email: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // First check if user exists in backend
      let user = await fetchUserFromBackend(email)
      
      if (!user) {
        // Create new user
        user = {
          id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          email,
          name,
          isPro: false,
          docsThisMonth: 0,
          totalDocsAnalyzed: parseInt(localStorage.getItem(STORAGE_KEYS.docsAnalyzed) || '0'),
          totalSavings: parseInt(localStorage.getItem(STORAGE_KEYS.totalSavings) || '0'),
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }
        
        // Sync to backend
        const syncedUser = await syncUserToBackend(user)
        if (syncedUser) {
          user = syncedUser
        }
      } else {
        // Update last login
        user.lastLoginAt = new Date().toISOString()
      }
      
      // Save locally
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      })
    } catch (error) {
      console.error('Login error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }))
    }
  }, [])

  // Auth0 login redirect
  const loginWithAuth0 = useCallback(async () => {
    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
      // Fallback to simple login modal if Auth0 not configured
      console.warn('Auth0 not configured, using fallback')
      return
    }
    
    const state = Math.random().toString(36).substring(2)
    localStorage.setItem('auth0_state', state)
    
    const authUrl = new URL(`https://${AUTH0_DOMAIN}/authorize`)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', AUTH0_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', AUTH0_REDIRECT_URI)
    authUrl.searchParams.set('scope', 'openid profile email')
    authUrl.searchParams.set('state', state)
    
    window.location.href = authUrl.toString()
  }, [])

  // Logout
  const logout = useCallback(() => {
    // Save anonymous usage data before clearing user
    const user = state.user
    if (user) {
      localStorage.setItem(STORAGE_KEYS.docsAnalyzed, user.totalDocsAnalyzed.toString())
      localStorage.setItem(STORAGE_KEYS.totalSavings, user.totalSavings.toString())
    }
    
    localStorage.removeItem(STORAGE_KEYS.user)
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null
    })

    // Redirect to Auth0 logout if configured
    if (AUTH0_DOMAIN) {
      const logoutUrl = new URL(`https://${AUTH0_DOMAIN}/v2/logout`)
      logoutUrl.searchParams.set('client_id', AUTH0_CLIENT_ID)
      logoutUrl.searchParams.set('returnTo', window.location.origin)
      window.location.href = logoutUrl.toString()
    }
  }, [state.user])

  // Update user
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return
    
    const updatedUser = { ...state.user, ...updates }
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser))
    
    // Sync to backend
    syncUserToBackend(updatedUser)
    
    setState(prev => ({
      ...prev,
      user: updatedUser
    }))
  }, [state.user])

  // Refresh user from backend
  const refreshUser = useCallback(async () => {
    if (!state.user) return
    
    const backendUser = await fetchUserFromBackend(state.user.email)
    if (backendUser) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(backendUser))
      setState(prev => ({
        ...prev,
        user: backendUser
      }))
    }
  }, [state.user])

  // Increment docs analyzed
  const incrementDocsAnalyzed = useCallback(() => {
    if (!state.user) return
    
    const updatedUser = {
      ...state.user,
      docsThisMonth: state.user.docsThisMonth + 1,
      totalDocsAnalyzed: state.user.totalDocsAnalyzed + 1
    }
    
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser))
    localStorage.setItem(STORAGE_KEYS.docsAnalyzed, updatedUser.totalDocsAnalyzed.toString())
    
    // Sync to backend (fire and forget)
    syncUserToBackend(updatedUser)
    
    setState(prev => ({
      ...prev,
      user: updatedUser
    }))
  }, [state.user])

  // Add savings
  const addSavings = useCallback((amount: number) => {
    if (!state.user) return
    
    const updatedUser = {
      ...state.user,
      totalSavings: state.user.totalSavings + amount
    }
    
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser))
    localStorage.setItem(STORAGE_KEYS.totalSavings, updatedUser.totalSavings.toString())
    
    // Sync to backend (fire and forget)
    syncUserToBackend(updatedUser)
    
    setState(prev => ({
      ...prev,
      user: updatedUser
    }))
  }, [state.user])

  // Upgrade to Pro
  const upgradeToProx = useCallback(async () => {
    if (!state.user) return
    
    // This would typically redirect to Stripe checkout
    // For now, we'll just update the user
    const updatedUser = {
      ...state.user,
      isPro: true
    }
    
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser))
    syncUserToBackend(updatedUser)
    
    setState(prev => ({
      ...prev,
      user: updatedUser
    }))
  }, [state.user])

  const value: AuthContextValue = {
    ...state,
    login,
    loginWithAuth0,
    logout,
    updateUser,
    refreshUser,
    incrementDocsAnalyzed,
    addSavings,
    upgradeToProx
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hook for checking if user can analyze
export function useCanAnalyze() {
  const { user, isAuthenticated } = useAuth()
  
  // Get anonymous usage count
  const anonymousCount = parseInt(localStorage.getItem(STORAGE_KEYS.docsAnalyzed) || '0')
  
  if (!isAuthenticated) {
    // Not logged in - allow 5 free analyses
    return {
      canAnalyze: anonymousCount < 5,
      remaining: Math.max(0, 5 - anonymousCount),
      reason: anonymousCount >= 5 ? 'Create a free account to continue' : null
    }
  }
  
  if (user?.isPro) {
    return {
      canAnalyze: true,
      remaining: Infinity,
      reason: null
    }
  }
  
  // Free tier - 30/month
  const remaining = 30 - (user?.docsThisMonth || 0)
  return {
    canAnalyze: remaining > 0,
    remaining,
    reason: remaining <= 0 ? 'Monthly limit reached. Upgrade to Pro for unlimited!' : null
  }
}

// Helper to get saved analyses
export function useSavedAnalyses() {
  const [analyses, setAnalyses] = useState<any[]>([])
  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.savedAnalyses)
    if (saved) {
      try {
        setAnalyses(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved analyses', e)
      }
    }
  }, [])
  
  const saveAnalysis = useCallback((analysis: any, name: string) => {
    const newAnalysis = {
      id: Date.now().toString(),
      name,
      date: new Date().toISOString(),
      analysis
    }
    const updated = [newAnalysis, ...analyses].slice(0, 10)
    setAnalyses(updated)
    localStorage.setItem(STORAGE_KEYS.savedAnalyses, JSON.stringify(updated))
    return newAnalysis
  }, [analyses])
  
  const deleteAnalysis = useCallback((id: string) => {
    const updated = analyses.filter(a => a.id !== id)
    setAnalyses(updated)
    localStorage.setItem(STORAGE_KEYS.savedAnalyses, JSON.stringify(updated))
  }, [analyses])
  
  return { analyses, saveAnalysis, deleteAnalysis }
}
