import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '@/lib/auth'
import { Settings, User, Shield, Bell, Trash2, Key } from 'lucide-react'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return
    }

    setLoading(true)
    try {
      // TODO: Implement account deletion API
      toast.error('Account deletion not yet implemented')
    } catch (err: any) {
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      // TODO: Implement data export API
      toast.error('Data export not yet implemented')
    } catch (err: any) {
      toast.error('Failed to export data')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
        <p className="text-ink-600">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-blue" />
              <h2 className="text-lg font-semibold text-ink-900">Account Information</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="Contact support to change your email address"
            />
            <div className="text-sm text-ink-500">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-blue" />
              <h2 className="text-lg font-semibold text-ink-900">Security</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="secondary" className="w-full sm:w-auto">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <div className="text-sm text-ink-500">
              Your password is encrypted and secure. We recommend using a strong, unique password.
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-blue" />
              <h2 className="text-lg font-semibold text-ink-900">Notifications</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-border-200" />
                <span className="text-sm text-ink-700">Email notifications for new features</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-border-200" />
                <span className="text-sm text-ink-700">Security alerts and updates</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-border-200" />
                <span className="text-sm text-ink-700">Marketing communications</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-blue" />
              <h2 className="text-lg font-semibold text-ink-900">Data Management</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="secondary" onClick={handleExportData} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              <div className="text-sm text-ink-500">
                Download a copy of all your data in JSON format
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-brand-red/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-brand-red" />
              <h2 className="text-lg font-semibold text-ink-900">Danger Zone</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                loading={loading}
                className="w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              <div className="text-sm text-ink-500">
                Permanently delete your account and all associated data. This action cannot be undone.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}