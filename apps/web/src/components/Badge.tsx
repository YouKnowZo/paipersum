export function RiskDot({ risk }: { risk: 'green' | 'yellow' | 'red' }) {
  const colors = {
    green: 'bg-success-500',
    yellow: 'bg-warning-500',
    red: 'bg-danger-500'
  }
  
  const labels = {
    green: 'Low risk',
    yellow: 'Moderate risk',
    red: 'High risk'
  }

  return (
    <span 
      className={`inline-block w-2.5 h-2.5 rounded-full ${colors[risk]}`} 
      aria-label={labels[risk]}
      role="img"
    />
  )
}

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  
  const getVariant = () => {
    if (pct >= 75) return 'badge-success'
    if (pct >= 50) return 'badge-warning'
    return 'badge-danger'
  }
  
  return (
    <span className={`badge ${getVariant()}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      {pct}% Confidence
    </span>
  )
}
