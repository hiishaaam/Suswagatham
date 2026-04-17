'use client'

import { useState, useEffect } from 'react'
import { Download, Info, Clock } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

type Props = {
  event: any
  summary: any
  subEvents: any[]
  isCutoffPassed: boolean
  catererName: string
  accessToken: string
}

export default function CatererView({ event, summary, subEvents, isCutoffPassed, catererName, accessToken }: Props) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Countdown timer logic
  useEffect(() => {
    if (!event.rsvp_cutoff_at || isCutoffPassed) return

    const cutoff = new Date(event.rsvp_cutoff_at).getTime()
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = cutoff - now

      if (distance < 0) {
        clearInterval(timer)
        window.location.reload() // Reload to get locked state
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [event.rsvp_cutoff_at, isCutoffPassed])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await fetch(`/api/caterer/${event.id}/export-pdf?access=${accessToken}`)
      if (!res.ok) throw new Error('Failed to generate PDF')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `KitchenReport_${event.couple_names.replace(/\s+/g, '')}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error generating PDF report')
    } finally {
      setIsExporting(false)
    }
  }

  const vegPercent = summary.total_headcount > 0 ? Math.round((summary.veg_count / summary.total_headcount) * 100) : 0
  const nonVegPercent = summary.total_headcount > 0 ? Math.round((summary.non_veg_count / summary.total_headcount) * 100) : 0

  const animatedTotal = useCountUp(summary.total_headcount || 0)
  const animatedVeg = useCountUp(summary.veg_count || 0)
  const animatedNonVeg = useCountUp(summary.non_veg_count || 0)
  const animatedVegPrep = useCountUp(Math.ceil(summary.veg_count * 1.1))
  const animatedNonVegPrep = useCountUp(Math.ceil(summary.non_veg_count * 1.1))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Print-only CSS hiding UI buttons */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .shadow-card { box-shadow: none !important; border: 1px solid #E8D5A3 !important; }
        }
      `}} />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-gold-light">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-6 h-6 rounded border border-gold/50 bg-gold/10">W</div>
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold">WeddWise Kitchen Report</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mb-1">{event.couple_names} Wedding — {event.venue_name}</h1>
          <p className="text-sm text-muted">
            {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
          </p>
          <p className="text-xs text-muted mt-1 opacity-70">Prepared for: {catererName}</p>
        </div>

        <div>
          {isCutoffPassed ? (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest text-center shadow-sm">
              FINAL COUNT LOCKED
            </div>
          ) : (
            <div className="flex flex-col items-center md:items-end gap-1">
              <div className="bg-success/10 border border-success/20 text-success px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                LIVE (UPDATING)
              </div>
              {timeLeft && (
                <div className="text-xs font-mono text-muted flex items-center gap-1 mt-1">
                  <Clock size={12} /> {timeLeft} until lock
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Headcount */}
      <section className="bg-white rounded-sm shadow-card border border-gold-light p-8 md:p-12 text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 w-full left-0 h-2 bg-gradient-to-r from-gold-light via-gold to-gold-light opacity-50"></div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted font-bold mb-4">Total Confirmed Guests</div>
        <div className="font-display text-7xl md:text-[96px] leading-none text-gold mb-4">
          {animatedTotal}
        </div>
        <div className="text-sm text-muted">
          Recommended target: <strong className="text-ink font-bold">{Math.ceil(summary.total_headcount * 1.1)}</strong> (Total + 10% safety buffer)
        </div>
        {!isCutoffPassed && event.rsvp_cutoff_at && (
           <div className="mt-4 text-[11px] uppercase tracking-widest text-muted italic">
             Updates active until {new Date(event.rsvp_cutoff_at).toLocaleString()}
           </div>
        )}
      </section>

      {/* Food Split */}
      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">Primary Dietary Split</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-sm shadow-card border border-gold-light/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🌿</span>
              <span className="text-sm font-bold text-success bg-success/10 px-2 py-0.5 rounded">{vegPercent}%</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted mb-1">Vegetarian</div>
            <div className="font-display text-4xl text-ink">{animatedVeg}</div>
          </div>
          <div className="bg-white rounded-sm shadow-card border border-gold-light/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🍖</span>
              <span className="text-sm font-bold text-error bg-error/10 px-2 py-0.5 rounded">{nonVegPercent}%</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted mb-1">Non-Vegetarian</div>
            <div className="font-display text-4xl text-ink">{animatedNonVeg}</div>
          </div>
        </div>

        {summary.total_headcount > 0 && (
          <div className="h-4 w-full bg-[#EAE5D9] rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-success transition-all" style={{ width: `${vegPercent}%` }}></div>
            <div className="h-full bg-gold transition-all" style={{ width: `${Math.max(0, 100 - vegPercent)}%` }}></div>
          </div>
        )}
      </section>

      {/* Recommended Buffer Box */}
      <section className="bg-[#0F0C07] text-ivory p-6 md:p-8 rounded-sm shadow-card mb-8 border border-gold">
        <div className="flex items-center gap-2 text-gold mb-4 uppercase tracking-widest text-xs font-bold">
          <Info size={16} /> Recommended Kitchen Preparation
        </div>
        <div className="grid grid-cols-2 gap-8 divide-x divide-white/10">
          <div>
            <div className="text-white/60 text-xs mb-1">Vegetarian Prepare For:</div>
            <div className="text-3xl font-display font-semibold text-white">{animatedVegPrep}</div>
          </div>
          <div className="pl-8">
            <div className="text-white/60 text-xs mb-1">Non-Veg Prepare For:</div>
            <div className="text-3xl font-display font-semibold text-white">{animatedNonVegPrep}</div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-white/40 uppercase tracking-widest">
          * Calculation models a standard 10% over-provision buffer to prevent shortages during Kerala wedding peaks.
        </div>
      </section>

      {/* Sub Events */}
      {subEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">Event Breakdown</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
            {subEvents.map((se) => (
              <div key={se.id} className="min-w-[240px] md:min-w-[280px] bg-white rounded-sm shadow-card border border-gold-light/50 flex-shrink-0 p-5">
                <h3 className="font-display text-xl font-bold text-ink mb-1">{se.name}</h3>
                <p className="text-xs text-muted mb-4">{se.event_date_time ? new Date(se.event_date_time).toLocaleString() : 'Time TBA'}</p>
                <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                  <div>
                     <div className="text-[10px] uppercase tracking-widest text-muted">Confirmed</div>
                     <div className="text-2xl font-display font-bold text-gold">{se.headcount}</div>
                  </div>
                  <div className="text-right text-xs text-muted">
                    V: <strong className="text-ink">{se.veg_count}</strong> &middot; NV: <strong className="text-ink">{se.non_veg_count}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Export Action */}
      <div className="no-print mt-10">
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-gold text-white font-bold uppercase tracking-widest py-5 rounded-sm flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(201,168,76,0.4)] hover:bg-gold/90 transition-transform active:scale-[0.99] disabled:opacity-70 disabled:active:scale-100"
        >
          {isExporting ? 'Generating Report...' : <><Download size={20} /> Export Kitchen PDF Report</>}
        </button>
      </div>

    </div>
  )
}
