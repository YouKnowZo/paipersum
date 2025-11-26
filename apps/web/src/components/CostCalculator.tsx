import type { CostScenarioT } from '../lib/schemas'

export default function CostCalculator({ scenarios }: { scenarios: CostScenarioT[] }) {
  if (scenarios.length === 0) return null

  const bestScenario = scenarios.find(s => s.is_best)
  const worstScenario = scenarios.reduce((worst, current) => 
    current.cost > worst.cost ? current : worst
  , scenarios[0])
  
  const potentialWaste = worstScenario.cost - (bestScenario?.cost || 0)

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💰</span>
        <h3 className="text-xl font-bold text-ink-900">What This Actually Costs You</h3>
      </div>

      {potentialWaste > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-red-700 mb-1">⚠️ Potential Hidden Cost</div>
              <div className="text-3xl font-bold text-red-700">
                ${potentialWaste.toLocaleString()}
              </div>
              <div className="text-xs text-red-600 mt-1">
                If things don't go perfectly
              </div>
            </div>
            <div className="text-5xl">😰</div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {scenarios.map((scenario, i) => (
          <div 
            key={i}
            className={`p-4 rounded-lg border-2 transition ${
              scenario.is_best 
                ? 'border-brand-green/40 bg-brand-cream' 
                : scenario.warning
                ? 'border-red-300 bg-red-50'
                : 'border-border-200 bg-paper-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-ink-900">{scenario.name}</h4>
                  {scenario.is_best && (
                    <span className="px-2 py-0.5 bg-brand-green text-white text-xs rounded-full font-bold">
                      BEST CASE
                    </span>
                  )}
                  {scenario.warning && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                      TRAP
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-600">{scenario.description}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  scenario.is_best ? 'text-brand-green' :
                  scenario.warning ? 'text-red-700' :
                  'text-ink-900'
                }`}>
                  ${scenario.cost.toLocaleString()}
                </div>
              </div>
            </div>

            {scenario.warning && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{scenario.warning}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Protection tips */}
      {scenarios.some(s => s.warning) && (
        <div className="mt-6 p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-lg">
          <h4 className="font-semibold text-brand-blue mb-2">🛡️ Protect Yourself:</h4>
          <div className="space-y-2 text-sm text-ink-700">
            <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:border-brand-blue transition flex items-center justify-between group">
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Add cancellation deadline to calendar</span>
              </span>
              <svg className="w-5 h-5 text-ink-400 group-hover:text-brand-blue group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:border-brand-blue transition flex items-center justify-between group">
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Email reminder 60 days before renewal</span>
              </span>
              <svg className="w-5 h-5 text-ink-400 group-hover:text-brand-blue group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {points.map((point, i) => (
          <div key={i} className="border-2 border-brand-blue/20 rounded-lg p-4 bg-gradient-to-br from-white to-brand-cream/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-ink-900 mb-1">{point.clause_title}</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">✗</span>
                    <span className="text-ink-600">Currently: {point.current_term}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    <span className="text-ink-600">Suggest: {point.suggested_term}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-ink-500">Success Rate</div>
                <div className="text-2xl font-bold text-brand-green">
                  {Math.round(point.success_rate * 100)}%
                </div>
              </div>
            </div>

            {/* Email preview */}
            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-brand-blue hover:text-brand-blue/80 transition flex items-center gap-2">
                <svg className="w-4 h-4 group-open:rotate-90 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                View email template
              </summary>
              
              <div className="mt-3 p-3 bg-ink-900 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-brand-green font-mono">Email Preview:</span>
                  <button
                    onClick={() => copyToClipboard(point.email_template, i + 100)}
                    className={`px-2 py-1 rounded text-xs font-bold transition ${
                      copied === i + 100
                        ? 'bg-brand-green text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {copied === i + 100 ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs text-brand-green font-mono whitespace-pre-wrap overflow-x-auto">
{point.email_template}
                </pre>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
