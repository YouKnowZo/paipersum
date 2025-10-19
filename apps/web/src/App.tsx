import { useState } from 'react'
import axios from 'axios'
import { RiskMeter } from './components/RiskMeter'

type Clause = { title: string; summary: string; risk: 'green'|'yellow'|'red'; citation: string }

type Analysis = {
  risk_score: number
  clauses: Clause[]
  confidence: number
}

export default function App() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const submit = async () => {
    setError(''); setData(null); setLoading(true)
    try {
      const res = await axios.post(`${API}/analyze`, { text })
      setData(res.data)
    } catch (e: any) {
      setError(e?.message || 'Request failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">PaiperSum · Legal Simplifier</h1>
        <p className="text-gray-600 text-sm">Paste a contract, waiver, or Terms of Service. Get a plain‑English risk read‑out.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded-xl shadow">
          <label className="block text-sm text-gray-700 mb-2">Document text</label>
          <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-64 border rounded p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Paste legal text here…"/>
          <div className="mt-3 flex gap-2">
            <button onClick={submit} disabled={loading || !text.trim()} className="px-4 py-2 rounded bg-brand-blue text-white disabled:opacity-50">{loading ? 'Analyzing…' : 'Analyze'}</button>
            <button onClick={()=>{setText(''); setData(null); setError('')}} className="px-3 py-2 rounded border">Clear</button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-medium mb-3">Summary</h2>
          {!data && <p className="text-gray-500 text-sm">No analysis yet.</p>}
          {data && (
            <div className="space-y-4">
              <RiskMeter score={data.risk_score} />
              <div className="text-sm text-gray-600">Confidence: {(data.confidence*100).toFixed(0)}%</div>
              <div>
                <h3 className="font-medium mb-2">Clauses</h3>
                <div className="divide-y">
                  {data.clauses.map((c, i)=> (
                    <div key={i} className="py-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${c.risk==='red'?'bg-brand-red':c.risk==='yellow'?'bg-brand-yellow':'bg-brand-green'}`}/>
                        <span className="font-medium">{c.title}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{c.summary}</p>
                      <p className="text-xs text-gray-500 mt-1">Source: {c.citation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="text-xs text-gray-500 mt-8">Not legal advice. This tool provides automated summaries. Consult an attorney for legal decisions.</footer>
    </div>
  )
}