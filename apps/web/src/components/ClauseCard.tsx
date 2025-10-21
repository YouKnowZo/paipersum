import React from 'react'
import { Card, CardContent } from './ui/Card'
import { RiskDot } from './ui/Badge'
import { clsx } from 'clsx'

interface ClauseCardProps {
  title: string
  summary: string
  risk: 'green' | 'yellow' | 'red'
  citation: string
  className?: string
}

export function ClauseCard({ title, summary, risk, citation, className }: ClauseCardProps) {
  const riskColors = {
    green: 'border-l-brand-green',
    yellow: 'border-l-brand-yellow',
    red: 'border-l-brand-red'
  }

  return (
    <Card className={clsx('border-l-4', riskColors[risk], className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <RiskDot risk={risk} className="mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-ink-900 mb-2">{title}</h4>
            <p className="text-sm text-ink-700 mb-3 leading-relaxed">{summary}</p>
            <div className="bg-paper-50 rounded-lg p-3">
              <p className="text-xs text-ink-600 font-medium mb-1">Source Text:</p>
              <p className="text-xs text-ink-500 italic leading-relaxed">
                "{citation.length > 200 ? `${citation.substring(0, 200)}...` : citation}"
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}