import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'
import type { UserT } from './schemas'

interface AuthContextType {
  user: UserT | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserT | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      api.getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('auth_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password })
    localStorage.setItem('auth_token', response.token)
    setUser(response.user)
  }

  const register = async (email: string, password: string) => {
    const response = await api.register({ email, password, confirmPassword: password })
    localStorage.setItem('auth_token', response.token)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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