import type { ClauseT } from '../lib/schemas'

export default function ClauseCard({ 
  title, 
  summary, 
  risk, 
  citation 
}: ClauseT) {
  const riskConfig = {
    red: { 
      dot: 'bg-danger-500', 
      border: 'border-danger-200', 
      bg: 'bg-danger-50',
      label: 'High Risk'
    },
    yellow: { 
      dot: 'bg-warning-500', 
      border: 'border-warning-200', 
      bg: 'bg-warning-50',
      label: 'Medium Risk'
    },
    green: { 
      dot: 'bg-success-500', 
      border: 'border-success-200', 
      bg: 'bg-success-50',
      label: 'Low Risk'
    },
  }

  const config = riskConfig[risk] || riskConfig.yellow

  return (
    <div className={`p-4 border ${config.border} rounded-xl ${config.bg} hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full ${config.dot} mt-1.5 flex-shrink-0`} 
             title={config.label} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{summary}</p>
          <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg">
            <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-xs text-slate-500 italic line-clamp-2">
              "{citation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
