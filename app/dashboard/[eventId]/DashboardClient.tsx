'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Plus, Users, Utensils, CheckCircle2, ChevronDown, ChevronUp, Copy, Download, Share2, Search, Link as LinkIcon, Loader2 } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { SectionErrorBoundary } from '@/components/ui/SectionErrorBoundary'
import { motion, AnimatePresence } from 'motion/react'

// Types
type EventInfo = {
  id: string
  couple_names: string
  event_date: string
  status: string
  event_slug: string
}

type Summary = {
  total_clicks: number
  total_responded: number
  attending_count: number
  not_attending_count: number
  total_headcount: number
  veg_count: number
  non_veg_count: number
  totalTokens: number
}

type Guest = {
  id: string
  family_name: string
  phone: string | null
  attending: boolean
  guest_count: number
  food_preference: string | null
  is_manual: boolean
  submitted_at: string
}

type Props = {
  event: EventInfo
  initialSummary: Summary
  initialGuests: Guest[]
  eventId: string
  userPhone: string
}

export default function DashboardClient({ event, initialSummary, initialGuests, eventId, userPhone }: Props) {
  const [summary, setSummary] = useState<Summary>(initialSummary)
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [isManualExpanded, setIsManualExpanded] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number>(0) // seconds ago
  
  // Status check
  useEffect(() => {
    const timer = setInterval(() => setLastUpdated(prev => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Polling
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/dashboard/${eventId}/summary`)
        const data = await res.json()
        if (data.success && data.summary) {
          setSummary(data.summary)
          setLastUpdated(0) // reset timer
        }
      } catch (err) {
        console.error('Polling failed', err)
      }
    }
    const pollTimer = setInterval(poll, 60000)
    return () => clearInterval(pollTimer)
  }, [eventId])

  // Countup animation component inline
  const StatCard = ({ label, value, colorAccent = '', main = false, prefix = '' }: any) => {
    // Only animate raw numbers
    const isNum = typeof value === 'number'
    const animatedValue = useCountUp(isNum ? value : 0)
    const displayValue = isNum ? animatedValue : value

    return (
      <div className={`bg-white rounded-2xl shadow-card p-5 flex flex-col justify-center relative overflow-hidden ${main ? 'col-span-2 border border-gold' : ''}`}>
        {colorAccent && <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorAccent}`}></div>}
        <div className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.15em] font-bold mb-1 opacity-80">{label}</div>
        <div className="font-display text-3xl sm:text-4xl text-ink font-semibold mt-1">
          {prefix}{displayValue ?? '-'}
        </div>
      </div>
    )
  }

  // Quick Add State
  const [manualForm, setManualForm] = useState({ family_name: '', guest_count: 1, food_preference: 'both' })
  const [isAdding, setIsAdding] = useState(false)

  const handleManualAdd = async () => {
    if (!manualForm.family_name.trim()) return alert('Name required')
    setIsAdding(true)
    try {
      const res = await fetch(`/api/dashboard/${eventId}/manual-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm)
      })
      const data = await res.json()
      if (data.success) {
        // Optimistic update of latest guest list
        setGuests([{
          id: data.rsvp.id,
          family_name: manualForm.family_name,
          phone: null,
          attending: true,
          guest_count: manualForm.guest_count,
          food_preference: manualForm.food_preference,
          is_manual: true,
          submitted_at: new Date().toISOString()
        }, ...guests])
        
        // Refresh summary
        const sumRes = await fetch(`/api/dashboard/${eventId}/summary`)
        const sumData = await sumRes.json()
        if (sumData.success) {
          setSummary(sumData.summary)
          setLastUpdated(0)
        }
        
        setManualForm({ family_name: '', guest_count: 1, food_preference: 'both' })
        setIsManualExpanded(false)
        alert('Added! Headcount updated.')
      } else {
        alert(data.error)
      }
    } catch (e) {
      alert('Failed to add')
    } finally {
      setIsAdding(false)
    }
  }

  // Sharing
  const eventUrl = typeof window !== 'undefined' ? `${window.location.origin}/events/${event.event_slug}` : ''
  
  const [copying, setCopying] = useState(false)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl)
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
  }

  const handleDownloadQR = async () => {
    try {
      const url = await QRCode.toDataURL(eventUrl, { margin: 2, scale: 10, color: { dark: '#1A1208', light: '#FAF7F0' } })
      const a = document.createElement('a')
      a.href = url
      a.download = `WeddWise-QR-${event.event_slug}.png`
      a.click()
    } catch (err) {
      alert('Failed to generate QR')
    }
  }

  // Derived calculations
  const noReplyCount = Math.max(0, (summary?.totalTokens || 0) - (summary?.total_responded || 0))
  const progressPercent = summary?.totalTokens > 0 ? Math.min(100, Math.round(((summary?.total_responded || 0) / summary.totalTokens) * 100)) : 0

  const timeAgo = (dateStr: string) => {
    const minDiff = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (minDiff < 1) return 'Just now'
    if (minDiff < 60) return `${minDiff}m ago`
    const hrDiff = Math.floor(minDiff/60)
    if (hrDiff < 24) return `${hrDiff}h ago`
    return `${Math.floor(hrDiff/24)}d ago`
  }

  // Guest list filters & pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all'|'coming'|'not_coming'>('all')
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(guests.length >= 20)

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      const res = await fetch(`/api/dashboard/${eventId}/guests?offset=${guests.length}&limit=20`)
      const data = await res.json()
      if (data.success && data.guests.length > 0) {
        setGuests(prev => [...prev, ...data.guests])
        if (data.guests.length < 20) setHasMore(false)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more guests', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const filteredGuests = guests.filter(g => {
    if (filter === 'coming' && !g.attending) return false
    if (filter === 'not_coming' && g.attending) return false
    if (searchTerm && !g.family_name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const maskPhone = (phone: string) => {
    const clean = phone.replace('+91', '').trim()
    if (clean.length < 10) return phone
    return `+91 ${clean.slice(0, 5)} xxxxx`
  }

  const handleLogout = async () => {
    const { signOut } = await import('@/lib/supabase/auth')
    await signOut()
    window.location.href = '/dashboard/login'
  }

  return (
    <>
      {/* Session Aware Header */}
      <div className="w-full bg-white border-b border-gold-light p-4 px-6 flex justify-between items-center sm:px-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="text-gold font-display text-[10px] font-bold flex items-center justify-center w-6 h-6 rounded border border-gold/50 bg-gold/10">W</div>
          <span className="font-display text-sm font-bold text-ink">WeddWise Dashboard</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-body">
          <span className="text-muted hidden sm:inline-flex">{maskPhone(userPhone)}</span>
          <button 
            onClick={handleLogout}
            className="text-ink font-bold uppercase tracking-widest hover:text-gold transition-colors text-[10px]"
          >
            Logout
          </button>
        </div>
      </div>

    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-40">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="text-gold font-display text-xl font-bold flex items-center justify-center w-8 h-8 rounded border border-gold/50 bg-gold/10 mb-4">
          W
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-2">{event.couple_names}'s Wedding</h1>
        <div className="flex items-center gap-2">
          <p className="text-muted text-sm sm:text-base">{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}</p>
          <span className="w-1 h-1 bg-gold rounded-full"></span>
          <span className="bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs uppercase tracking-widest text-muted font-bold">Responses</span>
          <span className="text-sm font-semibold text-ink">{summary?.total_responded || 0} of {summary?.totalTokens || 0}</span>
        </div>
        <div className="h-3 w-full bg-[#EAE5D9] rounded-full overflow-hidden">
          <div className="h-full bg-gold transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="text-right mt-1.5 text-[10px] text-muted italic">Updated {lastUpdated}s ago</div>
      </div>

      {/* Grid */}
      <SectionErrorBoundary sectionName="Summary Grid">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
          <StatCard main label="Total Guests Coming" value={summary?.total_headcount} />
          <StatCard label="Families Coming" value={summary?.attending_count} colorAccent="bg-success" />
          <StatCard label="Not Coming" value={summary?.not_attending_count} colorAccent="bg-muted" />
          <StatCard label="Still Waiting" value={summary?.totalTokens === 0 ? '?' : noReplyCount} colorAccent="bg-amber-400" />
          <StatCard label="Link Opened" value={summary?.total_clicks} prefix="👁 " />
          <StatCard label="Food: Veg" value={summary?.veg_count} />
          <StatCard label="Food: Non-Veg" value={summary?.non_veg_count} />
        </div>
      </SectionErrorBoundary>

      {/* Quick Add */}
      <SectionErrorBoundary sectionName="Add Guest Component">
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gold-light overflow-hidden transition-all">
          <button 
          onClick={() => setIsManualExpanded(!isManualExpanded)}
          className="w-full p-5 flex items-center justify-between text-left font-semibold text-ink uppercase tracking-widest text-sm hover:bg-ivory/50 transition-colors"
        >
          <span className="flex items-center gap-2"><Plus size={18} className="text-gold" /> Add Guest Manually</span>
          {isManualExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <AnimatePresence>
        {isManualExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="overflow-hidden">
          <div className="p-5 pt-0 border-t border-gold-light/20 bg-ivory/20">
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1 block">Family or Guest Name</label>
                <input 
                  type="text" 
                  value={manualForm.family_name}
                  onChange={e=>setManualForm({...manualForm, family_name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gold-light bg-white focus:outline-none focus:border-gold"
                  placeholder="e.g. Uncle John & Family"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1 block">Headcount</label>
                  <div className="flex items-center border border-gold-light rounded-xl bg-white overflow-hidden">
                    <button onClick={() => setManualForm(p=>({...p, guest_count: Math.max(1, p.guest_count - 1)}))} className="p-3 bg-ivory text-muted hover:text-ink active:bg-gold-light">-</button>
                    <div className="flex-1 text-center font-bold">{manualForm.guest_count}</div>
                    <button onClick={() => setManualForm(p=>({...p, guest_count: p.guest_count + 1}))} className="p-3 bg-ivory text-muted hover:text-ink active:bg-gold-light">+</button>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1 block">Primary Meal</label>
                  <div className="flex rounded-xl overflow-hidden border border-gold-light font-semibold text-xs">
                    <button onClick={()=>setManualForm(p=>({...p, food_preference: 'veg'}))} className={`flex-1 py-3 text-center transition ${manualForm.food_preference === 'veg' ? 'bg-gold text-white' : 'bg-white text-muted active:bg-ivory'}`}>Veg</button>
                    <button onClick={()=>setManualForm(p=>({...p, food_preference: 'non_veg'}))} className={`flex-1 py-3 text-center transition border-l border-gold-light ${manualForm.food_preference === 'non_veg' ? 'bg-gold text-white' : 'bg-white text-muted active:bg-ivory'}`}>Non-Veg</button>
                    <button onClick={()=>setManualForm(p=>({...p, food_preference: 'both'}))} className={`flex-1 py-3 text-center transition border-l border-gold-light ${manualForm.food_preference === 'both' ? 'bg-gold text-white' : 'bg-white text-muted active:bg-ivory'}`}>Both</button>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleManualAdd}
                disabled={isAdding}
                className="w-full bg-ink text-gold font-bold uppercase tracking-widest rounded-xl py-4 flex items-center justify-center gap-2 shadow-sm hover:bg-ink/90 active:scale-[0.98] transition-transform"
              >
                {isAdding ? <Loader2 className="animate-spin" size={18} /> : 'Save RSVP'}
              </button>
            </div>
          </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      </SectionErrorBoundary>

      {/* Guest List */}
      <SectionErrorBoundary sectionName="Recent Updates">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-2xl font-bold">Recent Updates</h2>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {['all', 'coming', 'not_coming'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${filter === f ? 'bg-ink text-ivory' : 'bg-white text-muted border border-gold-light'}`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search family name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gold-light bg-white focus:outline-none focus:border-gold shadow-sm"
          />
        </div>

        <div className="space-y-3">
          {filteredGuests.length > 0 ? filteredGuests.map(guest => (
            <div key={guest.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gold-light relative overflow-hidden group">
               {guest.attending ? <div className="absolute left-0 top-0 bottom-0 w-1 bg-success"></div> : <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted"></div>}
               <div className="flex justify-between items-start mb-2 pl-2">
                 <div className="font-bold text-ink pr-4 leading-tight">{guest.family_name}</div>
                 {guest.attending ? 
                    <span className="text-success font-bold text-[10px] uppercase tracking-wider bg-success/10 px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"><CheckCircle2 size={12}/> Coming</span> : 
                    <span className="text-muted font-bold text-[10px] uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">Not Coming</span>}
               </div>
               
               <div className="flex items-center gap-4 pl-2 text-sm text-muted">
                 {guest.attending && (
                   <>
                    <span className="font-bold text-gold flex items-center gap-1"><Users size={14}/> {guest.guest_count}</span>
                    <span className="flex items-center gap-1 capitalize"><Utensils size={14}/> {guest.food_preference?.replace('_', '-')}</span>
                   </>
                 )}
                 <span className="text-[10px] uppercase tracking-widest ml-auto opacity-70">{timeAgo(guest.submitted_at)}</span>
               </div>
               
               {guest.is_manual && <div className="absolute right-4 bottom-4 text-[9px] uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Manual Edit</div>}
            </div>
          )) : (
            <div className="text-center py-10 text-muted font-display italic text-xl">No RSVPs match your filters.</div>
          )}
          
          {hasMore && filteredGuests.length > 0 && (
            <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full py-4 mt-2 text-gold font-bold uppercase tracking-widest text-xs border border-gold-light rounded-xl flex justify-center items-center gap-2 hover:bg-gold/5 transition-colors disabled:opacity-50"
            >
              {loadingMore ? <Loader2 className="animate-spin" size={16} /> : 'Load More'}
            </button>
          )}
        </div>
      </div>
      </SectionErrorBoundary>

      {/* Bottom Sticky Share Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gold-light p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`You're invited to ${event.couple_names}'s Wedding! Confirm your attendance here: ${eventUrl}`)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white font-bold uppercase tracking-widest py-4 rounded-xl flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Share2 size={18} /> Send via WhatsApp
          </a>
          <div className="flex gap-3">
             <button onClick={handleCopyLink} className="flex-1 bg-ivory border border-gold-light text-ink font-bold uppercase tracking-widest text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
               {copying ? <CheckCircle2 size={16} className="text-success" /> : <LinkIcon size={16} />} Copy Link
             </button>
             <button onClick={handleDownloadQR} className="flex-1 bg-ivory border border-gold-light text-ink font-bold uppercase tracking-widest text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
               <Download size={16} /> QR Code
             </button>
          </div>
        </div>
      </div>

    </div>
    </>
  )
}
