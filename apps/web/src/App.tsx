import { useState, useEffect, useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
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
import type { EnhancedAnalysisT } from './lib/schemas'

// Simple auth types (localStorage-based for MVP)
interface User {
  id: string
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

const PROFILES_KEY = 'paipersum_profiles'
const getStatsKey = (userId?: string) => userId ? `paipersum_stats_${userId}` : 'paipersum_stats_guest'
const getSavedKey = (userId?: string) => userId ? `paipersum_saved_${userId}` : 'paipersum_saved_guest'

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const demoAnalysis: EnhancedAnalysisT = {
  risk_score: 62,
  confidence: 0.78,
  clauses: [
    {
      title: 'Automatic Renewal Trap',
      summary: 'Contract renews for 24 months unless you cancel in writing 90 days before the term ends.',
      risk: 'red',
      citation: 'Section 5.2',
      impact: '$1,200/yr if forgotten'
    },
    {
      title: 'One-Sided Liability Cap',
      summary: 'Provider can only be liable up to 1x monthly fees while you have unlimited liability.',
      risk: 'yellow',
      citation: 'Section 8.1'
    },
    {
      title: 'Mandatory Arbitration',
      summary: 'Disputes must be handled privately in Delaware, limiting your ability to join class actions.',
      risk: 'yellow',
      citation: 'Section 9.4'
    }
  ],
  recommendation: {
    decision: 'negotiate',
    confidence: 0.82,
    reasoning: 'Key clauses create long-term financial risk. Negotiate renewal and liability before signing.',
    action_items: [
      'Shorten renewal to month-to-month after the first term',
      'Cap your liability at fees paid in the last 12 months',
      'Add mutual termination rights for service degradation'
    ],
    cost_impact: 1800
  },
  benchmarks: [
    {
      metric: 'Cancellation Notice',
      your_value: '90 days',
      average_value: '30 days',
      percentile: 12,
      is_good: false
    },
    {
      metric: 'Liability Cap',
      your_value: 'Unlimited',
      average_value: '12 months of fees',
      percentile: 8,
      is_good: false
    },
    {
      metric: 'Price Increase Clause',
      your_value: 'Provider can raise 12%',
      average_value: '5%',
      percentile: 34,
      is_good: false
    }
  ],
  negotiation_points: [
    {
      clause_title: 'Automatic Renewal',
      current_term: 'Renews for 24 months unless cancelled 90 days prior',
      suggested_term: 'Renews monthly with 30-day written notice',
      success_rate: 0.67,
      email_template: 'We need flexibility beyond the first year. Please update Section 5.2 so it renews monthly with a 30-day notice.',
      importance: 'high'
    },
    {
      clause_title: 'Liability Cap',
      current_term: 'Your liability is unlimited while ours is capped to 1 month of fees',
      suggested_term: 'Both parties capped at the higher of 12 months of fees or direct damages',
      success_rate: 0.58,
      email_template: 'Let’s align liability caps. Update Section 8.1 so both parties are capped at fees paid in the prior 12 months.',
      importance: 'medium'
    }
  ],
  cost_scenarios: [
    {
      name: 'Best Case',
      cost: 0,
      description: 'You cancel on time and never trigger liability issues.',
      is_best: true
    },
    {
      name: 'Expected Case',
      cost: 1200,
      description: 'You miss the renewal window once and pay for an extra quarter.',
      is_best: false
    },
    {
      name: 'Worst Case',
      cost: 5000,
      description: 'You breach the SLA and provider enforces unlimited liability.',
      is_best: false,
      warning: 'Uncapped liability puts your business at serious risk.'
    }
  ],
  share_url: 'https://demo.paipersum.com/share/lease-analysis'
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [analysis, setAnalysis] = useState<EnhancedAnalysisT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [text, setText] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [documentsAnalyzed, setDocumentsAnalyzed] = useState(0)
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [totalSavings, setTotalSavings] = useState(0)
  const {
    loginWithRedirect,
    logout: authLogout,
    isAuthenticated,
    isLoading,
    user: auth0User,
    getAccessTokenSilently
  } = useAuth0()

  const statsKey = useMemo(() => getStatsKey(user?.id), [user?.id])
  const savedKey = useMemo(() => getSavedKey(user?.id), [user?.id])

  // Check for admin route on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setShowAdmin(true)
    }
  }, [])

  // Hydrate Auth0 user profile into local storage so we can track docs/stats per account
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isAuthenticated || !auth0User?.sub) {
      setUser(null)
      return
    }

    const profiles = safeParse<Record<string, User>>(localStorage.getItem(PROFILES_KEY), {})
    const existingProfile = profiles[auth0User.sub]
    const auth0Claims = auth0User as Record<string, unknown>
    const rolesClaim = auth0Claims['https://paipersum.com/roles'] as string[] | undefined
    const metadataIsPro = Boolean(
      rolesClaim?.includes('pro') || auth0Claims['https://paipersum.com/isPro']
    )

    const normalizedProfile: User = {
      id: auth0User.sub,
      email: auth0User.email || existingProfile?.email || '',
      name: auth0User.name || auth0User.nickname || existingProfile?.name || 'PaiperSum user',
      isPro: existingProfile?.isPro ?? metadataIsPro,
      docsThisMonth: existingProfile?.docsThisMonth ?? 0,
      address: existingProfile?.address,
      phone: existingProfile?.phone,
      company: existingProfile?.company
    }

    if (metadataIsPro && !normalizedProfile.isPro) {
      normalizedProfile.isPro = true
    }

    profiles[normalizedProfile.id] = normalizedProfile
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
    setUser(normalizedProfile)
  }, [auth0User, isAuthenticated])

  // Reload stats/saved analyses when the active identity changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stats = safeParse<{ documentsAnalyzed: number; totalSavings: number }>(
      localStorage.getItem(statsKey),
      { documentsAnalyzed: 0, totalSavings: 0 }
    )
    setDocumentsAnalyzed(stats.documentsAnalyzed || 0)
    setTotalSavings(stats.totalSavings || 0)

    const saved = safeParse<SavedAnalysis[]>(localStorage.getItem(savedKey), [])
    setSavedAnalyses(saved)
  }, [savedKey, statsKey])

  // Check free tier limit
  const canAnalyze = (): boolean => {
    if (!user) {
      // Not logged in - allow 5 free analyses
      return documentsAnalyzed < 5
    }
    if (user.isPro) {
      return true // Unlimited
    }
    // Free tier - 30/month
    return user.docsThisMonth < 30
  }

  const persistProfile = (updatedUser: User) => {
    setUser(updatedUser)
    if (typeof window === 'undefined') return
    const profiles = safeParse<Record<string, User>>(localStorage.getItem(PROFILES_KEY), {})
    profiles[updatedUser.id] = updatedUser
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  }

  const persistStats = (docs: number, savings: number) => {
    setDocumentsAnalyzed(docs)
    setTotalSavings(savings)
    if (typeof window === 'undefined') return
    localStorage.setItem(statsKey, JSON.stringify({
      documentsAnalyzed: docs,
      totalSavings: savings
    }))
  }

  const persistSaved = (items: SavedAnalysis[]) => {
    setSavedAnalyses(items)
    if (typeof window === 'undefined') return
    localStorage.setItem(savedKey, JSON.stringify(items))
  }

  const fetchAuthToken = async (): Promise<string | undefined> => {
    if (!isAuthenticated) return undefined
    try {
      return await getAccessTokenSilently()
    } catch (tokenError) {
      console.warn('Failed to fetch Auth0 token', tokenError)
      return undefined
    }
  }

  const openAnalyzer = () => {
    setShowAnalyzer(true)
    setShowAccount(false)
    setShowAdmin(false)
  }

  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogoClick = () => {
    setShowAnalyzer(false)
    setShowAccount(false)
    setShowAdmin(false)
    scrollToTop()
  }

  const handleLogout = () => {
    setShowAccount(false)
    setShowAuth(false)
    authLogout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleAnalyzeText = async (textToAnalyze: string = text, name: string = documentName) => {
    if (!textToAnalyze.trim()) return
    
    // Check limits
    if (!canAnalyze()) {
      setError(user ? 'Monthly limit reached. Upgrade to Pro for unlimited analyses!' : 'Create an account to continue')
      setShowAuth(true)
      return
    }
    
    setError('')
    setLoading(true)
    openAnalyzer()
    
    try {
      const token = await fetchAuthToken()
      const result = await analyzeText(textToAnalyze, 'general', token)
      setAnalysis(result)
      
      // Track metrics
      const newCount = documentsAnalyzed + 1
      const newSavings = totalSavings + (result.recommendation.cost_impact || 0)
      persistStats(newCount, newSavings)
      
      // Update user monthly count
      if (user) {
        const updatedUser = { ...user, docsThisMonth: user.docsThisMonth + 1 }
        persistProfile(updatedUser)
      }
      
      // Save analysis
      const savedAnalysis: SavedAnalysis = {
        id: Date.now().toString(),
        name: name || `Document ${newCount}`,
        date: new Date().toISOString(),
        analysis: result
      }
      const newSaved = [savedAnalysis, ...savedAnalyses].slice(0, 10)
      persistSaved(newSaved)
      
      // Achievement notifications
      if (newCount === 1) {
        showAchievement('🎉 First Analysis Complete!', 'You\'re protecting yourself from hidden traps!')
      } else if (newCount === 5) {
        showAchievement('🏆 5 Documents Analyzed!', 'You\'re becoming a contract pro!')
      } else if (newCount === 10) {
        showAchievement('💎 Power User Unlocked!', `You've saved $${newSavings} total!`)
      } else if (newSavings >= 1000) {
        showAchievement('💰 $1,000+ Protected!', 'You\'ve avoided over $1,000 in potential costs!')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const showAchievement = (title: string, message: string) => {
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
    openAnalyzer()
    
    try {
      const token = await fetchAuthToken()
      const result = await analyzeFile(file, token)
      setAnalysis(result)
      
      const newCount = documentsAnalyzed + 1
      const newSavings = totalSavings + (result.recommendation.cost_impact || 0)
      persistStats(newCount, newSavings)
      
      if (user) {
        const updatedUser = { ...user, docsThisMonth: user.docsThisMonth + 1 }
        persistProfile(updatedUser)
      }
      
      const savedAnalysis: SavedAnalysis = {
        id: Date.now().toString(),
        name: file.name,
        date: new Date().toISOString(),
        analysis: result
      }
      const newSaved = [savedAnalysis, ...savedAnalyses].slice(0, 10)
      persistSaved(newSaved)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadDemoAnalysis = () => {
    setError('')
    setText(`Sample rental agreement excerpt:

Landlord may raise rent with 15 days notice and automatically renews for two years unless the tenant cancels in writing 90 days prior. Tenant assumes liability for any damages, regardless of cause.`)
    setDocumentName('Sample Lease Agreement')
    setAnalysis(demoAnalysis)
    openAnalyzer()
  }

  const handleExport = async () => {
    if (!text.trim()) return
    
    try {
      const token = await fetchAuthToken()
      const blob = await exportPDF(text, token)
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
  }

  const handleExportData = () => {
    if (typeof window === 'undefined') return
    const payload = {
      user,
      savedAnalyses,
      documentsAnalyzed,
      totalSavings
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paipersum-data-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteData = () => {
    if (!user || typeof window === 'undefined') return
    if (!confirm('This will delete your saved analyses and stats on this device. Continue?')) return

    localStorage.removeItem(statsKey)
    localStorage.removeItem(savedKey)
    const profiles = safeParse<Record<string, User>>(localStorage.getItem(PROFILES_KEY), {})
    delete profiles[user.id]
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))

    setSavedAnalyses([])
    setDocumentsAnalyzed(0)
    setTotalSavings(0)
    setShowAccount(false)
    authLogout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleClear = () => {
    setText('')
    setDocumentName('')
    setAnalysis(null)
    setError('')
    setShowAnalyzer(false)
    scrollToTop()
  }

  const loadSavedAnalysis = (saved: SavedAnalysis) => {
    setAnalysis(saved.analysis)
    setDocumentName(saved.name)
    openAnalyzer()
  }

  const getRemainingAnalyses = (): number => {
    if (!user) return Math.max(0, 5 - documentsAnalyzed)
    if (user.isPro) return 999999
    return Math.max(0, 30 - user.docsThisMonth)
  }

  // Auth Modal
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4">
        <div className="text-center mb-6">
          <Logo size="lg" />
          <h2 className="text-2xl font-bold text-ink-900 mt-4 mb-2">
            {isAuthenticated ? 'Upgrade to Pro' : 'Sign in or create an account'}
          </h2>
          <p className="text-ink-600">
            {isAuthenticated ? 'Get unlimited document analyses' : 'Use Auth0 for a persistent account across devices'}
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-ink-500">
            Checking your session...
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-4">
            <button
              onClick={() => loginWithRedirect()}
              className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
              </svg>
              Continue with Auth0 Secure Login
            </button>
            <button
              type="button"
              onClick={() => setShowAuth(false)}
              className="w-full px-6 py-3 bg-paper-100 text-ink-700 rounded-lg font-semibold hover:bg-paper-200 transition"
            >
              Maybe later
            </button>
            <p className="text-xs text-center text-ink-500 mt-2">
              You'll be redirected to Auth0. Accounts persist across devices and sessions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy/20">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-brand-navy">$20</div>
                <div className="text-sm text-ink-600">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Save all document history</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Share with family (5 accounts)</span>
                </li>
              </ul>
            </div>
            <button className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white rounded-xl font-bold hover:shadow-lg transition">
              Upgrade to Pro →
            </button>
            <button
              onClick={() => setShowAuth(false)}
              className="w-full px-6 py-3 bg-paper-100 text-ink-700 rounded-lg font-semibold hover:bg-paper-200 transition"
            >
              Maybe Later
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 border border-border-200 text-ink-600 rounded-lg font-semibold hover:bg-paper-50 transition"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-ink-600 gap-4">
        <Logo size="md" />
        <p className="text-sm">Loading your session...</p>
      </div>
    )
  }

  // Admin Portal
  if (showAdmin) {
    return <AdminPage onClose={() => {
      setShowAdmin(false)
      window.history.pushState({}, '', '/')
    }} />
  }

  // Landing page
  if (!showAnalyzer) {
    return (
      <>
        <Consent />
        <FloatingChatbot />
        {showAuth && <AuthModal />}
        
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Logo size="md" onClick={handleLogoClick} ariaLabel="PaiperSum home" />
              
              <div className="flex items-center gap-4">
                {documentsAnalyzed > 0 && (
                  <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-brand-navy/10 to-brand-orange/10 rounded-lg border border-brand-navy/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-navy">{documentsAnalyzed}</div>
                      <div className="text-xs text-ink-600">analyzed</div>
                    </div>
                    {totalSavings > 0 && (
                      <>
                        <div className="w-px h-8 bg-border-200"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-green">${totalSavings.toLocaleString()}</div>
                          <div className="text-xs text-ink-600">protected</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-ink-900">{user.name}</div>
                      <div className="text-xs text-ink-500">
                        {user.isPro ? 'Pro' : `${getRemainingAnalyses()} left this month`}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAccount(true)}
                      className="px-4 py-2 text-sm border rounded-lg hover:bg-paper-50 transition"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm border rounded-lg hover:bg-paper-50 transition"
                    >
                      Sign out
                    </button>
                    {!user.isPro && (
                      <button
                        onClick={() => setShowAuth(true)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-ink-900 rounded-lg font-semibold text-sm hover:shadow-lg transition"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-4 py-2 border-2 border-brand-navy text-brand-navy rounded-lg font-semibold hover:bg-brand-navy hover:text-white transition"
                  >
                    Sign in / Create account
                  </button>
                )}
                
                <button
                  onClick={openAnalyzer}
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
          <Hero onStartAnalyzer={openAnalyzer} onSeeExample={handleLoadDemoAnalysis} />

          {/* Recent analyses */}
          {savedAnalyses.length > 0 && (
            <div className="bg-paper-50 py-12">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-ink-900 mb-6">📚 Your Recent Analyses</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedAnalyses.slice(0, 6).map((saved) => (
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
                Join {Math.max(5000, documentsAnalyzed * 50).toLocaleString()}+ people who analyze before they sign
              </p>
              {totalSavings > 0 && (
                <div className="inline-block mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-brand-orange font-bold text-lg">
                    Our community has saved ${(totalSavings * 50).toLocaleString()}+ collectively!
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openAnalyzer}
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
                    <Logo size="md" />
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
                    <li><button onClick={openAnalyzer} className="hover:text-white transition">Try Now</button></li>
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
                  onClick={() => setShowAdmin(true)}
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

  // Render Account page when selected
  if (showAccount && user) {
    return (
      <AccountPage
        user={user}
        onUpdate={(updated) => {
          persistProfile(updated)
        }}
        onCancel={() => setShowAccount(false)}
        onUpgrade={() => setShowAuth(true)}
        totalSavings={totalSavings}
        documentsAnalyzed={documentsAnalyzed}
        onExportData={handleExportData}
        onDeleteData={handleDeleteData}
      />
    )
  }

  // Analyzer view
  return (
    <>
      <Consent />
      <FloatingChatbot />
      {showAuth && <AuthModal />}
      
      <div className="min-h-screen bg-paper-50">
        {/* Top bar with stats */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="text-ink-600 hover:text-ink-900 flex items-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Home</span>
            </button>

            <Logo size="sm" onClick={handleClear} ariaLabel="Back to home" />

            {/* Stats */}
            <div className="flex items-center gap-3">
              {user && !user.isPro && (
                <div className="text-right">
                  <div className="text-xs text-ink-500">Remaining</div>
                  <div className="text-sm font-bold text-brand-navy">{getRemainingAnalyses()}/30</div>
                </div>
              )}
              
              <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-brand-navy/10 to-brand-orange/10 rounded-lg border border-brand-navy/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-navy">{documentsAnalyzed}</div>
                  <div className="text-xs text-ink-600">docs</div>
                </div>
                {totalSavings > 0 && (
                  <>
                    <div className="w-px h-6 bg-border-200"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-brand-green">${totalSavings.toLocaleString()}</div>
                      <div className="text-xs text-ink-600">saved</div>
                    </div>
                  </>
                )}
              </div>
              
              {user && !user.isPro && (
                <button
                  onClick={() => setShowAuth(true)}
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
                    {savedAnalyses.slice(0, 5).map((saved) => (
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
                      <div className="flex items-center gap-2 text-left">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Clear recommendation</span>
                      </div>
                      <div className="flex items-center gap-2 text-left">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>$ impact calculation</span>
                      </div>
                      <div className="flex items-center gap-2 text-left">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Negotiation templates</span>
                      </div>
                      <div className="flex items-center gap-2 text-left">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Calendar reminders</span>
                      </div>
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
