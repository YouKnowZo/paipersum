import { useState, useEffect, useCallback } from 'react'
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
import AdminPage from './pages/AdminPage'
import { Card } from './components/Cards'
import { analyzeText, analyzeFile, exportPDF } from './lib/api'
import { useAuth, useCanAnalyze, useSavedAnalyses } from './lib/auth'
import type { EnhancedAnalysisT } from './lib/schemas'

// Route types
type Route = 'home' | 'analyzer' | 'account' | 'admin'

export default function App() {
  // Auth state from context
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading,
    login, 
    loginWithAuth0,
    logout, 
    updateUser,
    incrementDocsAnalyzed,
    addSavings
  } = useAuth()
  
  const { canAnalyze, remaining, reason } = useCanAnalyze()
  const { analyses: savedAnalyses, saveAnalysis } = useSavedAnalyses()

  // UI state
  const [route, setRoute] = useState<Route>('home')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [analysis, setAnalysis] = useState<EnhancedAnalysisT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [documentName, setDocumentName] = useState('')

  // Check for admin route on mount
  useEffect(() => {
    const path = window.location.pathname
    const hash = window.location.hash
    
    if (path === '/admin' || hash === '#admin') {
      setRoute('admin')
    } else if (path === '/account' || hash === '#account') {
      setRoute('account')
    } else if (path === '/analyze' || hash === '#analyze') {
      setRoute('analyzer')
    }
  }, [])

  // Navigation helpers
  const navigate = useCallback((newRoute: Route) => {
    setRoute(newRoute)
    
    // Update URL without page reload
    const paths: Record<Route, string> = {
      home: '/',
      analyzer: '/analyze',
      account: '/account',
      admin: '/admin'
    }
    window.history.pushState({}, '', paths[newRoute])
  }, [])

  const goHome = useCallback(() => {
    navigate('home')
    setAnalysis(null)
    setText('')
    setDocumentName('')
    setError('')
  }, [navigate])

  // Show achievement notification
  const showAchievement = useCallback((title: string, message: string) => {
    const toast = document.createElement('div')
    toast.className = 'fixed top-20 right-6 z-50 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white p-6 rounded-xl shadow-2xl animate-in slide-in-from-top-4 max-w-sm'
    toast.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="text-4xl">🎉</div>
        <div>
          <div class="font-bold text-lg mb-1">${title}</div>
          <div class="text-sm text-blue-100">${message}</div>
        </div>
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 5000)
  }, [])

  // Handle text analysis
  const handleAnalyzeText = useCallback(async (textToAnalyze: string = text, name: string = documentName) => {
    if (!textToAnalyze.trim()) {
      navigate('analyzer')
      return
    }
    
    // Check limits
    if (!canAnalyze) {
      setError(reason || 'Please sign in to continue')
      setShowAuthModal(true)
      return
    }
    
    setError('')
    setLoading(true)
    navigate('analyzer')
    
    try {
      const result = await analyzeText(textToAnalyze)
      setAnalysis(result)
      
      // Track metrics
      incrementDocsAnalyzed()
      
      // Track savings
      if (result.recommendation.cost_impact) {
        addSavings(result.recommendation.cost_impact)
      }
      
      // Save analysis
      saveAnalysis(result, name || `Document ${Date.now()}`)
      
      // Check for achievements
      const totalDocs = user?.totalDocsAnalyzed || 1
      const totalSavings = user?.totalSavings || 0
      
      if (totalDocs === 1) {
        showAchievement('🎉 First Analysis Complete!', 'You\'re protecting yourself from hidden traps!')
      } else if (totalDocs === 5) {
        showAchievement('🏆 5 Documents Analyzed!', 'You\'re becoming a contract pro!')
      } else if (totalDocs === 10) {
        showAchievement('💎 Power User Unlocked!', `You've saved $${totalSavings} total!`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }, [text, documentName, canAnalyze, reason, navigate, incrementDocsAnalyzed, addSavings, saveAnalysis, showAchievement, user])

  // Handle file analysis
  const handleFileSelect = useCallback(async (file: File) => {
    if (!canAnalyze) {
      setError(reason || 'Please sign in to continue')
      setShowAuthModal(true)
      return
    }
    
    setDocumentName(file.name)
    setError('')
    setLoading(true)
    navigate('analyzer')
    
    try {
      const result = await analyzeFile(file)
      setAnalysis(result)
      
      incrementDocsAnalyzed()
      
      if (result.recommendation.cost_impact) {
        addSavings(result.recommendation.cost_impact)
      }
      
      saveAnalysis(result, file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File analysis failed')
    } finally {
      setLoading(false)
    }
  }, [canAnalyze, reason, navigate, incrementDocsAnalyzed, addSavings, saveAnalysis])

  // Handle PDF export
  const handleExport = useCallback(async () => {
    if (!text.trim()) return
    
    try {
      const blob = await exportPDF(text)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `paipersum-${documentName || 'report'}-${Date.now()}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      
      showAchievement('📄 PDF Exported!', 'Share this report with family or keep for your records')
    } catch (err) {
      setError('Export failed')
    }
  }, [text, documentName, showAchievement])

  // Load saved analysis
  const loadSavedAnalysis = useCallback((saved: any) => {
    setAnalysis(saved.analysis)
    setDocumentName(saved.name)
    navigate('analyzer')
  }, [navigate])

  // Handle login form
  const handleLoginSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    
    if (email && name) {
      await login(email, name)
      setShowAuthModal(false)
    }
  }, [login])

  // Auth Modal Component
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4">
        <div className="text-center mb-6">
          <Logo size="lg" onClick={() => {}} />
          <h2 className="text-2xl font-bold text-ink-900 mt-4 mb-2">
            {isAuthenticated && user ? 'Upgrade to Pro' : 'Sign in or create an account'}
          </h2>
          <p className="text-ink-600">
            {isAuthenticated && user ? 'Get unlimited document analyses' : 'Continue analyzing your documents'}
          </p>
        </div>

        {!isAuthenticated ? (
          <>
            {/* Auth0 Login Button */}
            <button
              onClick={() => {
                loginWithAuth0()
                setShowAuthModal(false)
              }}
              className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              Continue with Auth0
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-ink-500 font-medium">OR USE EMAIL</span>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy transition"
                  placeholder="you@example.com"
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full px-6 py-4 bg-paper-100 text-ink-900 rounded-xl font-bold hover:bg-paper-200 transition border-2 border-border-200"
                >
                  Continue with Email →
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full mt-3 px-6 py-3 text-ink-500 font-semibold hover:text-ink-700 transition"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-center text-ink-500 mt-4">
                By signing up, you agree to our{' '}
                <a href="/terms.html" target="_blank" className="text-brand-navy hover:underline">Terms</a> &{' '}
                <a href="/privacy.html" target="_blank" className="text-brand-navy hover:underline">Privacy Policy</a>
              </p>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy/20">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-brand-navy">$20</div>
                <div className="text-sm text-ink-600">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                {['Unlimited analyses', 'Save all document history', 'Priority support', 'Share with family (5 accounts)'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white rounded-xl font-bold hover:shadow-lg transition">
              Upgrade to Pro →
            </button>
            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full px-6 py-3 bg-paper-100 text-ink-700 rounded-lg font-semibold hover:bg-paper-200 transition"
            >
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="animate-spin w-full h-full text-brand-navy" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <Logo size="lg" onClick={() => {}} />
        </div>
      </div>
    )
  }

  // Admin Portal
  if (route === 'admin') {
    return <AdminPage onClose={goHome} />
  }

  // Account Page
  if (route === 'account' && user) {
    return (
      <AccountPage
        user={{
          email: user.email,
          name: user.name,
          isPro: user.isPro,
          docsThisMonth: user.docsThisMonth,
          address: user.address,
          phone: user.phone,
          company: user.company
        }}
        onUpdate={(updated) => {
          updateUser(updated)
        }}
        onCancel={goHome}
        onUpgrade={() => setShowAuthModal(true)}
        totalSavings={user.totalSavings}
        documentsAnalyzed={user.totalDocsAnalyzed}
      />
    )
  }

  // Landing page
  if (route === 'home') {
    return (
      <>
        <Consent />
        <FloatingChatbot />
        {showAuthModal && <AuthModal />}
        
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Logo size="md" onClick={goHome} />
              
              <div className="flex items-center gap-4">
                {/* Stats badge */}
                {user && user.totalDocsAnalyzed > 0 && (
                  <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-brand-navy/10 to-brand-orange/10 rounded-lg border border-brand-navy/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-navy">{user.totalDocsAnalyzed}</div>
                      <div className="text-xs text-ink-600">analyzed</div>
                    </div>
                    {user.totalSavings > 0 && (
                      <>
                        <div className="w-px h-8 bg-border-200"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-green">${user.totalSavings.toLocaleString()}</div>
                          <div className="text-xs text-ink-600">protected</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-ink-900">{user.name}</div>
                      <div className="text-xs text-ink-500">
                        {user.isPro ? 'Pro' : `${remaining} left this month`}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('account')}
                      className="px-4 py-2 text-sm border rounded-lg hover:bg-paper-50 transition font-medium"
                    >
                      Account
                    </button>
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-sm border rounded-lg hover:bg-paper-50 transition font-medium"
                    >
                      Sign out
                    </button>
                    {!user.isPro && (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-ink-900 rounded-lg font-semibold text-sm hover:shadow-lg transition"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 border-2 border-brand-navy text-brand-navy rounded-lg font-semibold hover:bg-brand-navy hover:text-white transition"
                  >
                    Sign in / Create account
                  </button>
                )}
                
                <button
                  onClick={() => navigate('analyzer')}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Analyze Document
                </button>
              </div>
            </div>
          </nav>

          {/* Hero section */}
          <Hero onAnalyze={handleAnalyzeText} />

          {/* Recent analyses */}
          {savedAnalyses.length > 0 && (
            <div className="bg-paper-50 py-12">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-ink-900 mb-6">📚 Your Recent Analyses</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedAnalyses.slice(0, 6).map((saved: any) => (
                    <button
                      key={saved.id}
                      onClick={() => loadSavedAnalysis(saved)}
                      className="text-left p-4 bg-white border-2 border-border-200 rounded-xl hover:border-brand-navy hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-ink-900 truncate flex-1">
                          {saved.name}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          saved.analysis.recommendation.decision === 'sign' ? 'bg-green-100 text-green-700' :
                          saved.analysis.recommendation.decision === 'negotiate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {saved.analysis.risk_score}
                        </div>
                      </div>
                      <div className="text-xs text-ink-500">
                        {new Date(saved.date).toLocaleDateString()}
                      </div>
                      <div className="mt-2 text-xs text-brand-navy font-semibold">
                        View Analysis →
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instant analysis examples */}
          <InstantAnalysis />

          {/* Features */}
          <Features />

          {/* Testimonials */}
          <Testimonials />

          {/* CTA section */}
          <div className="bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Stop Getting Scammed?
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                Join {Math.max(5000, (user?.totalDocsAnalyzed || 0) * 50).toLocaleString()}+ people who analyze before they sign
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('analyzer')}
                  className="px-8 py-4 bg-brand-orange text-brand-navy-dark rounded-xl font-bold text-lg hover:bg-brand-orange-light transition shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Analyze a Document →
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-ink-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="mb-4">
                    <Logo size="md" onClick={goHome} />
                  </div>
                  <p className="text-sm text-ink-300 leading-relaxed">
                    Understand legal documents in plain English. Stop getting screwed by fine print.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-ink-300">
                    <li><a href="#features" className="hover:text-white transition">Features</a></li>
                    <li><a href="#examples" className="hover:text-white transition">Examples</a></li>
                    <li><button onClick={() => navigate('analyzer')} className="hover:text-white transition">Try Now</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-ink-300">
                    <li><a href="/terms.html" target="_blank" className="hover:text-white transition">Terms of Service</a></li>
                    <li><a href="/privacy.html" target="_blank" className="hover:text-white transition">Privacy Policy</a></li>
                    <li><a href="#disclaimer" className="hover:text-white transition">Disclaimer</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Connect</h4>
                  <ul className="space-y-2 text-sm text-ink-300">
                    <li><a href="https://twitter.com/paipersum" target="_blank" className="hover:text-white transition">Twitter/X</a></li>
                    <li><a href="https://linkedin.com/company/paipersum" target="_blank" className="hover:text-white transition">LinkedIn</a></li>
                    <li><a href="mailto:alonzolockett@paipersum.com" className="hover:text-white transition">General: alonzolockett@paipersum.com</a></li>
                    <li><a href="mailto:support@paipersum.com" className="hover:text-white transition">Support: support@paipersum.com</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-ink-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-400">
                <p>© 2025 PaiperSum. Not legal advice. Automated analysis for informational purposes only.</p>
                <button 
                  onClick={() => navigate('admin')}
                  className="text-ink-500 hover:text-white transition text-xs"
                >
                  Admin Portal
                </button>
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
      {showAuthModal && <AuthModal />}
      
      <div className="min-h-screen bg-paper-50">
        {/* Top bar with stats */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={goHome}
              className="text-ink-600 hover:text-ink-900 flex items-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Home</span>
            </button>

            <Logo size="sm" onClick={goHome} />

            {/* Stats */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user && !user.isPro && (
                <div className="text-right">
                  <div className="text-xs text-ink-500">Remaining</div>
                  <div className="text-sm font-bold text-brand-navy">{remaining}/30</div>
                </div>
              )}
              
              {user && (
                <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-brand-navy/10 to-brand-orange/10 rounded-lg border border-brand-navy/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-brand-navy">{user.totalDocsAnalyzed}</div>
                    <div className="text-xs text-ink-600">docs</div>
                  </div>
                  {user.totalSavings > 0 && (
                    <>
                      <div className="w-px h-6 bg-border-200"></div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-brand-green">${user.totalSavings.toLocaleString()}</div>
                        <div className="text-xs text-ink-600">saved</div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {isAuthenticated && user && !user.isPro && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-ink-900 rounded-lg font-semibold text-sm hover:shadow-lg transition"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Document name input */}
          {!documentName && (
            <div className="mb-6 max-w-md mx-auto">
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Name this document (e.g., 'Planet Fitness Membership')"
                className="w-full px-4 py-3 border-2 border-brand-navy/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy text-center font-semibold"
              />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input column */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2 flex items-center gap-2">
                      <span>📝</span>
                      <span>Paste Document Text</span>
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your contract, Terms of Service, waiver, lease, or any legal document..."
                      className="w-full h-64 border-2 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-none"
                      disabled={loading}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleAnalyzeText()}
                    disabled={!text.trim() || loading}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy-light text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Analyzing Magic Happening...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Analyze Now</span>
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-ink-500">OR UPLOAD FILE</span>
                    </div>
                  </div>

                  <Upload onFileSelect={handleFileSelect} loading={loading} />
                </div>
              </Card>

              {/* Recent analyses sidebar */}
              {savedAnalyses.length > 0 && (
                <Card title="📚 Recent">
                  <div className="space-y-2">
                    {savedAnalyses.slice(0, 5).map((saved: any) => (
                      <button
                        key={saved.id}
                        onClick={() => loadSavedAnalysis(saved)}
                        className="w-full text-left p-3 bg-paper-50 hover:bg-brand-navy/5 rounded-lg border hover:border-brand-navy transition"
                      >
                        <div className="font-medium text-sm text-ink-900 truncate mb-1">
                          {saved.name}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-ink-500">
                            {new Date(saved.date).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            saved.analysis.recommendation.decision === 'sign' ? 'bg-green-100 text-green-700' :
                            saved.analysis.recommendation.decision === 'negotiate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
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
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-4">
                  <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 mb-1">Analysis Failed</h3>
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
                    <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-navy/20 to-brand-orange/10 rounded-full">
                      <svg className="w-12 h-12 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-ink-900 mb-3">
                      Let's Analyze Your Document
                    </h3>
                    <p className="text-ink-600 max-w-md mx-auto mb-6 leading-relaxed">
                      Paste text or upload a file to get instant analysis with:
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
                      {['Clear recommendation', '$ impact calculation', 'Negotiation templates', 'Calendar reminders'].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-left">
                          <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="animate-in slide-in-from-bottom-4">
                  <EnhancedSummaryPage 
                    analysis={analysis} 
                    onExport={handleExport}
                    documentName={documentName || 'Document'}
                  />
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-yellow-900">Legal Disclaimer</span>
                </div>
                <p className="text-xs text-yellow-800 leading-relaxed">
                  This analysis is for informational purposes only and does not constitute legal advice. 
                  Automated analysis may miss clauses or misinterpret language. Always consult a licensed 
                  attorney for legal decisions. We are not responsible for any decisions made based on this analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
