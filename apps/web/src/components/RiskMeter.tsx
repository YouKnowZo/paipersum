export function RiskMeter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score))
  const label = pct >= 75 ? 'High' : pct >= 50 ? 'Moderate' : pct >= 25 ? 'Low' : 'Minimal'
  const color = pct >= 75 ? 'bg-brand-red' : pct >= 50 ? 'bg-brand-yellow' : 'bg-brand-green'
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Risk</span>
        <span>{pct} · {label}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded">
        <div className={`h-3 ${color} rounded`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
