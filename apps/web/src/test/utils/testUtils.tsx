import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  })
}

// Mock user data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z'
}

// Mock analysis data
export const mockAnalysis = {
  risk_score: 75,
  confidence: 0.85,
  clauses: [
    {
      title: 'Indemnification',
      summary: 'You must defend and pay for the other party if something goes wrong.',
      risk: 'red' as const,
      citation: 'The Company shall indemnify and hold harmless...'
    }
  ]
}