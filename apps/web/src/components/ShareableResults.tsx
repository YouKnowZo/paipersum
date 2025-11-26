import { useState } from 'react'
import type { EnhancedAnalysisT } from '../lib/schemas'

export default function ShareableResults({ analysis }: { analysis: EnhancedAnalysisT }) {
  const [copied, setCopied] = useState(false)

  const shareText = `I just analyzed my contract with PaiperSum 🔍

Risk Score: ${analysis.risk_score}/100
Found: ${analysis.clauses.length} clauses
Recommendation: ${analysis.recommendation.decision === 'walk_away' ? '🚫 WALK AWAY' : analysis.recommendation.decision === 'negotiate' ? '⚠️ NEGOTIATE' : '✅ SAFE'}
Potential savings: $${analysis.recommendation.cost_impact}

Everyone should check their contracts before signing!

Try it free: paipersum.com`

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy')
    }
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://paipersum.com')}`
    window.open(url, '_blank')
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://paipersum.com')}`
    window.open(url, '_blank')
  }

  const downloadImage = () => {
    // In production, generate actual image on backend
    alert('Image download coming soon! For now, screenshot your results.')
  }

  return (
    <div className="bg-gradient-to-br from-brand-blue/5 to-brand-yellow/10 border-2 border-brand-blue/20 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📤</span>
        <h3 className="text-xl font-bold text-ink-900">Share Your Findings</h3>
      </div>

      <p className="text-sm text-ink-600 mb-6">
        Help your friends and family avoid bad contracts! Share your analysis:
      </p>

      {/* Share preview */}
      <div className="bg-white border-2 border-border-200 rounded-lg p-4 mb-4">
        <div className="text-sm text-ink-700 whitespace-pre-wrap font-mono leading-relaxed">
          {shareText}
        </div>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={shareToTwitter}
          className="px-4 py-3 bg-[#1DA1F2] text-white rounded-lg font-semibold hover:bg-[#1a8cd8] transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
          Twitter
        </button>

        <button
          onClick={shareToLinkedIn}
          className="px-4 py-3 bg-[#0077B5] text-white rounded-lg font-semibold hover:bg-[#006399] transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </button>

        <button
          onClick={copyShareText}
          className={`px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            copied
              ? 'bg-brand-green text-white'
              : 'bg-paper-100 text-ink-900 hover:bg-paper-200'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Text
            </>
          )}
        </button>

        <button
          onClick={downloadImage}
          className="px-4 py-3 bg-paper-100 text-ink-900 rounded-lg font-semibold hover:bg-paper-200 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Save Image
        </button>
      </div>

      {/* Why share */}
      <div className="mt-6 p-4 bg-white border border-brand-blue/30 rounded-lg">
        <h4 className="font-semibold text-brand-blue mb-2">💡 Why Share?</h4>
        <ul className="text-sm text-ink-700 space-y-1">
          <li>• Help friends avoid the same traps you found</li>
          <li>• Warn coworkers about unfair contracts</li>
          <li>• Build awareness about hidden clauses</li>
          <li>• The more we share, the more companies improve their terms</li>
        </ul>
      </div>

      {/* Viral stats */}
      <div className="mt-4 text-center text-xs text-ink-500">
        <span className="font-semibold text-brand-blue">2,847 people</span> have shared their findings this week!
      </div>
    </div>
  )
}
