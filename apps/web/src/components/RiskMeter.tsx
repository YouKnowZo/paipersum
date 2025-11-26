export function RiskMeter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score))
  const label = pct >= 75 ? 'High Risk' : pct >= 50 ? 'Moderate Risk' : pct >= 25 ? 'Low Risk' : 'Minimal Risk'
  
  const getColor = () => {
    if (pct >= 75) return { bg: 'bg-danger-500', text: 'text-danger-600' }
    if (pct >= 50) return { bg: 'bg-warning-500', text: 'text-warning-600' }
    return { bg: 'bg-success-500', text: 'text-success-600' }
  }
  
  const { bg, text } = getColor()

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-sm font-medium text-slate-600">Risk Assessment</span>
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-display font-bold ${text}`}>{pct}</span>
          <span className={`badge ${
            pct >= 75 ? 'badge-danger' : 
            pct >= 50 ? 'badge-warning' : 
            'badge-success'
          }`}>
            {label}
          </span>
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${bg} rounded-full transition-all duration-700 ease-out animate-fill-right`} 
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Risk score: ${pct} out of 100, ${label}`}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        <span>Safe</span>
        <span>Moderate</span>
        <span>High Risk</span>
      </div>
    </div>
  )
}
