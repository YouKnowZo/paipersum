import { useState } from 'react'
import { Card } from '../components/Cards'

interface User {
  email: string
  name: string
  isPro: boolean
  docsThisMonth: number
  address?: string
  phone?: string
  company?: string
}

interface AccountPageProps {
  user: User
  onUpdate: (updatedUser: User) => void
  onCancel: () => void
  onUpgrade: () => void
  totalSavings: number
  documentsAnalyzed: number
}

export default function AccountPage({ 
  user, 
  onUpdate, 
  onCancel, 
  onUpgrade,
  totalSavings,
  documentsAnalyzed
}: AccountPageProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    company: user.company || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      ...user,
      ...formData
    })
    setEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-paper-50">
      {/* Header */}
      <div className="bg-white border-b border-border-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <button
            onClick={onCancel}
            className="text-ink-600 hover:text-ink-900 flex items-center gap-2 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold text-ink-900">Account Settings</h1>
          <p className="text-ink-600 mt-2">Manage your profile and subscription</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Account Status Card */}
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-bright mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-bold text-ink-900 mb-1">{user.name}</h3>
                <p className="text-sm text-ink-500 mb-4">{user.email}</p>
                
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  user.isPro 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-ink-900' 
                    : 'bg-paper-100 text-ink-700'
                }`}>
                  {user.isPro ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Pro Member
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Starter
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card title="📊 Your Stats">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Documents Analyzed</span>
                  <span className="text-2xl font-bold text-brand-blue">{documentsAnalyzed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Money Protected</span>
                  <span className="text-2xl font-bold text-brand-green">${totalSavings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">This Month</span>
                  <span className="text-lg font-bold text-ink-900">{user.docsThisMonth}/{user.isPro ? '∞' : '30'}</span>
                </div>
              </div>
            </Card>

            {/* Upgrade Card */}
            {!user.isPro && (
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-3">⭐</div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-ink-600 mb-4">
                    Unlimited analyses + priority support
                  </p>
                  <div className="text-3xl font-bold text-brand-blue mb-4">$20<span className="text-sm text-ink-500">/mo</span></div>
                  <button
                    onClick={onUpgrade}
                    className="w-full px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-blue-bright text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Upgrade Now →
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card title="👤 Profile Information">
              {!editing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-border-200 pb-4">
                    <div>
                      <label className="text-sm font-semibold text-ink-700">Full Name</label>
                      <p className="text-ink-900 mt-1">{user.name || 'Not set'}</p>
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 border-2 border-brand-blue text-brand-blue rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </div>

                  <div className="border-b border-border-200 pb-4">
                    <label className="text-sm font-semibold text-ink-700">Email Address</label>
                    <p className="text-ink-900 mt-1">{user.email}</p>
                  </div>

                  <div className="border-b border-border-200 pb-4">
                    <label className="text-sm font-semibold text-ink-700">Phone Number</label>
                    <p className="text-ink-900 mt-1">{user.phone || 'Not set'}</p>
                  </div>

                  <div className="border-b border-border-200 pb-4">
                    <label className="text-sm font-semibold text-ink-700">Company</label>
                    <p className="text-ink-900 mt-1">{user.company || 'Not set'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink-700">Address</label>
                    <p className="text-ink-900 mt-1">{user.address || 'Not set'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-blue-bright text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          address: user.address || '',
                          company: user.company || '',
                        })
                      }}
                      className="flex-1 px-6 py-3 bg-paper-100 text-ink-700 rounded-lg font-semibold hover:bg-paper-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </Card>

            {/* Subscription & Billing */}
            <Card title="💳 Subscription & Billing">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-paper-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-ink-900">Current Plan</h4>
                    <p className="text-sm text-ink-600 mt-1">
                      {user.isPro ? 'Pro — Unlimited analyses' : 'Starter — Monthly analysis limit applies'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-ink-900">
                      {user.isPro ? '$20' : '—'}
                    </div>
                    <div className="text-xs text-ink-500">/month</div>
                  </div>
                </div>

                {user.isPro ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-ink-600">
                      <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-600">
                      <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Payment method: •••• 4242</span>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition">
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-ink-600 mb-4">Upgrade to Pro for unlimited analyses</p>
                    <button
                      onClick={onUpgrade}
                      className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-blue-bright text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      Upgrade to Pro →
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* Privacy & Data */}
            <Card title="🔐 Privacy & Data">
              <div className="space-y-3">
                <p className="text-sm text-ink-600">
                  You can export or delete your data at any time. Exports include your profile and saved analyses.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      const payload = {
                        user,
                        savedAnalyses: JSON.parse(localStorage.getItem('saved_analyses') || '[]'),
                        docsAnalyzed: parseInt(localStorage.getItem('docs_analyzed') || '0'),
                        totalSavings: parseInt(localStorage.getItem('total_savings') || '0'),
                      }
                      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `paipersum-data-${new Date().toISOString()}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition"
                  >
                    Export my data
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm('This will delete your account data on this device. Continue?')) return
                      localStorage.removeItem('paipersum_user')
                      localStorage.removeItem('saved_analyses')
                      localStorage.removeItem('docs_analyzed')
                      localStorage.removeItem('total_savings')
                      window.location.href = '/'
                    }}
                    className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
                  >
                    Delete my account & data
                  </button>
                  <a
                    href="mailto:privacy@paipersum.com?subject=Data%20access%20request"
                    className="px-4 py-2 bg-paper-100 text-ink-700 rounded-lg font-semibold hover:bg-paper-200 transition text-center"
                  >
                    Request data by email
                  </a>
                </div>
              </div>
            </Card>

            {/* Payment History (Placeholder) */}
            <Card title="🧾 Payment History">
              <p className="text-sm text-ink-600 mb-3">
                Connect your Stripe account to display invoices and receipts here.
              </p>
              <div className="rounded-lg border border-border-200 p-4 bg-paper-50 text-sm text-ink-600">
                No payments to show yet.
              </div>
            </Card>

            {/* Usage History */}
            <Card title="📈 Usage This Month">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Documents Analyzed</span>
                  <span className="font-bold text-ink-900">{user.docsThisMonth} / {user.isPro ? '∞' : '30'}</span>
                </div>
                
                <div className="w-full bg-paper-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      user.isPro ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-brand-blue to-brand-blue-bright'
                    }`}
                    style={{ width: user.isPro ? '100%' : `${Math.min((user.docsThisMonth / 30) * 100, 100)}%` }}
                  />
                </div>

                <p className="text-sm text-ink-500">
                  {user.isPro 
                    ? 'Unlimited analyses - analyze as many documents as you need!' 
                    : `${30 - user.docsThisMonth} analyses remaining this month`
                  }
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
