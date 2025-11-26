import { useState } from 'react'
import type { NegotiationPointT } from '../lib/schemas'
import { Card } from './Cards'

export default function NegotiationTemplates({ points }: { points: NegotiationPointT[] }) {
  const [copied, setCopied] = useState<number | null>(null)

  if (points.length === 0) return null

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(index)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      alert('Failed to copy. Please select and copy manually.')
    }
  }

  const importanceConfig = {
    critical: { label: 'Must Negotiate', badge: 'badge-danger' },
    important: { label: 'Should Negotiate', badge: 'badge-warning' },
    nice_to_have: { label: 'Worth Asking', badge: 'badge-info' }
  }

  const avgSuccessRate = Math.round(points.reduce((acc, p) => acc + p.success_rate, 0) / points.length * 100)

  return (
    <Card title="Negotiation Templates">
      <p className="text-sm text-slate-600 mb-6">
        Ready-to-use email templates with a <span className="font-semibold text-brand-teal">{avgSuccessRate}% average success rate</span>.
      </p>

      <div className="space-y-6">
        {points.map((point, i) => {
          const config = importanceConfig[point.importance as keyof typeof importanceConfig] || importanceConfig.important

          return (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className={config.badge}>{config.label}</span>
                  <span className="badge-success">
                    {Math.round(point.success_rate * 100)}% success rate
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-3">{point.clause_title}</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                    <div className="text-xs text-danger-600 font-medium mb-1">Current Term</div>
                    <div className="text-danger-700">{point.current_term}</div>
                  </div>
                  <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                    <div className="text-xs text-success-600 font-medium mb-1">Suggested Term</div>
                    <div className="text-success-700">{point.suggested_term}</div>
                  </div>
                </div>
              </div>

              {/* Email template */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Template</span>
                  <button
                    onClick={() => copyToClipboard(point.email_template, i)}
                    className={`btn-sm ${copied === i ? 'btn-accent' : 'btn-secondary'}`}
                  >
                    {copied === i ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap font-mono">
{point.email_template}
                </pre>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-brand-sky/5 border border-brand-sky/20 rounded-xl">
        <h4 className="font-semibold text-slate-900 mb-2">Negotiation Tips</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Be polite but firm—you're a customer, not asking for a favor</li>
          <li>• Reference market standards when possible</li>
          <li>• Ask for all changes at once for a better package deal</li>
        </ul>
      </div>
    </Card>
  )
}
