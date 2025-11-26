import type { RecommendationT } from '../lib/schemas'

export default function DecisionCard({ recommendation }: { recommendation: RecommendationT }) {
  const { decision, confidence, reasoning, action_items, cost_impact } = recommendation

  const config = {
    sign: {
      icon: '✅',
      title: 'SAFE TO SIGN',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      emoji: '😊'
    },
    negotiate: {
      icon: '⚠️',
      title: 'NEGOTIATE FIRST',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      emoji: '🤝'
    },
    walk_away: {
      icon: '🚨',
      title: 'DON\'T SIGN - WALK AWAY',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      emoji: '🚫'
    }
  }

  const { icon, title, color, bgColor, borderColor, textColor, emoji } = config[decision]

  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-xl p-6 shadow-lg animate-in slide-in-from-bottom-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg text-2xl`}>
            {emoji}
          </div>
          <div>
            <div className={`text-2xl font-bold ${textColor}`}>{title}</div>
            <div className="text-sm text-ink-600">
              {Math.round(confidence * 100)}% confidence
            </div>
          </div>
        </div>
        
        {cost_impact > 0 && (
          <div className="text-right">
            <div className="text-sm text-ink-600">Potential Impact</div>
            <div className="text-2xl font-bold text-brand-green">
              ${cost_impact.toLocaleString()}
            </div>
            <div className="text-xs text-ink-500">saved/at risk</div>
          </div>
        )}
      </div>

      {/* Reasoning */}
      <div className={`p-4 bg-white rounded-lg mb-4 border ${borderColor}`}>
        <h4 className="font-semibold text-ink-900 mb-2">Why?</h4>
        <p className="text-ink-700 leading-relaxed">{reasoning}</p>
      </div>

      {/* Action items */}
      <div>
        <h4 className="font-semibold text-ink-900 mb-3">
          {decision === 'sign' ? '✓ Next Steps:' : '⚡ Action Required:'}
        </h4>
        <div className="space-y-2">
          {action_items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full ${
                decision === 'sign' ? 'bg-green-100 text-green-700' :
                decision === 'negotiate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              } flex items-center justify-center text-sm font-bold`}>
                {i + 1}
              </span>
              <span className="text-ink-700 flex-1">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA based on decision */}
      <div className="mt-6 flex gap-3">
        {decision === 'negotiate' && (
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-blue-light text-white rounded-lg font-semibold hover:shadow-lg transition">
            📧 Get Negotiation Templates
          </button>
        )}
        {decision === 'walk_away' && (
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-blue-light text-white rounded-lg font-semibold hover:shadow-lg transition">
            🔍 Find Better Alternatives
          </button>
        )}
        {decision === 'sign' && (
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-green to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
            📅 Set Calendar Reminders
          </button>
        )}
      </div>
    </div>
  )
}
