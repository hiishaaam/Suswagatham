'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendOTP, verifyOTP, signInWithEmail } from '@/lib/supabase/auth'
import { AlertCircle, ArrowRight, Mail, Phone } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email')
  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // ── Email Login ──
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }

    setIsLoading(true)
    const { error: signInError } = await signInWithEmail(email, password)
    setIsLoading(false)

    if (signInError) {
      setError(signInError)
    } else {
      router.push(redirectPath)
      router.refresh()
    }
  }

  // ── Phone OTP Login ──
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setIsLoading(true)
    const { error: otpError } = await sendOTP(phone)
    setIsLoading(false)

    if (otpError) {
      setError(otpError)
    } else {
      setStep(2)
      setCountdown(30)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const token = otp.join('')
    if (token.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setError(null)
    setIsLoading(true)
    const { error: verifyError } = await verifyOTP(phone, token)
    setIsLoading(false)

    if (verifyError) {
      setError('Invalid OTP. Please check the code and try again.')
    } else {
      router.push(redirectPath)
      router.refresh()
    }
  }

  // Auto-submit when last digit is entered
  useEffect(() => {
    if (step === 2 && otp.every(digit => digit !== '')) {
      const timer = setTimeout(() => handleVerifySubmit(), 10)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  const handleResend = async () => {
    setOtp(['', '', '', '', '', ''])
    setCountdown(30)
    setError(null)
    const { error: otpError } = await sendOTP(phone)
    if (otpError) setError(otpError)
  }

  const switchMode = (mode: 'email' | 'phone') => {
    setAuthMode(mode)
    setError(null)
    setStep(1)
    setOtp(['', '', '', '', '', ''])
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 selection:bg-gold/30">
      <div className="w-full max-w-[400px] bg-white border border-gold-light rounded-sm shadow-card p-10 flex flex-col items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-8 h-8 rounded border border-gold/50 bg-gold/10">
            W
          </div>
          <span className="font-display text-2xl font-bold text-ink tracking-wide">WeddWise</span>
        </div>

        <div className="w-full border-t border-gold-light/40 mb-6 pt-4 text-center">
          <h1 className="font-display text-4xl text-ink italic mb-3">Welcome back</h1>
          <p className="font-body text-sm text-muted">
            {authMode === 'email' 
              ? "Sign in with your email to access your wedding dashboard"
              : step === 1 
                ? "Enter your mobile number to access your wedding dashboard"
                : `We've sent a 6-digit code to +91 ${phone}`
            }
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="w-full flex rounded-sm overflow-hidden border border-gold-light mb-6">
          <button
            onClick={() => switchMode('email')}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest flex justify-center items-center gap-1.5 transition-colors ${
              authMode === 'email' 
                ? 'bg-ink text-gold' 
                : 'bg-white text-muted hover:bg-ivory'
            }`}
          >
            <Mail size={13} /> Email
          </button>
          <button
            onClick={() => switchMode('phone')}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest flex justify-center items-center gap-1.5 transition-colors border-l border-gold-light ${
              authMode === 'phone' 
                ? 'bg-ink text-gold' 
                : 'bg-white text-muted hover:bg-ivory'
            }`}
          >
            <Phone size={13} /> Phone OTP
          </button>
        </div>

        {error && (
          <div className="w-full bg-error/10 border border-error/20 text-error text-[11px] font-bold p-3 rounded-sm mb-6 flex items-center gap-2 uppercase tracking-wide">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* ── EMAIL LOGIN ── */}
        {authMode === 'email' && (
          <form className="w-full" onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-ink mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold-light bg-ivory px-4 py-3 text-ink font-body placeholder:text-muted/40 focus:outline-none focus:border-gold transition-colors rounded-sm"
                disabled={isLoading}
              />
            </div>
            <div className="mb-8">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-ink mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gold-light bg-ivory px-4 py-3 text-ink font-body placeholder:text-muted/40 focus:outline-none focus:border-gold transition-colors rounded-sm"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gold text-[#0F0C07] px-6 py-4 text-[12px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold-light transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'} 
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        {/* ── PHONE OTP LOGIN ── */}
        {authMode === 'phone' && step === 1 && (
          <form className="w-full" onSubmit={handlePhoneSubmit}>
            <div className="mb-8">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-ink mb-2">
                Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-ivory border border-gold-light px-3 py-3 text-ink font-body text-sm rounded-sm shrink-0">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gold-light bg-ivory px-4 py-3 text-ink font-body placeholder:text-muted/40 focus:outline-none focus:border-gold transition-colors rounded-sm"
                  maxLength={10}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length !== 10}
              className="w-full bg-gold text-[#0F0C07] px-6 py-4 text-[12px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold-light transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'} 
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        {/* ── OTP VERIFICATION STEP ── */}
        {authMode === 'phone' && step === 2 && (
          <div className="w-full">
            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el }}
                  type="tel"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-12 h-14 bg-ivory border border-gold-light text-center font-display text-2xl text-ink focus:outline-none focus:border-gold transition-colors rounded-sm shadow-inner"
                />
              ))}
            </div>

            <button
              onClick={handleVerifySubmit}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-gold text-[#0F0C07] px-6 py-4 text-[12px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold-light transition-colors shadow-sm disabled:opacity-50 mb-6"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="text-center font-body text-sm text-muted">
              {countdown > 0 ? (
                <span>Resend OTP in <span className="font-bold text-ink">{countdown}s</span></span>
              ) : (
                <button 
                  onClick={handleResend}
                  className="text-ink border-b border-gold pb-0.5 font-bold uppercase text-[11px] tracking-widest hover:text-gold transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>
            
            <div className="mt-8 text-center">
               <button 
                 onClick={() => { setStep(1); setError(null); }}
                 className="text-muted hover:text-ink text-xs transition-colors"
               >
                 ← Change mobile number
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function DashboardLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-gold font-body">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
