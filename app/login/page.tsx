'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
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
    setIsLoading(false)

    if (loginError) {
      setError(loginError)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0C07] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/15 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-3xl p-10 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-10 h-10 rounded-xl border border-gold/50 bg-gold/10">
              W
            </div>
            <span className="font-display text-2xl font-bold text-ivory tracking-wide">WeddWise</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-ivory font-bold mb-2">Welcome back</h1>
            <p className="text-ivory/50 text-sm">
              Sign in to manage your wedding events
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold p-3 rounded-xl mb-6 flex items-center gap-2 uppercase tracking-wide"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-ivory/60 mb-2 flex items-center gap-1.5">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-ivory font-body placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition-colors rounded-xl"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-ivory/60 mb-2 flex items-center gap-1.5">
                <Lock size={12} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 pr-12 text-ivory font-body placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition-colors rounded-xl"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || password.length < 6}
              className="w-full bg-gold text-[#0F0C07] px-6 py-4 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all shadow-[0_10px_30px_rgba(201,168,76,0.2)] disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-ivory/40 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-gold font-bold hover:text-gold-light transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
