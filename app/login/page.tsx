'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { m } from 'motion/react'
import { signInWithEmail } from '@/lib/supabase/auth'
import { AlertCircle, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    const { error: loginError } = await signInWithEmail(email, password)

    if (loginError) {
      setError(loginError)
      setIsLoading(false)
    } else {
      router.push('/admin')
      // Don't set isLoading(false) here so the spinner persists during the route transition!
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 relative">
      <m.div
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Logo outside card for premium feel */}
        <div className="flex items-center justify-center gap-2 mb-8 select-none">
          <div className="text-gold font-display text-xs font-bold flex items-center justify-center w-8 h-8 rounded-sm border border-gold/30 bg-gold/5">
            W
          </div>
          <span className="font-display text-xl font-bold text-ink tracking-wide">WeddWise</span>
        </div>

        <div 
          className="bg-white rounded-2xl p-8"
          style={{
            boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 2px 4px -1px rgba(0, 0, 0, 0.04), 0px 8px 16px -2px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl text-ink font-bold mb-1.5">Welcome back</h1>
            <p className="text-muted text-sm">
              Sign in to manage your wedding events
            </p>
          </div>

          {error && (
            <m.div
              initial={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl mb-6 flex items-start gap-2"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </m.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-gold transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ivory/50 border border-gold-light/40 pl-10 pr-4 py-3 text-ink font-body placeholder:text-muted/40 focus:outline-none focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all rounded-xl"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-gold transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ivory/50 border border-gold-light/40 pl-10 pr-12 py-3 text-ink font-body placeholder:text-muted/40 focus:outline-none focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all rounded-xl"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-ink transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || password.length < 6}
              className="w-full bg-ink text-gold mt-6 px-6 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-ink/90 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              style={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 1px 0px rgba(255, 255, 255, 0.1)'
              }}
            >
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gold-light/30 text-center">
            <p className="text-muted text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-ink font-bold hover:text-gold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </m.div>
    </div>
  )
}
