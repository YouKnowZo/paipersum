import type { BenchmarkT } from '../lib/schemas'
import { Card } from './Cards'

export default function BenchmarkComparison({ benchmarks }: { benchmarks: BenchmarkT[] }) {
  if (benchmarks.length === 0) return null

  return (
    <Card title="Market Comparison">
      <p className="text-sm text-slate-600 mb-6">
        Based on our analysis of thousands of similar documents, here's how this contract compares:
      </p>

      <div className="space-y-4">
        {benchmarks.map((benchmark, i) => {
          const percentile = benchmark.percentile
          const isBad = percentile > 70
          const isGood = percentile < 40
          
          return (
            <div key={i} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-slate-900 capitalize">
                  {benchmark.metric.replace(/_/g, ' ')}
                </span>
                <span className={`badge ${
                  isGood ? 'badge-success' :
                  isBad ? 'badge-danger' :
                  'badge-warning'
                }`}>
                  {isGood ? 'Good Deal' : isBad ? 'Above Average' : 'Average'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Your Contract</div>
                  <div className="text-lg font-bold text-slate-900">{benchmark.your_value}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Market Average</div>
                  <div className="text-lg font-bold text-slate-600">{benchmark.average_value}</div>
                </div>
              </div>

              {/* Percentile bar */}
              <div className="relative">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Better than average</span>
                  <span>Worse than average</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-success-200 via-warning-200 to-danger-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full flex items-center justify-end"
                    style={{ width: `${percentile}%` }}
                  >
                    <div className="w-3 h-3 bg-slate-800 rounded-full border-2 border-white shadow"></div>
                  </div>
                </div>
                <div className="text-xs text-center text-slate-500 mt-2">
                  {isBad ? 'More expensive than' : isGood ? 'Better than' : 'Similar to'} {percentile}% of contracts
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-brand-sky/5 border border-brand-sky/20 rounded-xl">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Pro tip:</span> Show these comparisons when negotiating. 
          Companies often match market standards when you have data.
        </p>
      </div>
    </Card>
  )
}
