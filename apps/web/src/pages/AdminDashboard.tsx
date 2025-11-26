import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const ADMIN_TOKEN = 'admin_secure_token_change_in_production'

interface SecurityEvent {
  id: string
  timestamp: string
  event_type: string
  severity: string
  ip_address: string
  endpoint: string
  details: any
  blocked: boolean
}

interface DashboardData {
  overview: {
    total_events_hour: number
    total_events_day: number
    critical_events: number
    high_events: number
    blocked_ips_count: number
    active_threats: number
  }
  severity_breakdown: Record<string, number>
  top_attacking_ips: Array<{ ip: string; count: number; reputation: number }>
  attack_vectors: Record<string, number>
  timeline: Array<{ time: string; count: number }>
  blocked_ips: string[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [selectedIP, setSelectedIP] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/security/dashboard`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      })
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/security/events?limit=50`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      })
      setEvents(response.data.events)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const blockIP = async (ip: string) => {
    try {
      await axios.post(`${API_URL}/admin/security/ip/${ip}/block`, {}, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      })
      await fetchDashboard()
      alert(`Blocked IP: ${ip}`)
    } catch (error) {
      alert('Failed to block IP')
    }
  }

  const unblockIP = async (ip: string) => {
    try {
      await axios.post(`${API_URL}/admin/security/ip/${ip}/unblock`, {}, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      })
      await fetchDashboard()
      alert(`Unblocked IP: ${ip}`)
    } catch (error) {
      alert('Failed to unblock IP')
    }
  }

  useEffect(() => {
    if (authenticated) {
      setLoading(true)
      Promise.all([fetchDashboard(), fetchEvents()])
        .finally(() => setLoading(false))
      
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchDashboard()
        fetchEvents()
      }, 10000)
      
      return () => clearInterval(interval)
    }
  }, [authenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_TOKEN) {
      setAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-slate-400">Security Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Admin Token
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin token"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚡</div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-900 text-red-100 border-red-700'
      case 'high': return 'bg-orange-900 text-orange-100 border-orange-700'
      case 'medium': return 'bg-yellow-900 text-yellow-100 border-yellow-700'
      case 'low': return 'bg-blue-900 text-blue-100 border-blue-700'
      default: return 'bg-slate-800 text-slate-300 border-slate-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🛡️</div>
            <div>
              <h1 className="text-xl font-bold text-white">Security Command Center</h1>
              <p className="text-xs text-slate-400">Real-time threat monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-semibold border border-green-700">
              🟢 ACTIVE
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="📊"
            title="Events (Hour)"
            value={data.overview.total_events_hour}
            subtitle="Last 60 minutes"
            color="blue"
          />
          <StatCard
            icon="⚠️"
            title="Critical Threats"
            value={data.overview.critical_events}
            subtitle="Requires attention"
            color="red"
          />
          <StatCard
            icon="🚫"
            title="Blocked IPs"
            value={data.overview.blocked_ips_count}
            subtitle="Currently banned"
            color="orange"
          />
          <StatCard
            icon="🎯"
            title="Active Threats"
            value={data.overview.active_threats}
            subtitle="Suspicious activity"
            color="yellow"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Top Attacking IPs */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Top Attacking IPs
            </h2>
            <div className="space-y-2">
              {data.top_attacking_ips.slice(0, 10).map((ip, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{idx + 1}</div>
                    <div>
                      <div className="font-mono text-white">{ip.ip}</div>
                      <div className="text-xs text-slate-400">
                        Reputation: {ip.reputation}/100
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm font-bold">
                      {ip.count} attacks
                    </div>
                    {data.blocked_ips.includes(ip.ip) ? (
                      <button
                        onClick={() => unblockIP(ip.ip)}
                        className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-sm hover:bg-green-900/50"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockIP(ip.ip)}
                        className="px-3 py-1 bg-red-900/30 text-red-400 rounded-lg text-sm hover:bg-red-900/50"
                      >
                        Block
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attack Vectors */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🔍</span> Attack Vectors
            </h2>
            <div className="space-y-3">
              {Object.entries(data.attack_vectors).map(([vector, count]) => (
                <div key={vector} className="flex items-center justify-between">
                  <div className="text-slate-300 capitalize">{vector.replace('_', ' ')}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-900 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (count / data.overview.total_events_hour) * 100)}%` }}
                      />
                    </div>
                    <div className="text-white font-bold w-12 text-right">{count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📜</span> Recent Security Events
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="pb-3 text-slate-400 font-semibold">Time</th>
                  <th className="pb-3 text-slate-400 font-semibold">Severity</th>
                  <th className="pb-3 text-slate-400 font-semibold">Type</th>
                  <th className="pb-3 text-slate-400 font-semibold">IP Address</th>
                  <th className="pb-3 text-slate-400 font-semibold">Endpoint</th>
                  <th className="pb-3 text-slate-400 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 20).map((event) => (
                  <tr key={event.id} className="border-b border-slate-700/50 hover:bg-slate-900/30">
                    <td className="py-3 text-slate-400 text-sm">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 text-sm capitalize">
                      {event.event_type.replace('_', ' ')}
                    </td>
                    <td className="py-3 text-white font-mono text-sm">{event.ip_address}</td>
                    <td className="py-3 text-slate-400 text-sm font-mono">{event.endpoint}</td>
                    <td className="py-3">
                      {event.blocked ? (
                        <span className="text-red-400 text-sm">🚫 Blocked</span>
                      ) : (
                        <button
                          onClick={() => blockIP(event.ip_address)}
                          className="text-orange-400 hover:text-orange-300 text-sm"
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  const colorClasses = {
    blue: 'from-blue-900/50 to-blue-800/50 border-blue-700',
    red: 'from-red-900/50 to-red-800/50 border-red-700',
    orange: 'from-orange-900/50 to-orange-800/50 border-orange-700',
    yellow: 'from-yellow-900/50 to-yellow-800/50 border-yellow-700',
    green: 'from-green-900/50 to-green-800/50 border-green-700'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        <div className="text-4xl font-bold text-white">{value}</div>
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-400 text-sm">{subtitle}</p>
    </div>
  )
}
