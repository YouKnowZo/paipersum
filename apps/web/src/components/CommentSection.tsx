import { useState } from 'react'
import { submitFeedback } from '../lib/api'

interface FormState {
  name: string
  email: string
  rating: number
  message: string
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  rating: 5,
  message: ''
}

export default function CommentSection() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.message.trim() || !form.name.trim()) {
      setError('Name and message are required.')
      return
    }

    setLoading(true)
    try {
      await submitFeedback({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        rating: form.rating,
        message: form.message.trim()
      })

      setSuccess('Thanks for sharing your thoughts!')
      setForm(INITIAL_FORM)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="community" className="bg-gradient-to-br from-white to-paper-100 py-16">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-5/12 space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-blue font-semibold">Community Voices</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-900">
              Tell us how PaiperSum helps you feel more confident with any document
            </h2>
            <p className="text-ink-600 leading-relaxed">
              Share wins, concerns, or ideas. We read every note and use the feedback to decide what we build next.
              Your email is optional—we only use it to follow up if needed.
            </p>
          </div>

          <div className="lg:w-7/12">
            <form onSubmit={handleSubmit} className="bg-white border border-border-200 rounded-2xl shadow-lg p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="How should we address you?"
                    className="w-full px-4 py-3 border border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    maxLength={80}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">Email (optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="We’ll only reach out if we need clarification"
                    className="w-full px-4 py-3 border border-border-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">How was your experience?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                      className={`w-10 h-10 rounded-full border transition ${
                        form.rating === value
                          ? 'bg-brand-blue text-white border-brand-blue'
                          : 'border-border-200 text-ink-500 hover:border-brand-blue/50'
                      }`}
                      aria-label={`Rating ${value} out of 5`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Comment *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us what you love or what we should improve."
                  className="w-full min-h-[140px] border border-border-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  maxLength={2000}
                  required
                />
                <p className="mt-2 text-xs text-ink-500">
                  By submitting, you agree to our Terms of Service and Privacy Policy. We may feature feedback on the site (first name only).
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-sm text-green-700 rounded-lg">{success}</div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending…' : 'Share feedback'}
                </button>
                <span className="text-xs text-ink-500">
                  We’ll respond within 2 business days if you leave an email.
                </span>
              </div>
            </form>

            <div className="mt-10 p-4 bg-paper-50 border border-border-200 rounded-xl text-sm text-ink-600">
              <p>
                Our team reviews every message internally and may reach out if you include an email. We keep your thoughts private unless you explicitly allow us to share.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
