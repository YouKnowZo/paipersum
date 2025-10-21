import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '@/lib/auth'
import { LoginRequest, RegisterRequest } from '@/lib/schemas'
import { Shield, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface AuthPageProps {
  mode: 'login' | 'register'
}

export function AuthPage({ mode }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login, register, loading } = useAuth()

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginRequestT | RegisterRequestT>({
    resolver: zodResolver(mode === 'login' ? LoginRequest : RegisterRequest),
    mode: 'onBlur'
  })

  const onSubmit = async (data: LoginRequestT | RegisterRequestT) => {
    try {
      if (mode === 'login') {
        await login(data.email, data.password)
        toast.success('Logged in successfully')
        window.location.href = '/'
      } else {
        await register(data.email, data.password)
        toast.success('Account created successfully')
        window.location.href = '/'
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed')
    }
  }

  const password = watch('password')

  return (
    <div className="min-h-screen bg-paper-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-blue flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ink-900">PaiperSum</h1>
          </div>
          <p className="text-ink-600">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-center text-ink-900">
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...registerForm('email')}
                error={errors.email?.message}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...registerForm('password')}
                  error={errors.password?.message}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-ink-400 hover:text-ink-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {mode === 'register' && (
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...registerForm('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-ink-400 hover:text-ink-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-ink-600">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <a
                  href={mode === 'login' ? '/register' : '/login'}
                  className="text-brand-blue hover:text-brand-blue/80 font-medium"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-ink-500">
            By using PaiperSum, you agree to our{' '}
            <a href="/terms" className="text-brand-blue hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-brand-blue hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}