import type { CostScenarioT } from '../lib/schemas'
import { Card } from './Cards'

export default function CostCalculator({ scenarios }: { scenarios: CostScenarioT[] }) {
  if (scenarios.length === 0) return null

  const bestScenario = scenarios.find(s => s.is_best)
  const worstScenario = scenarios.reduce((worst, current) => 
    (current.cost > (worst?.cost ?? 0)) ? current : worst
  , scenarios[0])
  
  const potentialWaste = (worstScenario?.cost ?? 0) - (bestScenario?.cost ?? 0)

  return (
    <Card title="Cost Analysis">
      {potentialWaste > 0 && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-danger-600 font-medium mb-1">Potential Hidden Cost</div>
              <div className="text-3xl font-display font-bold text-danger-700">
                ${potentialWaste.toLocaleString()}
              </div>
              <div className="text-xs text-danger-600 mt-1">
                If things don't go perfectly
              </div>
            </div>
            <div className="w-14 h-14 bg-danger-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {scenarios.map((scenario, i) => (
          <div 
            key={i}
            className={`p-4 rounded-xl border transition ${
              scenario.is_best 
                ? 'border-success-300 bg-success-50' 
                : scenario.warning
                ? 'border-danger-300 bg-danger-50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">{scenario.name}</h4>
                  {scenario.is_best && (
                    <span className="badge-success">Best Case</span>
                  )}
                  {scenario.warning && (
                    <span className="badge-danger">Warning</span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{scenario.description}</p>
              </div>
              <div className="text-right pl-4">
                <div className={`text-2xl font-display font-bold ${
                  scenario.is_best ? 'text-success-700' :
                  scenario.warning ? 'text-danger-700' :
                  'text-slate-900'
                }`}>
                  ${scenario.cost.toLocaleString()}
                </div>
              </div>
            </div>

            {scenario.warning && (
              <div className="mt-3 pt-3 border-t border-danger-200">
                <div className="flex items-start gap-2 text-sm text-danger-700">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{scenario.warning}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Protection tips */}
      {scenarios.some(s => s.warning) && (
        <div className="mt-6 p-4 bg-brand-sky/5 border border-brand-sky/20 rounded-xl">
          <h4 className="font-semibold text-slate-900 mb-3">Protect Yourself</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 bg-white rounded-lg border border-slate-200 
                             hover:border-brand-sky transition flex items-center justify-between group">
              <span className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-brand-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-700">Add cancellation deadline to calendar</span>
              </span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-brand-sky group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button className="w-full text-left px-4 py-3 bg-white rounded-lg border border-slate-200 
                             hover:border-brand-sky transition flex items-center justify-between group">
              <span className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-brand-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-slate-700">Set email reminder 60 days before renewal</span>
              </span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-brand-sky group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
