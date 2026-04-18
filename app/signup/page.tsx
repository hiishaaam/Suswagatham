'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { signUpWithEmail } from '@/lib/supabase/auth'
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, User, Mail, Lock, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1) // 1 = form, 2 = success
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Password strength checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
  const passwordStrong = Object.values(passwordChecks).every(Boolean)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!passwordStrong) {
      setError('Please create a stronger password')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    const { error: signupError } = await signUpWithEmail(email, password, name)

    setIsLoading(false)

    if (signupError) {
      setError(signupError)
    } else {
      setStep(2)
      // Send welcome email (fire-and-forget, don't block the UI)
      fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      }).catch(() => {}) // Silently ignore email failures
      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 4000)
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
        className="w-full max-w-[420px] relative z-10"
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
          <AnimatePresence mode="wait">
            {/* STEP 1: Registration Form */}
            {step === 1 && (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(2px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(2px)' }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <div className="text-center mb-8">
                  <h1 className="font-display text-2xl text-ink font-bold mb-1.5">Create Account</h1>
                  <p className="text-muted text-sm">Start planning your perfect wedding</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl mb-6 flex items-start gap-2"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-1.5 ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-gold transition-colors">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-ivory/50 border border-gold-light/40 pl-10 pr-4 py-3 text-ink font-body placeholder:text-muted/40 focus:outline-none focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Email */}
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

                  {/* Password */}
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
                        placeholder="Create a strong password"
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

                    {/* Password strength indicators */}
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, filter: 'blur(2px)' }}
                        animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                        className="mt-3 grid grid-cols-2 gap-1.5 ml-1"
                      >
                        {[
                          { label: '8+ chars', met: passwordChecks.length },
                          { label: 'Uppercase', met: passwordChecks.uppercase },
                          { label: 'Lowercase', met: passwordChecks.lowercase },
                          { label: 'Number', met: passwordChecks.number },
                        ].map(({ label, met }) => (
                          <div key={label} className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-300 ${met ? 'text-success' : 'text-muted/40'}`}>
                            {met ? <Check size={10} className="shrink-0" /> : <div className="w-[10px] h-[10px] rounded-full border border-muted/20 shrink-0" />}
                            {label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-1.5 ml-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-ivory/50 border py-3 px-4 text-ink font-body placeholder:text-muted/40 focus:outline-none focus:bg-white focus:ring-4 transition-all rounded-xl ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-500/40 focus:border-red-400 focus:ring-red-500/10'
                          : confirmPassword && password === confirmPassword
                          ? 'border-success/40 focus:border-success focus:ring-success/10'
                          : 'border-gold-light/40 focus:border-gold focus:ring-gold/5'
                      }`}
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !name.trim() || !email.trim() || !passwordStrong || password !== confirmPassword}
                    className="w-full bg-ink text-gold mt-6 px-6 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-ink/90 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                    style={{
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 1px 0px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
                    ) : (
                      <>Create Account <ArrowRight size={14} /></>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gold-light/30 text-center">
                  <p className="text-muted text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-ink font-bold hover:text-gold transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Success */}
            {step === 2 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-success/10 border border-success/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h2 className="font-display text-2xl text-ink font-bold mb-2">Welcome aboard!</h2>
                <p className="text-muted text-sm mb-6">
                  Your account has been created securely. Check your email for a confirmation link.
                </p>
                <div className="flex items-center justify-center gap-2 text-gold text-xs font-bold uppercase tracking-widest">
                  <div className="h-3 w-3 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
                  Redirecting to login...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
