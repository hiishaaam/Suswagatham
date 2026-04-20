'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-error/10 text-error flex flex-col items-center justify-center mb-6 border border-error/20">
         <AlertTriangle size={24} />
      </div>
      
      <h2 className="font-display text-3xl font-bold text-ink mb-3">Something went wrong</h2>
      <p className="font-body text-muted text-sm max-w-md mx-auto mb-8 leading-relaxed">
        { }
        We've encountered an unexpected issue. Please try reloading the page, or contact support if the problem persists.
      </p>

      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-white border border-gold-light text-ink font-body text-sm font-bold uppercase tracking-widest rounded-sm hover:border-gold transition-colors shadow-sm"
      >
        Try again
      </button>
    </div>
  )
}
