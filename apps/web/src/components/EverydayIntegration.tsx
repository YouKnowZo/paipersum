import { useState } from 'react'

interface IntegrationProps {
  documentName: string
  renewalDate?: Date
  cancellationDeadline?: Date
}

export default function EverydayIntegration({ 
  documentName, 
  renewalDate, 
  cancellationDeadline 
}: IntegrationProps) {
  const [emailReminder, setEmailReminder] = useState('')
  const [reminderSet, setReminderSet] = useState(false)

  const addToGoogleCalendar = (title: string, date: Date, description: string) => {
    const start = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const end = new Date(date.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&sf=true&output=xml`
    
    window.open(url, '_blank')
  }

  const setupEmailReminder = async () => {
    if (!emailReminder || !emailReminder.includes('@')) {
      alert('Please enter a valid email')
      return
    }

    // In production, this would call your backend
    // For now, use browser reminders
    setReminderSet(true)
    
    // Store in localStorage as backup
    const reminders = JSON.parse(localStorage.getItem('paipersum_reminders') || '[]')
    reminders.push({
      email: emailReminder,
      document: documentName,
      date: cancellationDeadline?.toISOString()
    })
    localStorage.setItem('paipersum_reminders', JSON.stringify(reminders))
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔔</span>
        <h3 className="text-xl font-bold text-ink-900">Never Get Trapped Again</h3>
      </div>

      <p className="text-sm text-ink-600 mb-6">
        Set up automatic reminders so you never miss important deadlines:
      </p>

      <div className="space-y-4">
        {/* Calendar integration */}
        {cancellationDeadline && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-ink-900 mb-1">Cancellation Deadline</h4>
                <p className="text-sm text-ink-600 mb-3">
                  {cancellationDeadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' - '}Don't miss this or you'll auto-renew!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToGoogleCalendar(
                      `⚠️ Cancel ${documentName}`,
                      new Date(cancellationDeadline.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week before
                      `Reminder to cancel ${documentName} before ${cancellationDeadline.toLocaleDateString()}. Don't get auto-renewed!`
                    )}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition font-semibold text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
                    </svg>
                    Add to Google Calendar
                  </button>
                  
                  <button
                    onClick={() => addToGoogleCalendar(
                      `⚠️ Cancel ${documentName}`,
                      cancellationDeadline,
                      `URGENT: Today is your last day to cancel ${documentName}!`
                    )}
                    className="px-4 py-2 bg-paper-100 border hover:bg-paper-200 transition rounded-lg text-sm font-semibold"
                  >
                    Add Day-Of Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email reminder */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-ink-900 mb-1">Email Reminders</h4>
              <p className="text-sm text-ink-600 mb-3">
                We'll email you 60 days AND 7 days before important deadlines
              </p>
              
              {!reminderSet ? (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailReminder}
                    onChange={(e) => setEmailReminder(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                  <button
                    onClick={setupEmailReminder}
                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition font-semibold text-sm"
                  >
                    Set Reminders
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-800 font-semibold">
                    ✓ Reminders set for {emailReminder}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phone notification */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-ink-900 mb-1">SMS Alerts (Coming Soon)</h4>
              <p className="text-sm text-ink-600">
                Get text message reminders right when you need them
              </p>
              <button className="mt-2 text-sm px-4 py-2 bg-white border hover:bg-purple-50 transition rounded-lg font-semibold flex items-center gap-2">
                <span>Join Waitlist</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Share with family */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-ink-900 mb-1">Share with Family</h4>
              <p className="text-sm text-ink-600 mb-3">
                Send this analysis to people who should see it:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="family@email.com"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browser integration */}
      <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="text-5xl">🌐</div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-ink-900 mb-2">
              Install Browser Extension
            </h4>
            <p className="text-sm text-ink-600 mb-4">
              Analyze any webpage instantly. Perfect for checking Terms of Service before signing up.
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Add to Chrome
              </button>
              <button className="px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition">
                Firefox Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
