import { useState, useEffect } from 'react'
import Logo from '../components/Logo'
import { Card } from '../components/Cards'

// Admin credentials (in production, this would be server-side)
const ADMIN_CREDENTIALS = {
  email: 'admin@paipersum.com',
  password: 'PaiperSum2025!'
}

interface AdminUser {
  email: string
  name: string
  isPro: boolean
  docsThisMonth: number
  createdAt: string
}

interface AnalyticsData {
  totalUsers: number
  proUsers: number
  totalDocuments: number
  totalSavings: number
  recentSignups: AdminUser[]
}

export default function AdminPage({ onClose }: { onClose: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'analytics' | 'settings'>('dashboard')
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    proUsers: 0,
    totalDocuments: 0,
    totalSavings: 0,
    recentSignups: []
  })

  // Check if admin is already logged in
  useEffect(() => {
    const adminSession = localStorage.getItem('paipersum_admin')
    if (adminSession === 'authenticated') {
      setIsAuthenticated(true)
    }
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    // Simulate loading analytics from localStorage/API
    const users: AdminUser[] = []
    const allKeys = Object.keys(localStorage)
    
    // Count documents analyzed and savings
    const totalDocs = parseInt(localStorage.getItem('docs_analyzed') || '0')
    const totalSavings = parseInt(localStorage.getItem('total_savings') || '0')
    
    // Get user data if exists
    const userData = localStorage.getItem('paipersum_user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        users.push({
          ...user,
          createdAt: new Date().toISOString()
        })
      } catch (e) {
        console.error('Error parsing user data')
      }
    }

    setAnalytics({
      totalUsers: users.length + Math.floor(Math.random() * 100) + 50, // Simulated
      proUsers: Math.floor(Math.random() * 20) + 5,
      totalDocuments: totalDocs + Math.floor(Math.random() * 500) + 100,
      totalSavings: totalSavings + Math.floor(Math.random() * 50000) + 10000,
      recentSignups: users
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem('paipersum_admin', 'authenticated')
    } else {
      setLoginError('Invalid email or password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('paipersum_admin')
    onClose()
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="lg" />
              </div>
              <h1 className="text-2xl font-bold text-ink-900">Admin Portal</h1>
              <p className="text-ink-600 mt-2">Sign in to access the admin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  placeholder="admin@paipersum.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white rounded-xl font-bold hover:shadow-lg transition"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 bg-paper-100 text-ink-700 rounded-lg font-semibold hover:bg-paper-200 transition"
              >
                Back to Home
              </button>
            </form>

            <div className="mt-6 p-4 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
              <p className="text-sm text-ink-600">
                <strong>Demo Credentials:</strong><br />
                Email: admin@paipersum.com<br />
                Password: PaiperSum2025!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-paper-50">
      {/* Admin Header */}
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="hidden sm:block">
              <span className="px-3 py-1 bg-brand-orange text-brand-navy-dark rounded-full text-xs font-bold">
                ADMIN
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-100 hidden sm:block">
              Logged in as Admin
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {(['dashboard', 'users', 'analytics', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold text-sm capitalize transition ${
                  activeTab === tab
                    ? 'bg-white text-brand-navy rounded-t-lg'
                    : 'text-blue-100 hover:text-white hover:bg-white/10 rounded-t-lg'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-ink-900">Dashboard Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-navy mb-1">
                    {analytics.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-ink-600">Total Users</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-orange mb-1">
                    {analytics.proUsers}
                  </div>
                  <div className="text-sm text-ink-600">Pro Subscribers</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-green mb-1">
                    {analytics.totalDocuments.toLocaleString()}
                  </div>
                  <div className="text-sm text-ink-600">Documents Analyzed</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    ${analytics.totalSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-ink-600">User Savings</div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card title="⚡ Quick Actions">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-brand-navy/5 hover:bg-brand-navy/10 rounded-lg text-left transition">
                  <div className="text-2xl mb-2">📧</div>
                  <div className="font-semibold text-ink-900">Send Newsletter</div>
                  <div className="text-sm text-ink-600">Email all users</div>
                </button>
                <button className="p-4 bg-brand-navy/5 hover:bg-brand-navy/10 rounded-lg text-left transition">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold text-ink-900">Export Reports</div>
                  <div className="text-sm text-ink-600">Download CSV</div>
                </button>
                <button className="p-4 bg-brand-navy/5 hover:bg-brand-navy/10 rounded-lg text-left transition">
                  <div className="text-2xl mb-2">🔔</div>
                  <div className="font-semibold text-ink-900">Push Notification</div>
                  <div className="text-sm text-ink-600">Notify all users</div>
                </button>
                <button className="p-4 bg-brand-navy/5 hover:bg-brand-navy/10 rounded-lg text-left transition">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-semibold text-ink-900">System Status</div>
                  <div className="text-sm text-ink-600">All systems operational</div>
                </button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="📈 Recent Activity">
              <div className="space-y-3">
                {[
                  { action: 'New user signup', user: 'john@example.com', time: '2 minutes ago' },
                  { action: 'Document analyzed', user: 'jane@example.com', time: '5 minutes ago' },
                  { action: 'Pro subscription', user: 'bob@example.com', time: '15 minutes ago' },
                  { action: 'PDF exported', user: 'alice@example.com', time: '1 hour ago' },
                  { action: 'New user signup', user: 'charlie@example.com', time: '2 hours ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-paper-50 rounded-lg">
                    <div>
                      <div className="font-medium text-ink-900">{activity.action}</div>
                      <div className="text-sm text-ink-500">{activity.user}</div>
                    </div>
                    <div className="text-sm text-ink-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ink-900">User Management</h2>
              <button className="px-4 py-2 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy-light transition">
                + Add User
              </button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-200">
                      <th className="text-left py-3 px-4 font-semibold text-ink-700">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-ink-700">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold text-ink-700">Docs This Month</th>
                      <th className="text-left py-3 px-4 font-semibold text-ink-700">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-ink-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'John Doe', email: 'john@example.com', plan: 'Pro', docs: 45, status: 'Active' },
                      { name: 'Jane Smith', email: 'jane@example.com', plan: 'Free', docs: 12, status: 'Active' },
                      { name: 'Bob Wilson', email: 'bob@example.com', plan: 'Pro', docs: 78, status: 'Active' },
                      { name: 'Alice Brown', email: 'alice@example.com', plan: 'Free', docs: 3, status: 'Inactive' },
                      { name: 'Charlie Davis', email: 'charlie@example.com', plan: 'Free', docs: 28, status: 'Active' },
                    ].map((user, i) => (
                      <tr key={i} className="border-b border-border-200 hover:bg-paper-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-ink-900">{user.name}</div>
                          <div className="text-sm text-ink-500">{user.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            user.plan === 'Pro' 
                              ? 'bg-brand-orange/20 text-brand-orange' 
                              : 'bg-paper-100 text-ink-600'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-ink-700">{user.docs}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-brand-navy hover:underline text-sm mr-3">Edit</button>
                          <button className="text-red-600 hover:underline text-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-ink-900">Analytics</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card title="📈 Documents Analyzed (Last 7 Days)">
                <div className="h-64 flex items-end justify-around gap-2 pt-4">
                  {[65, 45, 78, 52, 90, 68, 85].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-brand-navy to-brand-navy-light rounded-t-lg transition-all hover:from-brand-orange hover:to-brand-orange-light"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs text-ink-500 mt-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="👥 User Growth">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-600">New Users Today</span>
                    <span className="font-bold text-brand-navy">+23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-600">New Users This Week</span>
                    <span className="font-bold text-brand-navy">+156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-600">New Users This Month</span>
                    <span className="font-bold text-brand-navy">+892</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-600">Conversion Rate</span>
                    <span className="font-bold text-brand-green">12.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-600">Churn Rate</span>
                    <span className="font-bold text-red-600">2.3%</span>
                  </div>
                </div>
              </Card>

              <Card title="💰 Revenue">
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-brand-green">$4,580</div>
                    <div className="text-ink-600">Monthly Recurring Revenue</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ink-900">229</div>
                      <div className="text-sm text-ink-600">Pro Subscribers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ink-900">$20</div>
                      <div className="text-sm text-ink-600">Avg. Revenue/User</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="📄 Top Document Types">
                <div className="space-y-3">
                  {[
                    { type: 'Terms of Service', count: 1234, percent: 35 },
                    { type: 'Lease Agreements', count: 892, percent: 25 },
                    { type: 'Employment Contracts', count: 678, percent: 19 },
                    { type: 'Gym Memberships', count: 456, percent: 13 },
                    { type: 'Other', count: 284, percent: 8 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-ink-700">{item.type}</span>
                        <span className="text-sm text-ink-500">{item.count}</span>
                      </div>
                      <div className="w-full bg-paper-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-brand-navy to-brand-navy-light h-2 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-ink-900">Settings</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card title="🔧 General Settings">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="PaiperSum"
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Support Email</label>
                    <input
                      type="email"
                      defaultValue="support@paipersum.com"
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Free Tier Limit</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <button className="px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy-light transition">
                    Save Changes
                  </button>
                </div>
              </Card>

              <Card title="💳 Subscription Pricing">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Monthly Price ($)</label>
                    <input
                      type="number"
                      defaultValue="20"
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Annual Price ($)</label>
                    <input
                      type="number"
                      defaultValue="200"
                      className="w-full px-4 py-3 border-2 border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <button className="px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy-light transition">
                    Update Pricing
                  </button>
                </div>
              </Card>

              <Card title="🔐 Security">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-paper-50 rounded-lg">
                    <div>
                      <div className="font-medium text-ink-900">Two-Factor Authentication</div>
                      <div className="text-sm text-ink-500">Add an extra layer of security</div>
                    </div>
                    <button className="px-4 py-2 bg-brand-navy text-white rounded-lg text-sm font-semibold">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-paper-50 rounded-lg">
                    <div>
                      <div className="font-medium text-ink-900">Change Admin Password</div>
                      <div className="text-sm text-ink-500">Last changed 30 days ago</div>
                    </div>
                    <button className="px-4 py-2 border-2 border-brand-navy text-brand-navy rounded-lg text-sm font-semibold hover:bg-brand-navy hover:text-white transition">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-paper-50 rounded-lg">
                    <div>
                      <div className="font-medium text-ink-900">API Keys</div>
                      <div className="text-sm text-ink-500">Manage API access</div>
                    </div>
                    <button className="px-4 py-2 border-2 border-brand-navy text-brand-navy rounded-lg text-sm font-semibold hover:bg-brand-navy hover:text-white transition">
                      Manage
                    </button>
                  </div>
                </div>
              </Card>

              <Card title="📧 Email Templates">
                <div className="space-y-3">
                  {['Welcome Email', 'Password Reset', 'Subscription Confirmation', 'Weekly Digest'].map((template, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-paper-50 rounded-lg">
                      <span className="font-medium text-ink-900">{template}</span>
                      <button className="text-brand-navy hover:underline text-sm">Edit</button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
