import { useState, useEffect } from 'react'
import { summarizeFile, getSummaryStyles, type SummarizeResponse, type SummaryStyle } from '../lib/api'

interface UniversalSummarizerProps {
  onSummaryGenerated?: (summary: SummarizeResponse) => void
}

export default function UniversalSummarizer({ onSummaryGenerated }: UniversalSummarizerProps) {
  const [mode, setMode] = useState<'universal' | 'legal'>('universal')
  const [style, setStyle] = useState<string>('concise')
  const [styles, setStyles] = useState<SummaryStyle[]>([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<SummarizeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const result = await summarizeFile(file, { mode, style })
      setSummary(result)
      onSummaryGenerated?.(result)
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
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Upload Document:</label>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-2">
          Supports: PDF, DOCX, images (PNG, JPG), plain text
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Analyzing document...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Summary Result */}
      {summary && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Summary</h3>
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{summary.summary}</pre>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
            <p><span className="font-semibold">Mode:</span> {summary.mode}</p>
            <p><span className="font-semibold">Style:</span> {summary.style}</p>
            <p><span className="font-semibold">Sources analyzed:</span> {summary.sources_count}</p>
          </div>
        </div>
      )}
    </div>
  )
}
