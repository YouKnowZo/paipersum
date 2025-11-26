// Auth0 Configuration
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-tenant.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.paipersum.com',
  redirectUri: window.location.origin,
  scope: 'openid profile email offline_access',
}

export interface UserProfile {
  sub: string
  email: string
  name: string
  picture?: string
  email_verified?: boolean
}

export interface PaiperSumUser {
  id: string
  email: string
  name: string
  isPro: boolean
  docsThisMonth: number
  address?: string
  phone?: string
  company?: string
  createdAt: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}
