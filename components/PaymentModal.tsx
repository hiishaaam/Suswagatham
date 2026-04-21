'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { CreditCard, Loader2, CheckCircle2, X, ShieldCheck } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  coupleNames: string
  templateId: string
  hostWhatsApp?: string
  onPaymentSuccess: () => void
}

export default function PaymentModal({ isOpen, onClose, eventId, coupleNames, templateId, hostWhatsApp, onPaymentSuccess }: PaymentModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
    setStatus('loading')
    setErrorMsg('')

    try {
      // 1. Load Razorpay checkout script
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Failed to load payment gateway')

      // 2. Create order on our server
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      })
      const orderData = await orderRes.json()

      if (!orderData.success) throw new Error(orderData.error)

      // 3. Open Razorpay Checkout
      setStatus('processing')
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'WeddWise',
        description: `Premium Invitation — ${coupleNames}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // 4. Verify payment on server
          setStatus('loading')
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                event_id: eventId,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              setStatus('success')
              setTimeout(() => {
                onPaymentSuccess()
              }, 2000)
            } else {
              throw new Error(verifyData.error)
            }
          } catch (err: any) {
            setErrorMsg(err.message)
            setStatus('error')
          }
        },
        modal: {
          ondismiss: function () {
            setStatus('idle')
          },
        },
        prefill: {
          contact: hostWhatsApp || undefined,
        },
        theme: {
          color: '#CAA867',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        setErrorMsg(response.error.description || 'Payment failed')
        setStatus('error')
      })
      rzp.open()
    } catch (err: any) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && status !== 'loading' && status !== 'processing' && onClose()}
      >
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          className="bg-white rounded-2xl w-full max-w-[420px] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-ink to-ink/90 text-gold px-8 py-6 flex justify-between items-start">
            <div>
              <h2 className="font-display text-xl font-bold">Activate Your Event</h2>
              <p className="text-gold/70 text-xs mt-1 uppercase tracking-widest">One-time payment</p>
            </div>
            {status === 'idle' && (
              <button onClick={onClose} className="text-gold/50 hover:text-gold transition p-1">
                <X size={20} />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* SUCCESS STATE */}
              {status === 'success' ? (
                <m.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-success/10 border border-success/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-success" />
                  </div>
                  <h3 className="font-display text-2xl text-ink font-bold mb-2">Payment Successful!</h3>
                  <p className="text-muted text-sm">Your event is now LIVE. Guests can start RSVPing.</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-gold text-xs font-bold uppercase tracking-widest">
                    <div className="h-3 w-3 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
                    Refreshing...
                  </div>
                </m.div>
              ) : (
                <m.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Event card summary */}
                  <div className="bg-ivory/80 border border-gold-light/40 rounded-xl p-5 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Event</p>
                        <p className="font-display text-lg text-ink italic">{coupleNames}</p>
                        <p className="text-muted text-xs mt-1 uppercase tracking-wider">{templateId.replace(/-/g, ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Amount</p>
                        <p className="font-display text-3xl text-ink">₹1</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center gap-2 text-muted text-[10px] uppercase tracking-widest font-semibold mb-6">
                    <ShieldCheck size={14} className="text-success" />
                    Secured by Razorpay · 256-bit encryption
                  </div>

                  {/* Error */}
                  {status === 'error' && errorMsg && (
                    <m.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4"
                    >
                      {errorMsg}
                    </m.div>
                  )}

                  {/* What you get */}
                  <div className="space-y-2 mb-6">
                    {[
                      'Premium animated invitation template',
                      'Unlimited guest tokens & RSVP tracking',
                      'Real-time dashboard with analytics',
                      'WhatsApp bulk distribution tools',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-ink">
                        <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={handlePay}
                    disabled={status === 'loading' || status === 'processing'}
                    className="w-full bg-ink text-gold py-4 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-ink/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg"
                    style={{
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15), inset 0px 1px 0px rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {status === 'loading' || status === 'processing' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {status === 'processing' ? 'Processing Payment...' : 'Opening Gateway...'}
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Pay ₹1 & Go Live
                      </>
                    )}
                  </button>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  )
}
