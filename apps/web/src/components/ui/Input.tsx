import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({ label, error, helperText, className, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'flex h-10 w-full rounded-lg border border-border-200 bg-paper-0 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-brand-red focus:ring-brand-red',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-brand-red">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-ink-500">{helperText}</p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({ label, error, helperText, className, id, ...props }: TextareaProps) {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx(
          'flex min-h-[80px] w-full rounded-lg border border-border-200 bg-paper-0 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-brand-red focus:ring-brand-red',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-brand-red">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-ink-500">{helperText}</p>
      )}
    </div>
  )
}