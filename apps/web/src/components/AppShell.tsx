import { ReactNode } from 'react'

export default function AppShell({ 
  header, 
  sidebar, 
  children 
}: { 
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode 
}) {
  return (
    <div className="min-h-screen bg-paper-50 text-ink-700">
      <header className="h-16 border-b bg-paper-0 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {header}
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            {sidebar}
          </aside>
          <main className="col-span-12 lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
