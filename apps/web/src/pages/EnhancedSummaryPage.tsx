import { RiskMeter } from '../components/RiskMeter'
import DecisionCard from '../components/DecisionCard'
import BenchmarkComparison from '../components/BenchmarkComparison'
import NegotiationTemplates from '../components/NegotiationTemplates'
import CostCalculator from '../components/CostCalculator'
import ShareableResults from '../components/ShareableResults'
import EverydayIntegration from '../components/EverydayIntegration'
import ClauseCard from '../components/ClauseCard'
import { Card } from '../components/Cards'
import type { EnhancedAnalysisT } from '../lib/schemas'

interface EnhancedSummaryPageProps {
  analysis: EnhancedAnalysisT
  onExport?: () => void
  documentName?: string
}

export default function EnhancedSummaryPage({ 
  analysis, 
  onExport,
  documentName = 'Document'
}: EnhancedSummaryPageProps) {
  const { risk_score, confidence, clauses, recommendation, benchmarks, negotiation_points, cost_scenarios } = analysis

  // Calculate renewal date (example: 1 year from now)
  const renewalDate = new Date()
  renewalDate.setFullYear(renewalDate.getFullYear() + 1)
  
  const cancellationDeadline = new Date(renewalDate)
  cancellationDeadline.setDate(cancellationDeadline.getDate() - 60) // 60 days before

  return (
    <div className="space-y-6">
      {/* Main Decision */}
      <DecisionCard recommendation={recommendation} />

      {/* Risk Overview */}
      <Card title="📊 Risk Analysis">
        <RiskMeter score={risk_score} />
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-ink-600">
            Analysis Confidence: <span className="font-semibold">{Math.round(confidence * 100)}%</span>
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="text-sm px-4 py-2 bg-paper-100 hover:bg-paper-200 border rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Full Report
            </button>
          )}
        </div>
      </Card>

      {/* Benchmarks */}
      {benchmarks.length > 0 && (
        <BenchmarkComparison benchmarks={benchmarks} />
      )}

      {/* Cost Scenarios */}
      {cost_scenarios.length > 0 && (
        <CostCalculator scenarios={cost_scenarios} />
      )}

      {/* Negotiation */}
      {negotiation_points.length > 0 && (
        <NegotiationTemplates points={negotiation_points} />
      )}

      {/* All Clauses */}
      <Card title={`🔍 All ${clauses.length} Clauses Detected`}>
        {clauses.length === 0 ? (
          <div className="text-center py-8 text-ink-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold">No significant clauses detected</p>
            <p className="text-xs mt-1">This document appears to be straightforward</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {clauses.map((clause, i) => (
              <ClauseCard key={i} {...clause} />
            ))}
          </div>
        )}
      </Card>

      {/* Everyday Integration */}
      <EverydayIntegration 
        documentName={documentName}
        renewalDate={renewalDate}
        cancellationDeadline={cancellationDeadline}
      />

      {/* Share */}
      <ShareableResults analysis={analysis} />
    </div>
  )
}
