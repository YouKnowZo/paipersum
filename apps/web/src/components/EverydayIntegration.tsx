import { useState } from 'react'
import { Card } from './Cards'

interface IntegrationProps {
  documentName: string
  renewalDate?: Date
  cancellationDeadline?: Date
}

export default function EverydayIntegration({ 
  documentName, 
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

    setReminderSet(true)
    
    const reminders = JSON.parse(localStorage.getItem('paipersum_reminders') || '[]')
    reminders.push({
      email: emailReminder,
      document: documentName,
      date: cancellationDeadline?.toISOString()
    })
    localStorage.setItem('paipersum_reminders', JSON.stringify(reminders))
  }

  return (
    <Card title="Set Reminders">
      <p className="text-sm text-slate-600 mb-6">
        Never miss important deadlines. Set up automatic reminders:
      </p>

      <div className="space-y-4">
        {/* Calendar integration */}
        {cancellationDeadline && (
          <div className="p-4 bg-brand-sky/5 border border-brand-sky/20 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-sky/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">Cancellation Deadline</h4>
                <p className="text-sm text-slate-600 mb-3">
                  {cancellationDeadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => addToGoogleCalendar(
                      `Cancel ${documentName}`,
                      new Date(cancellationDeadline.getTime() - 7 * 24 * 60 * 60 * 1000),
                      `Reminder to cancel ${documentName} before ${cancellationDeadline.toLocaleDateString()}`
                    )}
                    className="btn-secondary btn-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                    </svg>
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email reminder */}
        <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">Email Reminders</h4>
              <p className="text-sm text-slate-600 mb-3">
                Get reminded 60 days and 7 days before important deadlines.
              </p>
              
              {!reminderSet ? (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailReminder}
                    onChange={(e) => setEmailReminder(e.target.value)}
                    placeholder="your@email.com"
                    className="input flex-1"
                  />
                  <button onClick={setupEmailReminder} className="btn-primary btn-sm">
                    Set Reminder
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-200 rounded-lg">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-success-700 font-medium">
                    Reminder set for {emailReminder}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share with family */}
        <div className="p-4 bg-success-50 border border-success-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">Share with Others</h4>
              <p className="text-sm text-slate-600 mb-3">
                Send this analysis to family members or colleagues who should see it.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="family@email.com"
                  className="input flex-1"
                />
                <button className="btn-accent btn-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
