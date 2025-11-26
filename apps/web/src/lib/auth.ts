// Auth utilities and API client with Auth0 integration
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance with auth token support
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for Auth0 cookies
})

// Add auth token to requests if available
export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

// User API functions
export interface User {
  id: string
  email: string
  name: string
  picture?: string
  subscriptionTier: 'free' | 'pro' | 'team' | 'enterprise'
  docsThisMonth: number
  totalDocsAnalyzed: number
  totalSavings: number
  canAnalyze: boolean
  remainingAnalyses?: number | null
}

export async function syncUser(): Promise<User> {
  const res = await apiClient.post('/users/sync')
  return res.data.user
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get('/users/me')
  return res.data.user
}

export async function getUserStats() {
  const res = await apiClient.get('/users/stats')
  return res.data.stats
}

export async function updateSubscription(tier: 'free' | 'pro' | 'team' | 'enterprise'): Promise<User> {
  const res = await apiClient.patch('/users/subscription', { tier })
  return res.data.user
}
