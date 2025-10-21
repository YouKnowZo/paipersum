import React from 'react'
import { Button } from '../ui/Button'
import { useAuth } from '@/lib/auth'
import { Shield, LogOut, User } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-900">PaiperSum</h1>
            <p className="text-xs text-ink-500">Legal Document Analyzer</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-paper-100 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-brand-green" />
          <span className="text-xs text-ink-600">Not legal advice</span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-ink-700 hidden sm:block">
                {user.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/login'}>
              Login
            </Button>
            <Button size="sm" onClick={() => window.location.href = '/register'}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}