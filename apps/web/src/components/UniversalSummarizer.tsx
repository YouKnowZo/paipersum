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
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'universal'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📄 Universal Summarization
        </button>
        <button
          onClick={() => handleModeChange('legal')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'legal'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ⚖️ Legal Analysis
        </button>
      </div>

      {/* Style Selection */}
      {styles.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Summary Style:</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
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
        <label className="block text-sm font-medium mb-2">Upload Document:</label>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          className="w-full px-4 py-2 border rounded-lg"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Supports: PDF, DOCX, images (PNG, JPG), plain text
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Analyzing document...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Summary Result */}
      {summary && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm">{summary.summary}</pre>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Mode: {summary.mode}</p>
            <p>Style: {summary.style}</p>
            <p>Sources: {summary.sources_count}</p>
          </div>
        </div>
      )}
    </div>
  )
}
