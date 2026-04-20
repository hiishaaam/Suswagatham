'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Scanner } from '@yudiel/react-qr-scanner'
import { ChevronLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function QRScannerPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  
  const [scanning, setScanning] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean,
    data?: any,
    error?: string
  } | null>(null)

  const handleScan = async (tokens: any[]) => {
    if (!tokens || tokens.length === 0 || !scanning || loading) return
    
    // Most scanners return array of hits, take the first one
    const token = tokens[0].rawValue

    setScanning(false)
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`/api/admin/events/${eventId}/verify-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unique_token: token })
      })
      const data = await res.json()
      
      if (data.success) {
        setResult({ success: true, data: data.guest })
      } else {
        setResult({ success: false, error: data.error || 'Invalid ticket' })
      }
    } catch (err) {
      setResult({ success: false, error: 'Connection error' })
    } finally {
      setLoading(false)
    }
  }

  const resetScan = () => {
    setResult(null)
    setScanning(true)
  }

  return (
    <div className="min-h-screen bg-ink text-ivory font-body flex flex-col">
      <div className="p-4 border-b border-gold-light/20 flex items-center justify-between bg-black/50">
        <button onClick={() => router.push(`/dashboard/${eventId}`)} className="p-2 -ml-2 text-gold">
          <ChevronLeft size={24} />
        </button>
        <span className="font-display font-bold text-lg tracking-widest uppercase">Scanner</span>
        <div className="w-10"></div> {/* spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {scanning ? (
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-light relative bg-black/20">
            <div className="aspect-square relative">
              <Scanner 
                onScan={handleScan}
                onError={(err) => {
                  console.log(err)
                  setScanning(false)
                  setResult({ success: false, error: 'Camera access denied or error occurred.' })
                }}
                formats={['qr_code']}
              />
              <div className="absolute inset-0 border-2 border-gold pointer-events-none opacity-50 m-8 rounded-xl"></div>
            </div>
            <div className="p-4 text-center text-sm font-semibold text-gold/80 uppercase tracking-widest bg-black/60">
              Point camera at guest QR code
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm bg-white rounded-2xl p-8 text-ink shadow-2xl relative overflow-hidden text-center">
             {loading && (
               <div className="flex flex-col items-center justify-center py-10">
                 <Loader2 className="animate-spin text-gold w-12 h-12 mb-4" />
                 <p className="font-bold text-muted uppercase tracking-widest text-xs">Verifying Ticket...</p>
               </div>
             )}
             
             {result && result.success && (
               <div className="py-2">
                 <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 size={40} className="text-success" />
                 </div>
                 <h2 className="font-display text-3xl font-bold mb-1">Check-in Success!</h2>
                 <p className="text-xl font-body font-semibold text-gold mb-6">{result.data.family_name}</p>
                 
                 <div className="bg-ivory rounded-xl p-4 mb-8 text-left space-y-3">
                   <div className="flex justify-between border-b border-gold-light/40 pb-2">
                     <span className="text-xs font-bold text-muted uppercase tracking-wider">Headcount</span>
                     <span className="font-bold text-lg">{result.data.guest_count}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-xs font-bold text-muted uppercase tracking-wider">Food Pref</span>
                     <span className="font-bold capitalize">{result.data.food_preference?.replace('_', '-')}</span>
                   </div>
                 </div>

                 <button onClick={resetScan} className="w-full bg-gold text-white font-bold uppercase tracking-widest py-4 rounded-xl flex justify-center items-center gap-2 active:scale-[0.98] transition-transform">
                   Scan Next Guest
                 </button>
               </div>
             )}

             {result && !result.success && (
               <div className="py-2">
                 <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <XCircle size={40} className="text-error" />
                 </div>
                 <h2 className="font-display text-3xl font-bold mb-4 text-error">Invalid Ticket</h2>
                 <p className="text-muted mb-8">{result.error}</p>
                 
                 <button onClick={resetScan} className="w-full bg-ink text-white font-bold uppercase tracking-widest py-4 rounded-xl flex justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-md">
                   Try Again
                 </button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  )
}
