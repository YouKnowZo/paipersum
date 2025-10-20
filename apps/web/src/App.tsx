import { useState } from 'react'
import AppShell from './components/AppShell'
import Sidebar from './components/Sidebar'
import HeaderBar from './components/HeaderBar'
import Consent from './components/Consent'
import Upload from './components/Upload'
import SummaryPage from './pages/SummaryPage'
import { Card } from './components/Cards'
import { analyzeText, analyzeFile, exportPDF } from './lib/api'
import type { AnalysisT } from './lib/schemas'

export default function App() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyzeText = async () => {
    if (!text.trim()) return
    
    setError('')
    setLoading(true)
    
    try {
      const result = await analyzeText(text)
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    setError('')
    setLoading(true)
    
    try {
      const result = await analyzeFile(file)
      setAnalysis(result)
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
      a.download = 'paipersum-report.pdf'
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
  }

  const header = <HeaderBar />
  
  const sidebar = (
    <div className="space-y-4">
      <Sidebar active="Documents" />
      
      <Card>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">
              Paste Document Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste legal text here... (contracts, waivers, ToS, etc.)"
              className="w-full h-48 border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAnalyzeText}
              disabled={!text.trim() || loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-brand-blue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-blue/90 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze'
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-lg border hover:bg-paper-100 transition-colors"
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
              <span className="bg-paper-0 px-2 text-ink-500">OR</span>
            </div>
          </div>

          <Upload onFileSelect={handleFileSelect} loading={loading} />
        </div>
      </Card>
    </div>
  )

  return (
    <>
      <Consent />
      <AppShell header={header} sidebar={sidebar}>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="font-medium text-red-900 mb-1">Error</h3>
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
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-ink-900 mb-2">No Analysis Yet</h3>
              <p className="text-sm text-ink-600 max-w-md mx-auto">
                Paste legal text or upload a document to get started. We'll analyze it for potential risks and highlight important clauses in plain English.
              </p>
            </div>
          </Card>
        ) : (
          <SummaryPage analysis={analysis} onExport={handleExport} />
        )}

        <footer className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-ink-600 text-center">
            <strong>Legal Disclaimer:</strong> This tool provides automated summaries for informational purposes only and does not constitute legal advice. 
            Automated analysis may miss important clauses or misinterpret legal language. Always consult a licensed attorney for legal decisions.
          </p>
        </footer>
      </AppShell>
    </>
  )
}
