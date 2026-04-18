'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Eye, Power, CheckCircle2, Search, Filter, Edit3, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type EventType = any // Type will be injected

export default function EventsTable({ initialEvents }: { initialEvents: EventType[] }) {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Dashboard Controls
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
  }

  const getRelativeTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diffTime = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return formatDate(dateStr)
  }

  const handleCopy = (slug: string, id: string) => {
    const url = `${window.location.origin}/events/${slug}`
    navigator.clipboard.writeText(url)
    setCopyFeedback(id)
    setTimeout(() => setCopyFeedback(null), 2000)
  }

  const handleToggleLive = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'live' ? 'draft' : 'live'
    
    // Optimistic update
    setEvents(events.map(e => e.id === id ? { ...e, status: newStatus } : e))

    try {
      await fetch(`/api/admin/events/${id}/toggle-status`, {
        method: 'POST',
      })
    } catch (err) {
      // Revert on error
      setEvents(events.map(e => e.id === id ? { ...e, status: currentStatus } : e))
      alert('Failed to toggle status')
    }
  }

  const handleDelete = async (id: string, coupleNames: string) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${coupleNames}"?\n\nThis will delete all guest tokens, RSVPs, and analytics data. This action cannot be undone.`)
    if (!confirmed) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setEvents(events.filter(e => e.id !== id))
      } else {
        alert('Delete failed: ' + data.error)
      }
    } catch {
      alert('Failed to delete event')
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Draft</span>
      case 'design_pending': return <span className="bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Design Pending</span>
      case 'live': return (
        <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 w-max shadow-sm mx-auto md:mx-0">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          Live
        </span>
      )
      case 'completed': return <span className="bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Completed</span>
      default: return <span className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">{status}</span>
    }
  }

  // Filter events based on search and status
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.couple_names.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.event_slug?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort events by created_at desc (which relies on database order by default, but ensuring sorting here is safe)
  filteredEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="mt-8">
      {/* Dashboard Controls (Search & Filter) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search couple names or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gold-light rounded-xl text-sm font-body text-ink placeholder:text-muted/60 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all shadow-sm"
          />
        </div>
        <div className="relative w-full md:w-48 shrink-0">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            <Filter size={16} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-gold-light rounded-xl text-sm font-body text-ink focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Mobile Card View (< 768px) */}
      <div className="flex flex-col gap-4 md:hidden">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-card border border-gold-light p-5 relative overflow-hidden transition-all hover:shadow-md">
             <div className="absolute top-0 right-0 p-4">
                 {getStatusBadge(event.status)}
             </div>
             <h3 className="font-display text-xl text-ink font-bold mb-1 w-[80%]">{event.couple_names}</h3>
             <div className="text-xs text-muted mb-4 font-semibold uppercase tracking-widest">{formatDate(event.event_date)}</div>
             
             {/* Progress Bar inside card */}
             {event.summary?.total_responded > 0 && (
               <div className="mb-4">
                 <div className="flex justify-between text-[10px] uppercase font-bold text-muted mb-1.5">
                   <span>Attending</span>
                   <span>{event.summary.attending_count} / {event.summary.total_responded}</span>
                 </div>
                 <div className="h-1.5 w-full bg-gold-light/30 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gold rounded-full" 
                     style={{ width: `${Math.min(100, Math.round((event.summary.attending_count / event.summary.total_responded) * 100))}%` }}
                   />
                 </div>
               </div>
             )}
             
             <div className="flex gap-2 border-t border-gold-light/40 pt-4">
                <Link href={`/admin/events/${event.id}`} className="flex-1">
                  <button className="w-full h-10 rounded-lg bg-ink text-ivory text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-ink/90 active:scale-[0.98] transition-all">
                    <Edit3 size={14} /> Edit
                  </button>
                </Link>
                <button 
                  onClick={() => handleCopy(event.event_slug, event.id)}
                  className="h-10 px-4 rounded-lg bg-ivory border border-gold-light text-muted hover:text-gold hover:border-gold active:scale-[0.98] transition-all flex items-center justify-center shadow-sm"
                >
                  {copyFeedback === event.id ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
                </button>
                 <button 
                   onClick={() => handleDelete(event.id, event.couple_names)}
                   disabled={deletingId === event.id}
                   className="h-10 px-3 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50"
                 >
                   <Trash2 size={16} />
                 </button>
             </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="p-8 text-center bg-white border border-gold-light rounded-xl border-dashed">
            <p className="text-muted text-sm uppercase tracking-widest font-bold">No events found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View (>= 768px) */}
      <div className="bg-white rounded-xl shadow-card border border-gold-light hidden md:block overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
          <thead className="bg-ivory border-b border-gold-light text-muted uppercase tracking-widest text-[10px] font-bold">
            <tr>
              <th className="p-4 pl-6 cursor-pointer hover:bg-gold-light/20 transition-colors">Couple Names</th>
              <th className="p-4 hidden lg:table-cell">Slug</th>
              <th className="p-4 hidden md:table-cell cursor-pointer hover:bg-gold-light/20 transition-colors">Date</th>
              <th className="p-4 text-center md:text-left">Status</th>
              <th className="p-4 hidden xl:table-cell">Engagement</th>
              <th className="p-4 hidden md:table-cell cursor-pointer hover:bg-gold-light/20 transition-colors">Created</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, idx) => (
              <tr key={event.id} className="border-b border-gray-50 hover:bg-ivory/60 transition-colors group">
                <td className="p-4 pl-6 font-display text-lg text-ink font-semibold whitespace-nowrap">{event.couple_names}</td>
                <td className="p-4 text-muted/60 hidden lg:table-cell whitespace-nowrap font-mono text-xs">{event.event_slug}</td>
                <td className="p-4 text-ink hidden md:table-cell whitespace-nowrap font-medium text-xs">{(() => {
                  const d = new Date(event.event_date);
                  return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
                })()}</td>
                <td className="p-4 text-center md:text-left">{getStatusBadge(event.status)}</td>
                <td className="p-4 hidden xl:table-cell">
                  {event.summary?.total_responded > 0 ? (
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-muted mb-1">
                        <span>Attending</span>
                        <span className="text-success">{event.summary.attending_count} / {event.summary.total_responded}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gold-light/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, Math.round((event.summary.attending_count / event.summary.total_responded) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted/40 text-xs italic">No RSVPs yet</span>
                  )}
                </td>
                <td className="p-4 hidden md:table-cell text-muted whitespace-nowrap text-xs font-medium">
                  {getRelativeTime(event.created_at)}
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleToggleLive(event.id, event.status)}
                      title="Toggle Live"
                      className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 ${event.status === 'live' ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'}`}
                    >
                      <Power size={14} />
                    </button>
                    <button 
                      onClick={() => handleCopy(event.event_slug, event.id)}
                      title="Copy Link"
                      className="p-2 rounded-lg bg-ivory border border-gold-light text-muted hover:text-gold hover:border-gold hover:shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      {copyFeedback === event.id ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                    <Link href={`/admin/events/${event.id}`}>
                      <button 
                        title="Edit Event"
                        className="p-2 rounded-lg bg-ink text-ivory flex items-center justify-center gap-1.5 px-3 hover:bg-ink/90 transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <Edit3 size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Edit</span>
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(event.id, event.couple_names)}
                      disabled={deletingId === event.id}
                      title="Delete Event"
                      className="p-2 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={9} className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-muted">
                    <Search size={32} className="mb-3 opacity-20" />
                    <p className="font-display italic text-lg">{searchQuery ? 'No events match your search.' : 'No events found. Create your first one!'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     </div>
    </div>
  )
}
