import React from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  children: React.ReactNode
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-paper-100 text-ink-700',
    success: 'bg-brand-green text-white',
    warning: 'bg-brand-yellow text-white',
    destructive: 'bg-brand-red text-white'
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

interface RiskDotProps {
  risk: 'green' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
}

export function RiskDot({ risk, size = 'md' }: RiskDotProps) {
  const colors = {
    green: 'bg-brand-green',
    yellow: 'bg-brand-yellow',
    red: 'bg-brand-red'
  }

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  }

  return (
    <span
      className={clsx(
        'inline-block rounded-full',
        colors[risk],
        sizes[size]
      )}
      aria-label={`Risk level: ${risk}`}
    />
  )
}