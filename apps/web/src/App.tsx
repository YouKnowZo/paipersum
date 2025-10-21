import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './lib/auth'
import { AppShell } from './components/Layout/AppShell'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'
import { AnalysisPage } from './pages/AnalysisPage'
import { AuthPage } from './pages/AuthPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ConsentModal } from './components/ConsentModal'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function MainApp() {
  const [activeTab, setActiveTab] = React.useState('analyze')

  const header = <Header />
  const sidebar = <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

  return (
    <AppShell header={header} sidebar={sidebar}>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <AuthPage mode="login" />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <AuthPage mode="register" />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <AnalysisPage />
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ConsentModal />
          <MainApp />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,.12)'
              },
              success: {
                iconTheme: {
                  primary: '#2e7d32',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#c62828',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App