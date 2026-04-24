'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { Loader2, Heart, CheckCircle2 } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface DigitalShagunProps {
  eventId: string
  coupleNames: string
  razorpayKeyId: string
}

const PRESET_AMOUNTS = [501, 1001, 2001, 5001, 11001]

export default function DigitalShagun({ eventId, coupleNames, razorpayKeyId }: DigitalShagunProps) {
  const [amount, setAmount] = useState<number | ''>('')
  const [guestName, setGuestName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePay = async () => {
    if (!amount || amount < 1) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Failed to load payment gateway')

      // 1. Create order
      const res = await fetch('/api/shagun/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, amount: Number(amount), guestName: guestName.trim() || null })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      // 2. Open Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Suswagatham',
        description: `Shagun for ${coupleNames}`,
        order_id: data.order.id,
        handler: async (response: any) => {
          // 3. Verify
          try {
            const verifyRes = await fetch('/api/shagun/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              setSuccess(true)
            } else {
              setError(verifyData.error || 'Verification failed')
            }
          } catch {
            setError('Could not verify payment')
          }
        },
        prefill: { name: guestName || '' },
        theme: { color: '#C5A559' },
        modal: {
          ondismiss: () => setLoading(false)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setError('Payment was not completed')
        setLoading(false)
      })
      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gold-light rounded-sm shadow-card p-8 text-center"
      >
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="text-success" size={32} />
        </div>
        <h3 className="font-display text-2xl text-ink mb-2 italic">Blessings Sent!</h3>
        <p className="font-body text-sm text-muted">
          Your gift of <span className="font-bold text-ink">₹{Number(amount).toLocaleString('en-IN')}</span> has been safely delivered.
        </p>
        <p className="font-body text-xs text-muted/60 mt-4 uppercase tracking-widest">
          The couple will be notified
        </p>
      </m.div>
    )
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white border border-gold-light rounded-sm shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C5A559]/10 via-[#D4B96A]/5 to-transparent px-6 py-5 border-b border-gold-light/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart size={18} className="text-gold" />
          </div>
          <div>
            <h3 className="font-display text-lg text-ink font-semibold">Bless the Couple</h3>
            <p className="text-[11px] text-muted uppercase tracking-widest">Digital Shagun · Secure Payment</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Quick amount presets */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-3">Select Amount</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map(preset => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`px-4 py-2.5 rounded-sm border text-sm font-bold transition-all ${
                  amount === preset 
                    ? 'border-gold bg-gold/10 text-gold shadow-sm' 
                    : 'border-gold-light/50 text-muted hover:border-gold/40 hover:bg-ivory'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Or Enter Custom Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-display text-lg">₹</span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="500"
              className="w-full bg-ivory border border-gold-light pl-10 pr-4 py-3 rounded-sm focus:border-gold outline-none transition font-display text-xl text-ink"
            />
          </div>
        </div>

        {/* Guest name */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Your Name <span className="text-muted/50">(Optional)</span></label>
          <input
            type="text"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
            placeholder="So the couple knows who sent this"
            className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition font-body text-sm"
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-error text-sm font-body text-center">
              {error}
            </m.p>
          )}
        </AnimatePresence>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading || !amount}
          className="w-full bg-gradient-to-r from-[#C5A559] to-[#D4B96A] text-ink font-bold uppercase tracking-widest py-4 rounded-sm flex justify-center items-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Processing...</>
          ) : (
            <><Heart size={16} /> Send Gift{amount ? ` · ₹${Number(amount).toLocaleString('en-IN')}` : ''}</>
          )}
        </button>

        <p className="text-[10px] text-center text-muted/50 leading-relaxed">
          Powered by Razorpay · 100% Secure · All payments are tracked for the host
        </p>
      </div>
    </m.div>
  )
}
