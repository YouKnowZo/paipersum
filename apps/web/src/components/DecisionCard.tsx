import type { RecommendationT } from '../lib/schemas'

export default function DecisionCard({ recommendation }: { recommendation: RecommendationT }) {
  const { decision, confidence, reasoning, action_items, cost_impact } = recommendation

  const config = {
    sign: {
      title: 'Safe to Sign',
      subtitle: 'This document looks reasonable',
      gradient: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      textColor: 'text-success-700',
      iconBg: 'bg-success-100',
      icon: (
        <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    negotiate: {
      title: 'Negotiate First',
      subtitle: 'Some clauses need attention',
      gradient: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      textColor: 'text-warning-700',
      iconBg: 'bg-warning-100',
      icon: (
        <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    walk_away: {
      title: 'Don\'t Sign',
      subtitle: 'Significant risks detected',
      gradient: 'from-danger-500 to-danger-600',
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-200',
      textColor: 'text-danger-700',
      iconBg: 'bg-danger-100',
      icon: (
        <svg className="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    }
  }

  const { title, subtitle, gradient, bgColor, borderColor, textColor, iconBg, icon } = config[decision]

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl p-6 animate-fade-in-up`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-2xl font-display font-bold ${textColor}`}>{title}</h3>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-slate-500 mb-1">Confidence</div>
          <div className={`text-lg font-bold ${textColor}`}>
            {Math.round(confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Cost impact */}
      {cost_impact > 0 && (
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 mb-6">
          <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-500">Potential Financial Impact</div>
            <div className="text-2xl font-display font-bold text-brand-teal">
              ${cost_impact.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Reasoning */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 mb-6">
        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Summary
        </h4>
        <p className="text-slate-600 leading-relaxed">{reasoning}</p>
      </div>

      {/* Action items */}
      {action_items.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Recommended Actions
          </h4>
          <div className="space-y-2">
            {action_items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full ${iconBg} ${textColor} 
                                flex items-center justify-center text-xs font-bold`}>
                  {i + 1}
                </span>
                <span className="text-slate-700 flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA based on decision */}
      <div className="mt-6 flex flex-wrap gap-3">
        {decision === 'negotiate' && (
          <button className={`flex-1 btn bg-gradient-to-r ${gradient} text-white py-3`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get Negotiation Templates
          </button>
        )}
        {decision === 'walk_away' && (
          <button className={`flex-1 btn bg-gradient-to-r ${gradient} text-white py-3`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Alternatives
          </button>
        )}
        {decision === 'sign' && (
          <button className={`flex-1 btn bg-gradient-to-r ${gradient} text-white py-3`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Set Calendar Reminders
          </button>
        )}
      </div>
    </div>
  )
}
