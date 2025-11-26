import { useState, useEffect } from 'react'
import Logo from './components/Logo'
import Hero from './components/Hero'
import InstantAnalysis from './components/InstantAnalysis'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import FloatingChatbot from './components/FloatingChatbot'
import Consent from './components/Consent'
import Upload from './components/Upload'
import EnhancedSummaryPage from './pages/EnhancedSummaryPage'
import AccountPage from './pages/AccountPage'
import { Card } from './components/Cards'
import { analyzeText, analyzeFile, exportPDF } from './lib/api'
import type { EnhancedAnalysisT } from './lib/schemas'

interface User {
  email: string
  name: string
  isPro: boolean
  docsThisMonth: number
  address?: string
  phone?: string
  company?: string
}

interface SavedAnalysis {
  id: string
  name: string
  date: string
  analysis: EnhancedAnalysisT
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [analysis, setAnalysis] = useState<EnhancedAnalysisT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [text, setText] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [documentsAnalyzed, setDocumentsAnalyzed] = useState(0)
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [totalSavings, setTotalSavings] = useState(0)

  useEffect(() => {
    const savedUser = localStorage.getItem('paipersum_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to load user', e)
      }
    }
    
    const count = parseInt(localStorage.getItem('docs_analyzed') || '0')
    setDocumentsAnalyzed(count)
    
    const savings = parseInt(localStorage.getItem('total_savings') || '0')
    setTotalSavings(savings)
    
