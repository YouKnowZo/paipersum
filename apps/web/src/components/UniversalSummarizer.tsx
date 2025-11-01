import { useCallback, useEffect, useMemo, useState } from 'react'
import Logo from './Logo'
import Upload from './Upload'
import Consent from './Consent'
import FloatingChatbot from './FloatingChatbot'
import {
  pipelineUpload,
  pipelineSummarize,
  pipelineDocuments,
  pipelineReset
} from '../lib/api'
import type {
  PipelineDocumentT,
  PipelineSummaryResponseT
} from '../lib/schemas'

const SUMMARY_STYLES = [
  { id: 'concise', label: 'Concise' },
  { id: 'bulleted', label: 'Bulleted' },
  { id: 'executive', label: 'Executive' },
  { id: 'action-items', label: 'Action Items' },
  { id: 'tl;dr', label: 'TL;DR' }
]

const MODES = [
  {
    id: 'universal',
    label: 'Universal',
    description: 'Summarize any content – books, notes, transcripts, research, how-to guides, anything.'
  },
  {
    id: 'legal',
    label: 'Legal',
    description: 'Highlight clauses, obligations, risks, and compliance red flags in legal documents.'
  }
]

interface UniversalSummarizerProps {
  onClose: () => void
}

export default function UniversalSummarizer({ onClose }: UniversalSummarizerProps) {
  const [mode, setMode] = useState<'universal' | 'legal'>('universal')
  const [style, setStyle] = useState('concise')
  const [query, setQuery] = useState('Summarize this document with the most important insights and next steps.')
  const [instructions, setInstructions] = useState('')
  const [documents, setDocuments] = useState<PipelineDocumentT[]>([])
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [summary, setSummary] = useState<PipelineSummaryResponseT | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadDocuments = useCallback(async () => {
    try {
      const docs = await pipelineDocuments()
      setDocuments(docs)
      if (docs.length && !selectedDocument) {
        setSelectedDocument(docs[0].document_id)
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    }
  }, [selectedDocument])

  useEffect(() => {
    void loadDocuments()
  }, [loadDocuments])

  const selectedDocMeta = useMemo(
    () => documents.find((doc) => doc.document_id === selectedDocument) ?? null,
    [documents, selectedDocument]
  )

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await pipelineUpload(file, mode)
      if (response.chunks_added === 0) {
        setError(`Could not extract readable text from ${response.filename}. Try a different format or clearer image.`)
      } else {
        setSuccessMessage(`Added ${response.chunks_added} chunks from ${response.filename}`)
        await loadDocuments()
        setSelectedDocument(response.document_id)
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSummarize = async () => {
    if (!query.trim()) {
      setError('Please provide a question or instruction for the summary.')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await pipelineSummarize({
        query,
        mode,
        style,
        instructions: instructions || undefined,
        document_id: selectedDocument || undefined,
        max_sources: 5
      })
      setSummary(response)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Summarization failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setLoading(true)
    setError('')
    setSuccessMessage('')
    try {
      await pipelineReset()
      setSummary(null)
      setSelectedDocument(null)
      await loadDocuments()
      setSuccessMessage('Cleared in-memory documents.')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper-50">
      <Consent />
      <FloatingChatbot />

      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ink-900 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <Logo size="sm" />

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-500">In-memory prototype • Sources shown for transparency</span>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-3 py-1.5 text-xs border rounded-lg hover:bg-paper-100 transition disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">
            Summarize Anything with PaiperSum
          </h1>
          <p className="text-ink-600 max-w-3xl mx-auto">
            Upload documents, transcripts, or photos of pages. Retrieve the most relevant sections using open-source embeddings and generate summaries tailored to your instructions. Choose modes for universal summaries or legal clause focus.
          </p>
        </header>

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 text-red-700 rounded-xl">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 border border-green-200 bg-green-50 text-green-700 rounded-xl">
            {successMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-4">
            <section className="p-4 bg-white rounded-xl border border-border-200 shadow-sm">
              <h2 className="text-sm font-semibold text-ink-700 mb-3">Mode</h2>
              <div className="space-y-3">
                {MODES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id as 'universal' | 'legal')}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      mode === item.id ? 'border-brand-blue bg-brand-blue/5 text-ink-900' : 'border-border-200 hover:border-brand-blue/40'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.label}</div>
                    <p className="text-xs text-ink-500 leading-relaxed">{item.description}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="p-4 bg-white rounded-xl border border-border-200 shadow-sm">
              <h2 className="text-sm font-semibold text-ink-700 mb-3">Documents</h2>
              <div className="space-y-2">
                {documents.length === 0 && (
                  <p className="text-xs text-ink-500">No documents yet. Upload to start.</p>
                )}
                {documents.map((doc) => (
                  <button
                    key={doc.document_id}
                    onClick={() => setSelectedDocument(doc.document_id)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      selectedDocument === doc.document_id ? 'border-brand-blue bg-brand-blue/10' : 'border-border-200 hover:border-brand-blue/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-ink-800">
                      <span className="truncate mr-2">{doc.filename}</span>
                      <span className="text-xs text-ink-500">{doc.chunks} chunks</span>
                    </div>
                    <div className="text-xs text-ink-500 mt-1 flex items-center justify-between">
                      <span>{doc.mode}</span>
                      <span>{(doc.characters / 1000).toFixed(1)}k chars</span>
                    </div>
                    <div className="text-[10px] text-ink-400 mt-1">
                      {new Date(doc.created_at).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="p-4 bg-white rounded-xl border border-border-200 shadow-sm">
              <h2 className="text-sm font-semibold text-ink-700 mb-3">Upload</h2>
              <Upload
                onFileSelect={handleUpload}
                loading={uploading}
                accept=".pdf,.doc,.docx,.txt,.md,.json,.html,.htm,.png,.jpg,.jpeg,.bmp,.tiff,.webp"
              />
              <p className="text-[11px] text-ink-500 mt-3 leading-relaxed">
                Files stay in memory only for this session. Images use on-device OCR via Tesseract. Delete with the reset button above.
              </p>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="p-6 bg-white rounded-xl border border-border-200 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-600 mb-1">Summary Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-border-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    {SUMMARY_STYLES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-600 mb-1">Custom Instructions (optional)</label>
                  <input
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Focus on action items for the marketing team"
                    className="w-full px-3 py-2 border border-border-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-ink-600 mb-1">Question or Summary Prompt</label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={4}
                  className="w-full border border-border-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Ask for a TL;DR, extract key clauses, generate a study guide, etc."
                  disabled={loading}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-ink-500">
                  {selectedDocMeta ? `Targeting ${selectedDocMeta.filename}` : 'No document filter — will search across all ingested content.'}
                </div>
                <button
                  onClick={handleSummarize}
                  disabled={loading || documents.length === 0}
                  className="px-5 py-2 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating…' : 'Generate Summary'}
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-border-200 shadow-sm min-h-[280px]">
              {!summary ? (
                <div className="text-center text-ink-500 text-sm">
                  Summaries will appear here with citations to retrieved chunks. Upload a document and run a query to get started.
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-ink-900 mb-2">
                      {summary.style} summary ({summary.mode} mode)
                    </h2>
                    <div className="whitespace-pre-wrap leading-relaxed text-ink-800 text-sm">
                      {summary.summary}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-ink-700 mb-2">Sources</h3>
                    <ul className="space-y-2">
                      {summary.sources.map((source) => (
                        <li key={source.chunk_id} className="p-3 border border-border-200 rounded-lg bg-paper-50">
                          <div className="text-xs text-ink-400 mb-1">Source S{source.order} • Score {source.score.toFixed(3)}</div>
                          <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">
                            {source.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-ink-400">
        Summaries are generated with open-source models for informational purposes. Double-check important facts. Not legal advice.
      </footer>
    </div>
  )
}
