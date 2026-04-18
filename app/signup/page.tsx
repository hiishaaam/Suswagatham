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
      // Note: With email confirmations enabled in Supabase, the user receives an email.
      // After confirmation, they can log in. Or if confirmations are off, they can log in immediately.
      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 4000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0C07] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-3xl p-10 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-10 h-10 rounded-xl border border-gold/50 bg-gold/10">
              W
            </div>
            <span className="font-display text-2xl font-bold text-ivory tracking-wide">WeddWise</span>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Registration Form */}
            {step === 1 && (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="text-center mb-6">
                  <h1 className="font-display text-3xl text-ivory font-bold mb-2">Create Account</h1>
                  <p className="text-ivory/50 text-sm">Start planning your perfect wedding</p>
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

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ivory/60 mb-2">
                      <User size={10} className="inline mr-1" /> Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-ivory font-body placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition-colors rounded-xl"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ivory/60 mb-2">
                      <Mail size={10} className="inline mr-1" /> Email Address
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

                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ivory/60 mb-2">
                      <Lock size={10} className="inline mr-1" /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
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

                    {/* Password strength indicators */}
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 grid grid-cols-2 gap-1.5"
                      >
                        {[
                          { label: '8+ chars', met: passwordChecks.length },
                          { label: 'Uppercase', met: passwordChecks.uppercase },
                          { label: 'Lowercase', met: passwordChecks.lowercase },
                          { label: 'Number', met: passwordChecks.number },
                        ].map(({ label, met }) => (
                          <div key={label} className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${met ? 'text-green-400' : 'text-ivory/20'}`}>
                            {met ? <Check size={10} /> : <div className="w-[10px] h-[10px] rounded-full border border-ivory/15" />}
                            {label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ivory/60 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-white/5 border px-4 py-3 text-ivory font-body placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition-colors rounded-xl ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-500/40'
                          : confirmPassword && password === confirmPassword
                          ? 'border-green-500/40'
                          : 'border-white/10'
                      }`}
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !name.trim() || !email.trim() || !passwordStrong || password !== confirmPassword}
                    className="w-full bg-gold text-[#0F0C07] px-6 py-4 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all shadow-[0_10px_30px_rgba(201,168,76,0.2)] disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    {!isLoading && <ArrowRight size={16} />}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Success */}
            {step === 2 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 size={40} className="text-green-400" />
                </motion.div>
                <h2 className="font-display text-2xl text-ivory font-bold mb-2">Welcome aboard!</h2>
                <p className="text-ivory/50 text-sm mb-4">
                  Your account has been created securely. Check your email for a confirmation link.
                </p>
                <p className="text-ivory/30 text-xs">Redirecting to login...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          {step === 1 && (
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-ivory/40 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-gold font-bold hover:text-gold-light transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
