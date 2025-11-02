import { useState, useEffect } from 'react'
import DocumentChat from './DocumentChat'
import DocumentViewer from './DocumentViewer'
import { summarizeFile, getSummaryStyles, type SummarizeResponse, type SummaryStyle, highlightDocument } from '../lib/api'
import type { EnhancedAnalysisT } from '../lib/schemas'

interface UniversalSummarizerProps {
  onSummaryGenerated?: (summary: SummarizeResponse) => void
  onAnalysisGenerated?: (analysis: EnhancedAnalysisT) => void
}

export default function UniversalSummarizer({ onSummaryGenerated, onAnalysisGenerated }: UniversalSummarizerProps) {
  const [mode, setMode] = useState<'universal' | 'legal'>('universal')
  const [style, setStyle] = useState<string>('concise')
  const [styles, setStyles] = useState<SummaryStyle[]>([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<SummarizeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [documentText, setDocumentText] = useState<string>('')
  const [showChat, setShowChat] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [highlights, setHighlights] = useState<any>(null)

  const loadStyles = async (mode: 'universal' | 'legal') => {
    try {
      const result = await getSummaryStyles(mode)
      setStyles(result.styles)
      if (result.styles.length > 0 && !result.styles.find(s => s.id === style)) {
        setStyle(result.styles[0].id)
      }
    } catch (err) {
      console.error('Failed to load styles:', err)
    }
  }

  useEffect(() => {
    loadStyles(mode)
  }, [mode])

  const handleModeChange = (newMode: 'universal' | 'legal') => {
    setMode(newMode)
    setSummary(null)
    setError(null)
    setDocumentText('')
    setHighlights(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      // Read file text for chat/viewer
      const text = await file.text()
      setDocumentText(text)

      // Summarize
      const result = await summarizeFile(file, { mode, style })
      setSummary(result)
      onSummaryGenerated?.(result)

      // If legal mode, also highlight
      if (mode === 'legal') {
        try {
          const highlightData = await highlightDocument(text)
          setHighlights(highlightData)
        } catch (err) {
          console.error('Failed to highlight:', err)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-4">
        <button
          onClick={() => handleModeChange('universal')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            mode === 'universal'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Universal Summarization
        </button>
        <button
          onClick={() => handleModeChange('legal')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            mode === 'legal'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Legal Analysis
        </button>
      </div>

      {/* Style Selection */}
      {styles.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Summary Style:</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          className="hidden"
          id="file-upload"
          disabled={loading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-lg font-semibold text-gray-700 mb-2">
            {loading ? 'Processing...' : 'Upload Document'}
          </span>
          <span className="text-sm text-gray-500">
            PDF, DOCX, Images, or Text files
          </span>
        </label>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Summary Display */}
      {summary && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Summary</h3>
            <div className="flex gap-2">
              {documentText && (
                <>
                  <button
                    onClick={() => setShowChat(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                  >
                    ?? Ask Questions
                  </button>
                  {mode === 'legal' && highlights && (
                    <button
                      onClick={() => setShowViewer(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                    >
                      ??? View Document
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
            <span>Mode: <strong>{summary.mode}</strong></span>
            <span>Style: <strong>{summary.style}</strong></span>
            <span>Sources: <strong>{summary.sources_count}</strong></span>
          </div>
        </div>
      )}

      {/* Document Chat Modal */}
      {showChat && (
        <DocumentChat
          documentText={documentText}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Document Viewer Modal */}
      {showViewer && highlights && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-6xl my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Document Viewer</h2>
              <button
                onClick={() => setShowViewer(false)}
                className="hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <DocumentViewer
                text={highlights.text}
                analysis={{ clauses: highlights.highlights.map((h: any) => ({
                  title: h.clause_type,
                  summary: h.explanation,
                  risk: h.risk,
                  citation: h.text
                })) } as any}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
