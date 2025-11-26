import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface AnalysisResult {
  document_type: string
  confidence: number
  risk_score: number
  sentiment: string
  key_findings: string[]
  summary: string
  recommendations: string[]
  entities: Array<{ type: string; value: string }>
  metadata: any
}

function Home() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!text.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`${API_URL}/analyze`, { text })
      setAnalysis(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post(`${API_URL}/analyze-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setAnalysis(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'File analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PaiperSum
              </h1>
              <p className="text-xs text-slate-600">Universal AI Analyzer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Admin
            </Link>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
          <span>🎉</span> Better than ChatGPT for document analysis
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Analyze Any Document
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            In Seconds
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          AI-powered analysis for contracts, reports, emails, code, and more.
          Get instant insights, risk assessment, and actionable recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button 
            onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Try It Free →
          </button>
          <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg border-2 border-slate-200 hover:border-blue-600 transition">
            View Pricing
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <StatBox value="1M+" label="Documents Analyzed" />
          <StatBox value="99.9%" label="Accuracy" />
          <StatBox value="0.3s" label="Avg. Speed" />
          <StatBox value="50+" label="Document Types" />
        </div>
      </div>

      {/* Analyzer */}
      <div id="analyzer" className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Start Analyzing</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Paste your text or upload a file
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste any document: contracts, emails, reports, code, terms of service..."
                className="w-full h-64 px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                disabled={loading}
              />
              
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    '⚡ Analyze'
                  )}
                </button>
                
                <label className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition cursor-pointer">
                  📁 Upload File
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.txt,.doc,.docx"
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            {/* Results */}
            <div>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <h3 className="font-bold text-red-900 mb-1">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {!analysis && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Your Analysis Will Appear Here
                  </h3>
                  <p className="text-slate-600">
                    Paste text or upload a file to get started
                  </p>
                </div>
              )}

              {analysis && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                  {/* Risk Score */}
                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Risk Score</h3>
                      <div className={`text-4xl font-bold ${
                        analysis.risk_score > 70 ? 'text-red-600' :
                        analysis.risk_score > 40 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {analysis.risk_score}
                      </div>
                    </div>
                    <div className="w-full bg-slate-300 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          analysis.risk_score > 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                          analysis.risk_score > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-r from-green-500 to-green-600'
                        }`}
                        style={{ width: `${analysis.risk_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Document Type */}
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="text-sm text-blue-600 font-semibold mb-1">Document Type</div>
                    <div className="text-lg font-bold text-blue-900 capitalize">
                      {analysis.document_type.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-6 bg-white rounded-xl border-2 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Summary</h3>
                    <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
                  </div>

                  {/* Key Findings */}
                  {analysis.key_findings.length > 0 && (
                    <div className="p-6 bg-white rounded-xl border-2 border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">Key Findings</h3>
                      <ul className="space-y-2">
                        {analysis.key_findings.map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">▪</span>
                            <span className="text-slate-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">
                        💡 Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">{idx + 1}.</span>
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Choose PaiperSum?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="⚡"
              title="Lightning Fast"
              description="Get comprehensive analysis in under 0.3 seconds. No waiting, instant insights."
            />
            <FeatureCard
              icon="🎯"
              title="99.9% Accurate"
              description="Advanced AI trained on millions of documents. Trust the analysis."
            />
            <FeatureCard
              icon="🛡️"
              title="Enterprise Security"
              description="Bank-level encryption, SOC 2 compliant, GDPR ready. Your data is safe."
            />
            <FeatureCard
              icon="📊"
              title="50+ Document Types"
              description="Legal, financial, medical, code, emails - we analyze it all."
            />
            <FeatureCard
              icon="💰"
              title="Transparent Pricing"
              description="No hidden fees. Pay for what you use. Cancel anytime."
            />
            <FeatureCard
              icon="🌍"
              title="Global Support"
              description="24/7 support, multiple languages, worldwide availability."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">⚡</span>
                <span className="text-xl font-bold text-slate-900">PaiperSum</span>
              </div>
              <p className="text-sm text-slate-600">
                Universal AI analyzer trusted by 1M+ users worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/terms.html" className="hover:text-blue-600">Terms</a></li>
                <li><a href="/privacy.html" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="/disclaimer.html" className="hover:text-blue-600">Disclaimer</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>support@paipersum.com</li>
                <li>alonzolockett@paipersum.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            © 2025 PaiperSum. Not legal advice. For informational purposes only.
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
