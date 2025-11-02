import { useState } from 'react'
import { Link } from 'react-router-dom'
import UniversalSummarizer from '../components/UniversalSummarizer'
import { Card } from './Cards'
import type { SummarizeResponse } from '../lib/api'

export default function UniversalPage() {
  const [summary, setSummary] = useState<SummarizeResponse | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📄 PaiperSum Universal
            </Link>
            <nav className="flex gap-4">
              <Link to="/" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition">
                Legal Analysis
              </Link>
              <Link to="/universal" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                Universal Summarization
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Summarize <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Anything</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Books, recipes, job postings, chat history, court records, maps - summarize any document with AI-powered intelligence
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['📚 Books', '🍳 Cookbooks', '💼 Job Postings', '💬 Chat History', '🗺️ Maps', '⚖️ Court Records'].map((item) => (
              <span key={item} className="px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <UniversalSummarizer onSummaryGenerated={setSummary} />
          </Card>

          {/* Feature Highlights */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-lg mb-2">Multiple Styles</h3>
              <p className="text-gray-600 text-sm">Choose from concise, bulleted, TL;DR, executive summaries, and more</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold text-lg mb-2">Smart Search</h3>
              <p className="text-gray-600 text-sm">Query specific parts of your document for focused summaries</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-bold text-lg mb-2">Any Format</h3>
              <p className="text-gray-600 text-sm">PDF, DOCX, images, plain text - we handle it all</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 PaiperSum. Summarize anything, understand everything.
          </p>
        </div>
      </footer>
    </div>
  )
}
