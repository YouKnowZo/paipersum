import type { BenchmarkT } from '../lib/schemas'

export default function BenchmarkComparison({ benchmarks }: { benchmarks: BenchmarkT[] }) {
  if (benchmarks.length === 0) return null

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold text-ink-900">How Does This Compare?</h3>
      </div>
      
      <p className="text-sm text-ink-600 mb-4">
        We've analyzed thousands of similar documents. Here's how yours stacks up:
      </p>

      <div className="space-y-4">
        {benchmarks.map((benchmark, i) => {
          const percentile = benchmark.percentile
          const isBad = percentile > 70
          const isGood = percentile < 40
          
          return (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-ink-900 capitalize">
                  {benchmark.metric.replace(/_/g, ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isGood ? 'bg-brand-green/10 text-brand-green' :
                  isBad ? 'bg-brand-red/10 text-brand-red' :
                  'bg-brand-yellow/20 text-brand-amber'
                }`}>
                  {isGood ? '✓ Good Deal' : isBad ? '✗ Above Average' : '≈ Average'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-ink-500 mb-1">Your Contract</div>
                  <div className="text-lg font-bold text-ink-900">{benchmark.your_value}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-500 mb-1">Market Average</div>
                  <div className="text-lg font-bold text-ink-600">{benchmark.average_value}</div>
                </div>
              </div>

              {/* Percentile bar */}
              <div className="relative">
                <div className="flex justify-between text-xs text-ink-500 mb-1">
                  <span>Better</span>
                  <span>Worse</span>
                </div>
                <div className="h-3 bg-gradient-to-r from-brand-green/30 via-brand-yellow/25 to-brand-red/30 rounded-full overflow-hidden">
                  <div 
                    className="h-3 flex items-center justify-end pr-1"
                    style={{ width: `${percentile}%` }}
                  >
                    <div className="w-1 h-full bg-ink-900 rounded-full"></div>
                  </div>
                </div>
                <div className="text-xs text-center text-ink-600 mt-1">
                  {isBad ? 'Worse than' : isGood ? 'Better than' : 'Similar to'} {percentile}% of contracts
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-sm text-ink-600">
          💡 <strong>Pro tip:</strong> Show these comparisons when negotiating. 
          Companies often match market standards if you ask.
        </p>
      </div>
    </div>
  )
}
