import { RiskDot } from './Badge'
import type { ClauseT } from '../lib/schemas'

export default function ClauseCard({ 
  title, 
  summary, 
  risk, 
  citation 
}: ClauseT) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md hover:border-brand-blue/30 transition-all duration-200 bg-paper-0">
      <div className="flex items-start gap-3">
        <div className="mt-1.5">
          <RiskDot risk={risk} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-ink-900 mb-2">{title}</h4>
          <p className="text-sm text-ink-600 leading-relaxed mb-3">{summary}</p>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-ink-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-ink-500 italic font-legal line-clamp-2">
              "{citation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
