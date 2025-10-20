import { ReactNode } from 'react'

export function Card({ 
  title, 
  children, 
  footer 
}: { 
  title?: string
  children: ReactNode
  footer?: ReactNode 
}) {
  return (
    <section className="bg-paper-0 rounded-xl border shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b font-medium text-ink-900">
          {title}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-4 border-t bg-paper-50 text-sm text-ink-600">
          {footer}
        </div>
      )}
    </section>
  )
}
