import { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import { acknowledgeThreat, fetchThreatFeed } from '../lib/api'
import type { ThreatDashboardT, ThreatEventT } from '../lib/schemas'

type AdminPortalPageProps = {
  onClose: () => void
}

const severityBadge: Record<ThreatEventT['severity'], string> = {
  critical: 'bg-red-500/20 text-red-200 border border-red-400/40',
  high: 'bg-orange-500/20 text-orange-200 border border-orange-400/40',
  medium: 'bg-yellow-500/10 text-yellow-200 border border-yellow-400/40',
  low: 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/40'
}

const statusBadge: Record<ThreatEventT['status'], string> = {
  blocked: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40',
  mitigated: 'bg-slate-500/40 text-slate-200 border border-slate-400/40',
  investigating: 'bg-yellow-500/10 text-yellow-200 border border-yellow-400/40'
}

export default function AdminPortalPage({ onClose }: AdminPortalPageProps) {
  const [dashboard, setDashboard] = useState<ThreatDashboardT | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ackInFlight, setAckInFlight] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setError('')
      setLoading(!dashboard)
      setRefreshing(!!dashboard)
      const data = await fetchThreatFeed()
      setDashboard(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load threat feed')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleAcknowledge = async (eventId: string) => {
    try {
      setAckInFlight(eventId)
      const updated = await acknowledgeThreat(eventId)
      setDashboard((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          events: prev.events.map((event) => (event.id === updated.id ? updated : event))
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge threat')
    } finally {
      setAckInFlight(null)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white flex items-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <Logo size="sm" />
            <div className="text-sm text-slate-400 hidden sm:block">
              Admin Threat Desk · {dashboard?.last_updated ? new Date(dashboard.last_updated).toLocaleTimeString() : 'loading...'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-xs text-red-300">{error}</span>}
            <button
              onClick={loadData}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold hover:border-white/40 transition disabled:opacity-50"
            >
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {loading && (
          <div className="animate-pulse text-slate-400">Loading security telemetry…</div>
        )}

        {!loading && dashboard && (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {dashboard.stats.map((stat) => (
                <div key={stat.label} className="bg-slate-900/60 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <div className="flex items-end justify-between mt-3">
                    <span className="text-3xl font-semibold">{stat.value}</span>
                    <span className={`text-sm ${stat.is_positive ? 'text-emerald-300' : 'text-red-300'}`}>
                      {stat.change > 0 ? '+' : ''}
                      {stat.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Events table */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div>
                    <p className="text-lg font-semibold">Threat timeline</p>
                    <p className="text-sm text-slate-400">Live feed of blocked attempts and investigations</p>
                  </div>
                  <span className="text-xs text-slate-400 uppercase">Live</span>
                </div>
                <div className="divide-y divide-white/5">
                  {dashboard.events.map((event) => (
                    <div key={event.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityBadge[event.severity]}`}>
                            {event.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge[event.status]}`}>
                            {event.status}
                          </span>
                          <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="mt-2 font-medium">{event.vector.replace('_', ' ')}</p>
                        <p className="text-sm text-slate-400">
                          {event.notes}
                        </p>
                        <div className="mt-2 text-xs text-slate-500">
                          {event.source_ip} · {event.location} · {event.isp} · {event.attempts.toLocaleString()} attempts
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleAcknowledge(event.id)}
                          disabled={event.status === 'mitigated' || ackInFlight === event.id}
                          className="px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold hover:border-white/40 transition disabled:opacity-40"
                        >
                          {event.status === 'mitigated' ? 'Acknowledged' : ackInFlight === event.id ? 'Working…' : 'Acknowledge'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Watchlist */}
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
                  <p className="text-lg font-semibold mb-3">Watchlist</p>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {dashboard.watchlist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-0.5">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
                  <p className="text-lg font-semibold mb-3">Next actions</p>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {dashboard.recommendations.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-emerald-300 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">Integrations</p>
                <p className="text-xs text-slate-500">Free connectors · No paid add-ons</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dashboard.integrations.map((integration) => (
                  <div key={integration.name} className="border border-white/10 rounded-xl p-4">
                    <p className="font-semibold">{integration.name}</p>
                    <p className={`text-xs uppercase tracking-wide mt-1 ${
                      integration.status === 'ok'
                        ? 'text-emerald-300'
                        : integration.status === 'warning'
                        ? 'text-yellow-300'
                        : 'text-red-300'
                    }`}>
                      {integration.status}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">{integration.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
