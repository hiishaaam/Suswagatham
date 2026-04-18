'use client'

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendOTP, verifyOTP } from '@/lib/supabase/auth'
import { AlertCircle, ArrowRight } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')
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

  const handleVerifySubmit = useCallback(async (tokenInput?: string) => {
    const token = tokenInput || otp.join('')
    if (token.length !== 6) {
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
  }, [otp, phone, redirectPath, router])

  // Auto-submit when last digit is entered
  useEffect(() => {
    if (step === 2 && otp.every(digit => digit !== '')) {
      const token = otp.join('')
      if (token.length === 6) {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        handleVerifySubmit(token)
      }
    }
  }, [otp, step, handleVerifySubmit])

  const handleResend = async () => {
    setOtp(['', '', '', '', '', ''])
    setCountdown(30)
    setError(null)
    const { error: otpError } = await sendOTP(phone)
    if (otpError) setError(otpError)
  }

  return (
    <div className="w-full max-w-[400px] bg-white border border-gold-light rounded-sm shadow-card p-10 flex flex-col items-center">
      
      {/* Logo matching theme */}
      <div className="flex items-center gap-2 mb-8">
        <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-8 h-8 rounded border border-gold/50 bg-gold/10">
          W
        </div>
        <span className="font-display text-2xl font-bold text-ink tracking-wide">WeddWise</span>
      </div>

      <div className="w-full border-t border-gold-light/40 mb-8 pt-4 text-center">
        <h1 className="font-display text-4xl text-ink italic mb-3">Welcome back</h1>
        <p className="font-body text-sm text-muted">
          {step === 1 
            ? "Enter your mobile number to access your wedding dashboard"
            : `We've sent a 6-digit code to +91 ${phone}`
          }
        </p>
      </div>

      {error && (
        <div className="w-full bg-error/10 border border-error/20 text-error text-[11px] font-bold p-3 rounded-sm mb-6 flex items-center gap-2 uppercase tracking-wide">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {step === 1 ? (
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
      ) : (
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
            onClick={() => handleVerifySubmit()}
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
  )
}

export default function DashboardLogin() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 selection:bg-gold/30">
      <Suspense fallback={<div className="text-gold font-display font-bold">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  )
}
