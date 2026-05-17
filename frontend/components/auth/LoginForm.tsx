"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { resetPassword, signIn, signUp } from '@/lib/auth'
import { useAuth } from '@/components/auth/AuthProvider'
import { Mail, Lock, User, Eye, EyeOff, Phone, ShieldCheck } from 'lucide-react'

interface LoginFormProps { onClose?: () => void }

export function LoginForm({ onClose }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshProfile } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' })

  const redirectAfterAuth = async () => {
    const profile = await refreshProfile()
    const next = searchParams.get('next')
    if (next) router.push(next)
    else if (profile?.role === 'admin' || profile?.role === 'leader') router.push('/admin')
    else router.push('/member')
    onClose?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password)
        setSuccess('Signed in successfully. Redirecting...')
        await redirectAfterAuth()
      } else {
        const result = await signUp(formData.email, formData.password, formData.name, formData.phone)
        const { data: { session } } = await supabase.auth.getSession()
        if (!result.session && !session) {
          setSuccess('Account created. Please check your email to confirm your account, then sign in.')
          setMode('login')
          return
        }
        setSuccess('Account created. Redirecting to your member dashboard...')
        await redirectAfterAuth()
      }
    } catch (err: any) {
      const message = String(err.message || '')
      if (message.toLowerCase().includes('already registered') || message.toLowerCase().includes('already exists')) {
        setError('This email already has an account. Please sign in instead, or use forgot password.')
        setMode('login')
      } else if (message.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid email or password. Check your details and try again.')
      } else if (message.toLowerCase().includes('email rate limit')) {
        setError('Too many signup emails were requested. Please wait a few minutes and try again.')
      } else {
        setError(message || 'Authentication failed. Check your details and try again.')
      }
    } finally { setLoading(false) }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleForgotPassword = async () => {
    if (!formData.email) return setError('Enter your email first, then click forgot password.')
    setLoading(true); setError(''); setSuccess('')
    try { await resetPassword(formData.email); setSuccess('Password reset link sent. Check your inbox.') }
    catch (err: any) { setError(err.message || 'Failed to send reset link') }
    finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-xl"><ShieldCheck className="h-7 w-7" /></div>
        <h2 className="text-3xl font-bold text-white mb-2">{mode === 'login' ? 'PCM' : 'Create Account'}</h2>
        <p className="text-white/70">{mode === 'login' ? 'Sign in to continue.' : 'Create your PCM member account.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'signup' && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">Full Name</label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input type="text" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">Phone Number</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input type="tel" id="phone" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="0760 000 000" />
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">Password</label>
          <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={formData.password} onChange={handleInputChange} required minLength={6} className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Minimum 6 characters" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80" aria-label="Toggle password visibility">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/15 p-3 text-sm text-red-100">{error}</div>}
        {success && <div className="rounded-xl border border-green-500/30 bg-green-500/15 p-3 text-sm text-green-100">{success}</div>}

        <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-3 font-semibold">
          {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }} className="text-white/75 hover:text-white text-sm">
          {mode === 'login' ? "New member? Create an account" : 'Already registered? Sign in'}
        </button>
        {mode === 'login' && <div><button type="button" onClick={handleForgotPassword} className="text-white/60 hover:text-white text-sm">Forgot your password?</button></div>}
      </div>
    </div>
  )
}
