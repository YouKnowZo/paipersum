import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { FileText, Shield, BookOpen, Settings, Upload, History } from 'lucide-react'
import { clsx } from 'clsx'

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const navigationItems = [
  { id: 'analyze', label: 'Analyze', icon: Upload },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'scans', label: 'Recent Scans', icon: History },
  { id: 'templates', label: 'Templates', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export function Sidebar({ activeTab = 'analyze', onTabChange }: SidebarProps) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-ink-900 mb-3">Navigation</h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className={clsx(
                    'w-full justify-start',
                    activeTab === item.id && 'bg-paper-100'
                  )}
                  onClick={() => onTabChange?.(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-brand-blue" />
            <h3 className="font-semibold text-ink-900">Security</h3>
          </div>
          <div className="space-y-2 text-xs text-ink-600">
            <p>• Documents are encrypted at rest</p>
            <p>• Analysis data is not stored</p>
            <p>• SOC 2 compliant infrastructure</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-ink-900 mb-2">Need Help?</h3>
          <p className="text-xs text-ink-600 mb-3">
            Our AI analyzes legal documents and provides risk assessments.
          </p>
          <Button variant="secondary" size="sm" className="w-full">
            View Documentation
          </Button>
        </div>
      </Card>
    </div>
  )
}