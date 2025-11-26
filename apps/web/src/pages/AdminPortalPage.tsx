import { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import { acknowledgeThreat, fetchAdminDashboard, setAdminPortalKey, updateAdminConfig } from '../lib/api'
import type { AdminDashboardT, ThreatEventT, ConfigSettingsT } from '../lib/schemas'

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

const healthBadge = (status: 'ok' | 'warning' | 'critical') =>
  status === 'ok'
    ? 'text-emerald-300'
    : status === 'warning'
      ? 'text-yellow-300'
      : 'text-red-300'

export default function AdminPortalPage({ onClose }: AdminPortalPageProps) {
  const [dashboard, setDashboard] = useState<AdminDashboardT | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ackInFlight, setAckInFlight] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [needsKey, setNeedsKey] = useState(true)
  const [adminKeyInput, setAdminKeyInput] = useState('')
  const [configDraft, setConfigDraft] = useState({
    rate_limit_window: '',
    rate_limit_limit: '',
    maintenance_mode: false,
    allowed_admin_ips: ''
  })
  const [configSaving, setConfigSaving] = useState(false)
  const [configMessage, setConfigMessage] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = sessionStorage.getItem('paipersum_admin_key')
    if (stored) {
      setAdminPortalKey(stored)
      setAdminKeyInput(stored)
      setNeedsKey(false)
      loadData(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!dashboard) return
    setConfigDraft({
      rate_limit_window: String(dashboard.config.rate_limit_window),
      rate_limit_limit: String(dashboard.config.rate_limit_limit),
      maintenance_mode: dashboard.config.maintenance_mode,
      allowed_admin_ips: dashboard.config.allowed_admin_ips.join(', ')
    })
  }, [dashboard])

  const loadData = async (initial = false) => {
    if (needsKey) return
    try {
      setError('')
      if (initial) {
        setLoading(true)
      } else {
        setLoading(!dashboard)
        setRefreshing(!!dashboard)
      }
      const data = await fetchAdminDashboard()
      setDashboard(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load admin dashboard'
      setError(message)
      if (message.toLowerCase().includes('forbidden') || message.toLowerCase().includes('key')) {
        handleResetKey()
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminKeyInput.trim()) {
      setError('Enter your admin portal key.')
      return
    }
    setAdminPortalKey(adminKeyInput.trim())
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('paipersum_admin_key', adminKeyInput.trim())
    }
    setNeedsKey(false)
    loadData(true)
  }

  const handleResetKey = () => {
    setNeedsKey(true)
    setDashboard(null)
    setAdminPortalKey(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('paipersum_admin_key')
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

  const handleConfigSave = async () => {
    try {
      setConfigSaving(true)
      setConfigMessage('')
      const payload: Partial<ConfigSettingsT> = {
        rate_limit_window: Number(configDraft.rate_limit_window),
        rate_limit_limit: Number(configDraft.rate_limit_limit),
        maintenance_mode: configDraft.maintenance_mode,
        allowed_admin_ips: configDraft.allowed_admin_ips
          .split(',')
          .map((ip) => ip.trim())
          .filter(Boolean)
      }
      const updated = await updateAdminConfig(payload)
      setDashboard((prev) => (prev ? { ...prev, config: updated } : prev))
      setConfigMessage('Config saved')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update config')
    } finally {
      setConfigSaving(false)
      setTimeout(() => setConfigMessage(''), 4000)
    }
  }

  useEffect(() => {
    if (needsKey) return
    const interval = setInterval(() => loadData(), 60000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsKey])

  if (needsKey) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900/80 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <p className="font-semibold text-lg">Admin Security Portal</p>
              <p className="text-sm text-slate-400">Enter passcode to unlock telemetry</p>
            </div>
          </div>
          {error && <div className="p-3 rounded bg-red-500/10 text-red-200 text-sm">{error}</div>}
          <form className="space-y-4" onSubmit={handleUnlock}>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Admin key</label>
              <input
                type="password"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="••••••••••"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition"
            >
              Unlock portal
            </button>
          </form>
          <button onClick={onClose} className="text-slate-400 text-sm hover:text-white transition">
            ← Back to product
          </button>
        </div>
      </div>
    )
  }

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
              Admin Portal · {dashboard?.last_updated ? new Date(dashboard.last_updated).toLocaleTimeString() : 'loading...'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-xs text-red-300">{error}</span>}
            <button
              onClick={() => loadData()}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold hover:border-white/40 transition disabled:opacity-50"
            >
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              onClick={handleResetKey}
              className="px-4 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white transition"
            >
              Lock
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {loading && (
          <div className="animate-pulse text-slate-400">Loading telemetry…</div>
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

            {/* Usage analytics */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">Usage overview</p>
                    <p className="text-sm text-slate-400">Atlas workload across legal + security</p>
                  </div>
                  <div className="text-sm text-slate-400">{dashboard.usage.total_documents} total docs</div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <MetricCard title="Docs today" value={dashboard.usage.documents_today.toString()} detail="Unique uploads" />
                  <MetricCard title="Avg risk score" value={dashboard.usage.average_risk.toString()} detail="All docs" />
                  <MetricCard title="Top doc types" value={dashboard.usage.top_doc_types[0] || '—'} detail={dashboard.usage.top_doc_types.slice(1).join(', ')} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-3">Risk distribution</p>
                    <div className="space-y-2">
                      {dashboard.usage.risk_breakdown.map((item) => (
                        <div key={item.level}>
                          <div className="flex justify-between text-xs uppercase text-slate-400">
                            <span>{item.level}</span>
                            <span>{item.percent}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                item.level === 'high'
                                  ? 'bg-red-500'
                                  : item.level === 'medium'
                                  ? 'bg-yellow-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-3">KPIs</p>
                    <div className="space-y-3">
                      {dashboard.usage.kpis.map((kpi) => (
                        <div key={kpi.label} className="rounded-xl border border-white/10 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">{kpi.label}</p>
                            <span className={`${kpi.trend >= 0 ? 'text-emerald-300' : 'text-red-300'} text-xs`}>
                              {kpi.trend >= 0 ? '+' : ''}
                              {kpi.trend.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xl font-semibold">{kpi.value}</p>
                          <p className="text-xs text-slate-500">{kpi.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing */}
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <p className="text-lg font-semibold">Billing snapshot</p>
                  <p className="text-sm text-slate-400">Plan & invoices</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Plan</span>
                    <span className="font-semibold">{dashboard.billing.plan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Seats</span>
                    <span className="font-semibold">{dashboard.billing.seats_used}/{dashboard.billing.seats_included}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">MRR</span>
                    <span className="font-semibold">${dashboard.billing.mrr}/mo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Renews</span>
                    <span className="font-semibold">{new Date(dashboard.billing.renews_on).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-2">Invoices</p>
                  <div className="space-y-2 text-sm">
                    {dashboard.billing.invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between border border-white/10 rounded-lg px-3 py-2">
                        <div>
                          <p className="font-semibold">{invoice.id}</p>
                          <p className="text-xs text-slate-400">{new Date(invoice.due_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p>${invoice.amount}</p>
                          <p className={`text-xs ${invoice.status === 'paid' ? 'text-emerald-300' : invoice.status === 'due' ? 'text-yellow-300' : 'text-red-300'}`}>
                            {invoice.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Threat timeline */}
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
                        <p className="mt-2 font-medium capitalize">{event.vector.replace(/_/g, ' ')}</p>
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

            {/* System health & config */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">System health</p>
                    <p className="text-sm text-slate-400">Uptime & critical services</p>
                  </div>
                  <div className="text-sm text-slate-400">{dashboard.system_health.uptime}</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <MetricCard title="Incidents open" value={dashboard.system_health.incidents_open.toString()} detail="Awaiting resolution" />
                  <MetricCard title="Avg latency" value={`${dashboard.system_health.avg_latency_ms}ms`} detail="p95 across regions" />
                </div>
                <div className="space-y-3">
                  {dashboard.system_health.checks.map((check) => (
                    <div key={check.name} className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2">
                      <div>
                        <p className="font-semibold">{check.name}</p>
                        <p className="text-xs text-slate-400">{check.detail}</p>
                      </div>
                      <span className={`text-xs uppercase ${healthBadge(check.status)}`}>{check.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <p className="text-lg font-semibold">Runtime controls</p>
                  <p className="text-sm text-slate-400">Rate limits & maintenance window</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Rate limit window (seconds)</label>
                    <input
                      type="number"
                      value={configDraft.rate_limit_window}
                      onChange={(e) => setConfigDraft((prev) => ({ ...prev, rate_limit_window: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Max requests per window</label>
                    <input
                      type="number"
                      value={configDraft.rate_limit_limit}
                      onChange={(e) => setConfigDraft((prev) => ({ ...prev, rate_limit_limit: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Allowed admin IPs (comma separated)</label>
                  <textarea
                    value={configDraft.allowed_admin_ips}
                    onChange={(e) => setConfigDraft((prev) => ({ ...prev, allowed_admin_ips: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    rows={2}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={configDraft.maintenance_mode}
                    onChange={(e) => setConfigDraft((prev) => ({ ...prev, maintenance_mode: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  Enable maintenance mode (returns 503 for analysis requests)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConfigSave}
                    disabled={configSaving}
                    className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue/90 transition disabled:opacity-50"
                  >
                    {configSaving ? 'Saving…' : 'Save controls'}
                  </button>
                  {configMessage && <span className="text-xs text-emerald-300">{configMessage}</span>}
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
                    <p className={`text-xs uppercase tracking-wide mt-1 ${integration.status === 'ok' ? 'text-emerald-300' : integration.status === 'warning' ? 'text-yellow-300' : 'text-red-300'}`}>
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

function MetricCard({ title, value, detail }: { title: string, value: string, detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 px-4 py-3">
      <p className="text-xs text-slate-400 uppercase">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-slate-500">{detail || '—'}</p>
    </div>
  )
}
