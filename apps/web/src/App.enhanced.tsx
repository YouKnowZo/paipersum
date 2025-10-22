import { useState, useEffect } from 'react'
import Logo from './components/Logo'
import Hero from './components/Hero'
import InstantAnalysis from './components/InstantAnalysis'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import FloatingChatbot from './components/FloatingChatbot'
import Consent from './components/Consent'
import Upload from './components/Upload'
import SummaryPage from './pages/SummaryPage'
import { Card } from './components/Cards'
import { analyzeText, analyzeFile, exportPDF } from './lib/api'
import type { AnalysisT } from './lib/schemas'

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [text, setText] = useState('')
  const [documentsAnalyzed, setDocumentsAnalyzed] = useState(0)

  // Track usage for gamification
  useEffect(() => {
    const count = parseInt(localStorage.getItem('docs_analyzed') || '0')
    setDocumentsAnalyzed(count)
  }, [])

  const handleAnalyzeText = async (textToAnalyze: string = text) => {
    if (!textToAnalyze.trim()) return
    
    setError('')
    setLoading(true)
    setShowAnalyzer(true)
    
    try {
      const result = await analyzeText(textToAnalyze)
      setAnalysis(result)
      
      // Track for gamification
      const newCount = documentsAnalyzed + 1
      setDocumentsAnalyzed(newCount)
      localStorage.setItem('docs_analyzed', newCount.toString())
      
      // Show achievement on milestones
      if (newCount === 1) {
        setTimeout(() => alert('🎉 First analysis complete! You\'re protecting yourself!'), 500)
      } else if (newCount === 5) {
        setTimeout(() => alert('🏆 5 documents analyzed! You\'re becoming a pro!'), 500)
      } else if (newCount === 10) {
        setTimeout(() => alert('💎 10 documents! You\'ve saved yourself from countless traps!'), 500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    setError('')
    setLoading(true)
    setShowAnalyzer(true)
    
    try {
      const result = await analyzeFile(file)
      setAnalysis(result)
      
      const newCount = documentsAnalyzed + 1
      setDocumentsAnalyzed(newCount)
      localStorage.setItem('docs_analyzed', newCount.toString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!text.trim()) return
    
    try {
      const blob = await exportPDF(text)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `paipersum-report-${Date.now()}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Export failed')
    }
  }

  const handleClear = () => {
    setText('')
    setAnalysis(null)
    setError('')
    setShowAnalyzer(false)
  }

  // Show landing page by default
  if (!showAnalyzer) {
    return (
      <>
        <Consent />
        <FloatingChatbot />
        
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-border-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Logo size="md" />
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAnalyzer(true)}
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue/90 transition"
                >
                  Analyze Document
                </button>
              </div>
            </div>
          </nav>

          {/* Hero section */}
          <Hero onAnalyze={handleAnalyzeText} />

          {/* Instant analysis examples */}
          <InstantAnalysis />

          {/* Features */}
          <Features />

          {/* Testimonials */}
          <Testimonials />

          {/* CTA section */}
          <div className="bg-gradient-to-br from-brand-blue to-blue-900 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Stop Getting Scammed?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands who analyze before they sign
              </p>
              <button
                onClick={() => setShowAnalyzer(true)}
                className="px-8 py-4 bg-white text-brand-blue rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl hover:scale-105"
              >
                Analyze Your First Document Free →
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-ink-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <Logo size="md" />
                  <p className="text-sm text-ink-300 mt-4">
                    Understand legal documents in plain English.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-ink-300">
                    <li><a href="#features" className="hover:text-white">Features</a></li>
                    <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                    <li><a href="#examples" className="hover:text-white">Examples</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-ink-300">
                    <li><a href="/terms.html" className="hover:text-white">Terms of Service</a></li>
                    <li><a href="/privacy.html" className="hover:text-white">Privacy Policy</a></li>
                    <li><a href="#disclaimer" className="hover:text-white">Disclaimer</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Connect</h4>
                  <ul className="space-y-2 text-sm text-ink-300">
                    <li><a href="https://twitter.com/paipersum" className="hover:text-white">Twitter</a></li>
                    <li><a href="https://linkedin.com/company/paipersum" className="hover:text-white">LinkedIn</a></li>
                    <li><a href="mailto:hello@paipersum.com" className="hover:text-white">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-ink-700 pt-8 text-center text-sm text-ink-400">
                <p>© 2025 PaiperSum. Not legal advice. Always consult an attorney for legal decisions.</p>
              </div>
            </div>
          </footer>
        </div>
      </>
    )
  }

  // Analyzer view
  return (
    <>
      <Consent />
      <FloatingChatbot />
      
      <div className="min-h-screen bg-paper-50">
        {/* Top bar with progress */}
        <nav className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleClear}
                className="text-ink-600 hover:text-ink-900 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>

            <Logo size="sm" />

            {/* Progress badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 rounded-full">
                <span className="text-sm font-semibold text-brand-blue">{documentsAnalyzed}</span>
                <span className="text-xs text-ink-600">analyzed</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input column */}
            <div className="lg:col-span-1">
              <Card>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">
                      📝 Paste Document Text
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your contract, ToS, waiver, or any legal document here..."
                      className="w-full h-48 border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnalyzeText()}
                      disabled={!text.trim() || loading}
                      className="flex-1 px-4 py-3 rounded-lg bg-brand-blue text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-blue/90 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Analyze</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-4 py-3 rounded-lg border hover:bg-paper-100 transition"
                      disabled={loading}
                    >
                      Clear
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-ink-500">OR</span>
                    </div>
                  </div>

                  <Upload onFileSelect={handleFileSelect} loading={loading} />
                </div>
              </Card>
            </div>

            {/* Results column */}
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-4">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {!analysis ? (
                <Card>
                  <div className="text-center py-16">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-blue/20 to-brand-blue/10 rounded-full">
                      <svg className="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-ink-900 mb-2">Ready to Analyze</h3>
                    <p className="text-ink-600 max-w-md mx-auto mb-6">
                      Paste legal text or upload a document to get instant analysis with risk scores and plain-English explanations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-ink-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>3-second analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>14 risk types</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Export PDF</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="animate-in slide-in-from-bottom-4">
                  <SummaryPage analysis={analysis} onExport={handleExport} />
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-xs text-ink-700">
                  <strong>⚠️ Legal Disclaimer:</strong> This tool provides automated analysis for informational purposes only and does not constitute legal advice. Always consult a licensed attorney for legal decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
