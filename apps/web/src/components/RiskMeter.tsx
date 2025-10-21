import React from 'react'
import { RiskDot } from './ui/Badge'

interface RiskMeterProps {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RiskMeter({ score, showLabel = true, size = 'md' }: RiskMeterProps) {
  const percentage = Math.max(0, Math.min(100, score))
  
  const getRiskLevel = (score: number) => {
    if (score >= 75) return { level: 'High', color: 'red' as const }
    if (score >= 50) return { level: 'Moderate', color: 'yellow' as const }
    if (score >= 25) return { level: 'Low', color: 'green' as const }
    return { level: 'Minimal', color: 'green' as const }
  }

  const { level, color } = getRiskLevel(percentage)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-ink-600 mb-2">
          <span className="font-medium">Risk Assessment</span>
          <div className="flex items-center gap-2">
            <RiskDot risk={color} size={size} />
            <span className="font-medium">{percentage}% · {level}</span>
          </div>
        </div>
      )}
      <div className={`w-full bg-paper-100 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${
            color === 'red' ? 'bg-brand-red' : 
            color === 'yellow' ? 'bg-brand-yellow' : 'bg-brand-green'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-500 mt-1">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      )}
    </div>
  )
}