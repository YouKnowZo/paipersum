import React from 'react'
import { clsx } from 'clsx'

interface AppShellProps {
  header: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AppShell({ header, sidebar, children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-paper-50 text-ink-700">
      <header className="h-16 border-b border-border-200 bg-paper-0 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          {header}
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            {sidebar}
          </aside>
          <main className={clsx('lg:col-span-3', className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}