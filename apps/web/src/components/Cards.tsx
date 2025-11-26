import { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card({ title, children, footer, className = '' }: CardProps) {
  return (
    <section className={`card ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-600">
          {footer}
        </div>
      )}
    </section>
  )
}