    const saved = JSON.parse(localStorage.getItem('saved_analyses') || '[]')
    setSavedAnalyses(saved)
  }, [])

  const canAnalyze = (): boolean => {
    if (!user) return documentsAnalyzed < 5
    if (user.isPro) return true
    return user.docsThisMonth < 30
  }

  const handleLogin = (email: string, name: string) => {
    const newUser: User = { email, name, isPro: false, docsThisMonth: 0 }
    setUser(newUser)
    localStorage.setItem('paipersum_user', JSON.stringify(newUser))
    setShowAuth(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('paipersum_user')
  }

  const showAchievement = (title: string, message: string) => {
    const toast = document.createElement('div')
    toast.className = 'fixed top-20 right-6 z-50 bg-brand-navy text-white p-6 rounded-2xl shadow-2xl animate-fade-in-up max-w-sm'
    toast.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-brand-teal/20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <div class="font-semibold text-lg">${title}</div>
          <div class="text-sm text-slate-300 mt-1">${message}</div>
        </div>
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 5000)
  }

  const handleAnalyzeText = async (textToAnalyze: string = text, name: string = documentName) => {
    if (!textToAnalyze.trim()) return
    
    if (!canAnalyze()) {
      setError(user ? 'Monthly limit reached. Upgrade to Pro for unlimited analyses!' : 'Create an account to continue')
      setShowAuth(true)
      return
    }
    
    setError('')
    setLoading(true)
    setShowAnalyzer(true)
    
    try {
      const result = await analyzeText(textToAnalyze)
      setAnalysis(result)
      
      const newCount = documentsAnalyzed + 1
      setDocumentsAnalyzed(newCount)
      localStorage.setItem('docs_analyzed', newCount.toString())
      
      if (user) {
        const updatedUser = { ...user, docsThisMonth: user.docsThisMonth + 1 }
        setUser(updatedUser)
        localStorage.setItem('paipersum_user', JSON.stringify(updatedUser))
      }
      
      const newSavings = totalSavings + (result.recommendation.cost_impact || 0)
      setTotalSavings(newSavings)
      localStorage.setItem('total_savings', newSavings.toString())
      
      const savedAnalysis: SavedAnalysis = {
        id: Date.now().toString(),
        name: name || `Document ${newCount}`,
        date: new Date().toISOString(),
        analysis: result
      }
      const newSaved = [savedAnalysis, ...savedAnalyses].slice(0, 10)
      setSavedAnalyses(newSaved)
      localStorage.setItem('saved_analyses', JSON.stringify(newSaved))
      
      if (newCount === 1) {
        showAchievement('First Analysis Complete!', 'You\'re protecting yourself from hidden traps!')
      } else if (newCount === 5) {
        showAchievement('5 Documents Analyzed!', 'You\'re becoming a contract pro!')
      } else if (newSavings >= 1000) {
        showAchievement('$1,000+ Protected!', 'You\'ve avoided over $1,000 in potential costs!')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!canAnalyze()) {
      setError(user ? 'Monthly limit reached. Upgrade to Pro!' : 'Create an account to continue')
      setShowAuth(true)
      return
    }
    
    setDocumentName(file.name)
    setError('')
    setLoading(true)
    setShowAnalyzer(true)
    
    try {
      const result = await analyzeFile(file)
      setAnalysis(result)
      
      const newCount = documentsAnalyzed + 1
      setDocumentsAnalyzed(newCount)
      localStorage.setItem('docs_analyzed', newCount.toString())
      
      if (user) {
        const updatedUser = { ...user, docsThisMonth: user.docsThisMonth + 1 }
        setUser(updatedUser)
        localStorage.setItem('paipersum_user', JSON.stringify(updatedUser))
      }
      
      const newSavings = totalSavings + (result.recommendation.cost_impact || 0)
      setTotalSavings(newSavings)
      localStorage.setItem('total_savings', newSavings.toString())
      
      const savedAnalysis: SavedAnalysis = {
        id: Date.now().toString(),
        name: file.name,
        date: new Date().toISOString(),
        analysis: result
      }
      const newSaved = [savedAnalysis, ...savedAnalyses].slice(0, 10)
      setSavedAnalyses(newSaved)
      localStorage.setItem('saved_analyses', JSON.stringify(newSaved))
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
      a.download = `paipersum-${documentName || 'report'}-${Date.now()}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      showAchievement('PDF Exported!', 'Share this report with family or keep for your records')
    } catch {
      setError('Export failed')
    }
  }

  const handleClear = () => {
    setText('')
    setDocumentName('')
    setAnalysis(null)
    setError('')
    setShowAnalyzer(false)
  }

  const loadSavedAnalysis = (saved: SavedAnalysis) => {
    setAnalysis(saved.analysis)
    setDocumentName(saved.name)
    setShowAnalyzer(true)
  }

  const getRemainingAnalyses = (): number => {
    if (!user) return 5 - documentsAnalyzed
    if (user.isPro) return 999999
    return 30 - user.docsThisMonth
  }

  // Auth Modal
  const AuthModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-6 mb-2">
            {user ? 'Upgrade to Pro' : 'Create your account'}
          </h2>
          <p className="text-slate-600">
            {user ? 'Get unlimited document analyses' : 'Continue analyzing your documents'}
          </p>
        </div>

        {!user ? (
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const email = formData.get('email') as string
            const name = formData.get('name') as string
            if (email && name) handleLogin(email, name)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                className="input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div className="pt-4 space-y-3">
              <button type="submit" className="btn-primary w-full">
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setShowAuth(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-center text-slate-500 mt-4">
              By signing up, you agree to our Terms & Privacy Policy
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-50 to-brand-sky/5 rounded-xl border border-slate-200">
              <div className="text-center mb-6">
                <div className="text-4xl font-display font-bold text-slate-900">$20</div>
                <div className="text-sm text-slate-600">per month</div>
              </div>
              <ul className="space-y-3">
                {['Unlimited analyses', 'Full document history', 'Priority support', 'Family sharing (5 accounts)'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-brand-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className="btn-primary w-full">
              Upgrade to Pro
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button onClick={() => setShowAuth(false)} className="btn-secondary w-full">
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // Landing page
  if (!showAnalyzer) {
    return (
      <>
        <Consent />
        <FloatingChatbot />
        {showAuth && <AuthModal />}
        
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
            <div className="container-wide h-16 flex items-center justify-between">
              <Logo size="md" />
              
              <div className="flex items-center gap-4">
                {/* Stats badge */}
                {documentsAnalyzed > 0 && (
                  <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{documentsAnalyzed}</div>
                      <div className="text-xs text-slate-500">analyzed</div>
                    </div>
                    {totalSavings > 0 && (
                      <>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-center">
                          <div className="text-lg font-bold text-brand-teal">${totalSavings.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">protected</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAccount(true)}
                      className="btn-ghost text-sm"
                    >
                      Account
                    </button>
                    <button onClick={handleLogout} className="btn-ghost text-sm">
                      Sign out
                    </button>
                    {!user.isPro && (
                      <button onClick={() => setShowAuth(true)} className="btn-accent btn-sm">
                        Upgrade
                      </button>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setShowAuth(true)} className="btn-secondary btn-sm">
                    Sign in
                  </button>
                )}
                
                <button onClick={() => setShowAnalyzer(true)} className="btn-primary btn-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Analyze</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Hero */}
          <Hero onStartAnalyzer={() => setShowAnalyzer(true)} />

          {/* Recent analyses */}
          {savedAnalyses.length > 0 && (
            <section className="py-16 bg-slate-50">
              <div className="container-wide">
                <h2 className="text-2xl font-display font-semibold text-slate-900 mb-8">
                  Your Recent Analyses
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedAnalyses.slice(0, 6).map((saved) => (
                    <button
                      key={saved.id}
                      onClick={() => loadSavedAnalysis(saved)}
                      className="card-interactive p-6 text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900 truncate flex-1 pr-2">
                          {saved.name}
                        </h3>
                        <span className={`badge ${
                          saved.analysis.recommendation.decision === 'sign' ? 'badge-success' :
                          saved.analysis.recommendation.decision === 'negotiate' ? 'badge-warning' :
                          'badge-danger'
                        }`}>
                          {saved.analysis.risk_score}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 mb-3">
                        {new Date(saved.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-brand-blue font-medium flex items-center gap-1">
                        View Analysis
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Instant Analysis Examples */}
          <InstantAnalysis />

          {/* Features */}
          <Features />

          {/* Testimonials */}
          <Testimonials />

          {/* Final CTA */}
          <section className="section bg-brand-navy relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-sky rounded-full blur-3xl" />
            </div>
            
            <div className="container-tight relative text-center">
              <h2 className="text-white mb-6">
                Ready to protect yourself?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join {Math.max(50000, documentsAnalyzed * 50).toLocaleString()}+ people who analyze before they sign. 
                It's free to start.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setShowAnalyzer(true)} className="btn bg-white text-brand-navy btn-lg hover:bg-slate-100">
                  Analyze a Document
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button 
                  onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn border border-white/20 text-white btn-lg hover:bg-white/10"
                >
                  See Examples First
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-900 text-white py-16">
            <div className="container-wide">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                <div>
                  <Logo size="md" />
                  <p className="text-sm text-slate-400 leading-relaxed mt-4">
                    Understand legal documents in plain English. 
                    Stop getting caught by fine print.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li><a href="#features" className="hover:text-white transition">Features</a></li>
                    <li><a href="#examples" className="hover:text-white transition">Examples</a></li>
                    <li><button onClick={() => setShowAnalyzer(true)} className="hover:text-white transition">Try Now</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li><a href="/terms.html" target="_blank" className="hover:text-white transition">Terms of Service</a></li>
                    <li><a href="/privacy.html" target="_blank" className="hover:text-white transition">Privacy Policy</a></li>
                    <li><a href="/disclaimer.html" target="_blank" className="hover:text-white transition">Disclaimer</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Contact</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li><a href="mailto:hello@paipersum.com" className="hover:text-white transition">hello@paipersum.com</a></li>
                    <li><a href="mailto:support@paipersum.com" className="hover:text-white transition">support@paipersum.com</a></li>
                    <li><a href="https://twitter.com/paipersum" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter/X</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                <p>© {new Date().getFullYear()} PaiperSum. AI-powered legal document analysis for informational purposes only. Not legal advice.</p>
              </div>
            </div>
          </footer>
        </div>
      </>
    )
  }

  // Account page
  if (showAccount && user) {
    return (
      <AccountPage
        user={user}
        onUpdate={(updated) => {
          setUser(updated)
          localStorage.setItem('paipersum_user', JSON.stringify(updated))
        }}
        onCancel={() => setShowAccount(false)}
        onUpgrade={() => setShowAuth(true)}
        totalSavings={totalSavings}
        documentsAnalyzed={documentsAnalyzed}
      />
    )
  }

  // Analyzer view
  return (
    <>
      <Consent />
      <FloatingChatbot />
      {showAuth && <AuthModal />}
      
      <div className="min-h-screen bg-slate-50">
        {/* Top bar */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="container-wide h-16 flex items-center justify-between">
            <button onClick={handleClear} className="btn-ghost">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>

            <Logo size="sm" />

            <div className="flex items-center gap-4">
              {user && !user.isPro && (
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-500">Remaining</div>
                  <div className="text-sm font-semibold text-brand-blue">{getRemainingAnalyses()}/30</div>
                </div>
              )}
              
              <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900">{documentsAnalyzed}</div>
                  <div className="text-xs text-slate-500">docs</div>
                </div>
                {totalSavings > 0 && (
                  <>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-brand-teal">${totalSavings.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">saved</div>
                    </div>
                  </>
                )}
              </div>
              
              {user && !user.isPro && (
                <button onClick={() => setShowAuth(true)} className="btn-accent btn-sm">
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </nav>

        <div className="container-wide py-8">
          {/* Document name input */}
          {!documentName && (
            <div className="mb-8 max-w-lg mx-auto">
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Name this document (e.g., 'Apartment Lease')"
                className="input input-lg text-center"
              />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input column */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Paste Document Text
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your contract, Terms of Service, waiver, lease, or any legal document..."
                      className="input h-64 resize-none"
                      disabled={loading}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleAnalyzeText()}
                    disabled={!text.trim() || loading}
                    className="btn-primary w-full py-4"
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Analyze Now</span>
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-slate-500 uppercase tracking-wider">or upload file</span>
                    </div>
                  </div>

                  <Upload onFileSelect={handleFileSelect} loading={loading} />
                </div>
              </Card>

              {/* Recent analyses */}
              {savedAnalyses.length > 0 && (
                <Card title="Recent Analyses">
                  <div className="space-y-2">
                    {savedAnalyses.slice(0, 5).map((saved) => (
                      <button
                        key={saved.id}
                        onClick={() => loadSavedAnalysis(saved)}
                        className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                      >
                        <div className="font-medium text-sm text-slate-900 truncate mb-1">
                          {saved.name}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {new Date(saved.date).toLocaleDateString()}
                          </span>
                          <span className={`badge ${
                            saved.analysis.recommendation.decision === 'sign' ? 'badge-success' :
                            saved.analysis.recommendation.decision === 'negotiate' ? 'badge-warning' :
                            'badge-danger'
                          }`}>
                            {saved.analysis.risk_score}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Results column */}
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-3 animate-fade-in">
                  <svg className="w-5 h-5 text-danger-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-danger-900">Analysis Failed</h3>
                    <p className="text-sm text-danger-700 mt-1">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-danger-600 hover:text-danger-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {!analysis ? (
                <Card>
                  <div className="text-center py-16">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl">
                      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-slate-900 mb-3">
                      Let's Analyze Your Document
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto mb-8">
                      Paste text or upload a file to get instant analysis with clear recommendations.
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm text-left">
                      {['Clear recommendation', 'Cost impact analysis', 'Negotiation templates', 'PDF export'].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-brand-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="animate-fade-in-up">
                  <EnhancedSummaryPage 
                    analysis={analysis} 
                    onExport={handleExport}
                    documentName={documentName || 'Document'}
                  />
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-warning-900">Legal Disclaimer</span>
                </div>
                <p className="text-xs text-warning-800 leading-relaxed max-w-2xl mx-auto">
                  This analysis is for informational purposes only and does not constitute legal advice. 
                  Automated analysis may miss clauses or misinterpret language. Always consult a licensed 
                  attorney for legal decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
