import React from 'react'
import { Card, CardContent } from './ui/Card'

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-paper-100 rounded mb-2"></div>
      <div className="h-4 bg-paper-100 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-paper-100 rounded w-1/2"></div>
    </div>
  )
}

export function DocumentSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-5 bg-paper-100 rounded"></div>
            <div className="h-4 bg-paper-100 rounded w-1/3"></div>
            <div className="h-6 bg-paper-100 rounded w-16"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-paper-100 rounded w-1/4"></div>
            <div className="h-3 bg-paper-100 rounded w-1/6"></div>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-paper-100 rounded"></div>
            <div className="h-2 bg-paper-100 rounded w-5/6"></div>
            <div className="h-2 bg-paper-100 rounded w-4/6"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-paper-100 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-paper-100 rounded mb-2"></div>
            <div className="h-3 bg-paper-100 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-paper-100 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 bg-paper-100 rounded-full"></div>
                    <div className="h-4 bg-paper-100 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-paper-100 rounded mb-2"></div>
                  <div className="h-3 bg-paper-100 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}