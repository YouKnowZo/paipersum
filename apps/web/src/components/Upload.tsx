import { useState } from 'react'

type Clause = { title: string; summary: string; risk: 'green'|'yellow'|'red'; citation: string }

type Analysis = {
  risk_score: number
  clauses: Clause[]
  confidence: number
}

export default function Upload({ api }: { api: string }) {
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<Analysis|null>(null)
  const [error, setError] = useState('')

  const submit = async () => {
    if(!file) return
    setError(''); setRes(null); setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const r = await fetch(`${api}/analyze-file`, { method:'POST', body: fd })
      if (!r.ok) throw new Error('Upload failed')
      setRes(await r.json())
    } catch (e: any) {
      setError(e?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-medium mb-3">Upload Document</h3>
      <div className="flex gap-2 items-center">
        <input 
          type="file" 
          accept=".pdf,.txt,.doc,.docx"
          onChange={e=>setFile(e.target.files?.[0]||null)} 
          className="text-sm"
        />
        <button 
          onClick={submit} 
          disabled={!file || loading}
          className="px-4 py-2 bg-brand-blue text-white rounded disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze File'}
        </button>
      </div>
      
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      
      {res && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Risk Score:</span>
              <span className={`font-bold ${res.risk_score >= 75 ? 'text-brand-red' : res.risk_score >= 50 ? 'text-brand-yellow' : 'text-brand-green'}`}>
                {res.risk_score}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Confidence:</span>
              <span>{(res.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-3">
              <span className="font-medium">Found {res.clauses.length} clause{res.clauses.length !== 1 ? 's' : ''}:</span>
              <ul className="mt-2 space-y-1">
                {res.clauses.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                      c.risk === 'red' ? 'bg-brand-red' : 
                      c.risk === 'yellow' ? 'bg-brand-yellow' : 
                      'bg-brand-green'
                    }`} />
                    <span className="flex-1">{c.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
