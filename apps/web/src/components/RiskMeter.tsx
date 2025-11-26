export function RiskMeter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score))
  const label = pct >= 75 ? 'High Risk' : pct >= 50 ? 'Moderate Risk' : pct >= 25 ? 'Low Risk' : 'Minimal Risk'
  const color = pct >= 75 ? 'bg-brand-red' : pct >= 50 ? 'bg-brand-yellow' : 'bg-brand-green'
  const textColor = pct >= 75 ? 'text-brand-red' : pct >= 50 ? 'text-brand-yellow' : 'text-brand-green'

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-ink-600 font-medium">Risk Assessment</span>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${textColor}`}>{pct}</span>
          <span className="text-ink-500">·</span>
          <span className={`font-medium ${textColor}`}>{label}</span>
        </div>
      </div>
      <div className="h-4 bg-paper-100 rounded-lg overflow-hidden shadow-inner">
        <div 
          className={`h-4 ${color} rounded-lg transition-all duration-500 ease-out`} 
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Risk score: ${pct} out of 100, ${label}`}
        />
      </div>
      <div className="flex justify-between text-xs text-ink-500 mt-1 px-0.5">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  )
}
