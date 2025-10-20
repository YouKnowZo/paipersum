import { RiskMeter } from '../components/RiskMeter'
import { ConfidenceBadge } from '../components/Badge'
import ClauseCard from '../components/ClauseCard'
import { Card } from '../components/Cards'
import type { AnalysisT } from '../lib/schemas'

interface SummaryPageProps {
  analysis: AnalysisT
  onExport?: () => void
}

export default function SummaryPage({ analysis, onExport }: SummaryPageProps) {
  const { risk_score, confidence, clauses } = analysis
  const topClauses = clauses.slice(0, 6)

  return (
    <div className="space-y-6">
      <Card title="📊 Risk Assessment">
        <div className="space-y-4">
          <RiskMeter score={risk_score} />
          <div className="flex items-center justify-between pt-2">
            <ConfidenceBadge confidence={confidence} />
            {onExport && (
              <button
                onClick={onExport}
                className="text-sm px-4 py-2 bg-paper-100 hover:bg-paper-100/80 border rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card title={`🔍 Key Clauses (${clauses.length} found)`}>
        {clauses.length === 0 ? (
          <div className="text-center py-8 text-ink-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No significant clauses detected</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {topClauses.map((clause, i) => (
              <ClauseCard key={i} {...clause} />
            ))}
          </div>
        )}
        
        {clauses.length > 6 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-brand-blue hover:underline font-medium">
              View all {clauses.length} clauses →
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
