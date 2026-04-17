'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Eye, Power, CheckCircle2 } from 'lucide-react'

type EventType = any // Type will be injected

export default function EventsTable({ initialEvents }: { initialEvents: EventType[] }) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
  }

  const [events, setEvents] = useState(initialEvents)
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Draft</span>
      case 'design_pending': return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Design</span>
      case 'preview_sent': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Preview</span>
      case 'live': return (
        <span className="bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-max mx-auto md:mx-0">
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
          Live
        </span>
      )
      case 'completed': return <span className="bg-muted/10 text-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Completed</span>
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>
    }
  }

  return (
    <div className="mt-8">
      {/* Mobile Card View (< 768px) */}
      <div className="flex flex-col gap-4 md:hidden">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-sm shadow-card border border-gold-light p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3">
                 {getStatusBadge(event.status)}
             </div>
             <h3 className="font-display text-2xl text-ink font-bold mb-1 w-[80%]">{event.couple_names}</h3>
             <div className="text-sm text-muted mb-4">Date: {formatDate(event.event_date)}</div>
             
             <div className="flex gap-2 border-t border-gold-light/40 pt-4">
                <Link href={`/admin/events/${event.id}`} className="flex-1">
                  <button className="w-full h-10 rounded-sm bg-ink text-ivory text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Eye size={14} /> View
                  </button>
                </Link>
                <button 
                  onClick={() => handleCopy(event.event_slug, event.id)}
                  className="h-10 px-4 rounded-sm bg-ivory border border-gold-light text-muted hover:text-gold transition-colors flex items-center justify-center"
                >
                  {copyFeedback === event.id ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (>= 768px) */}
      <div className="bg-white rounded-sm shadow-card border border-gold-light hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
          <thead className="bg-ivory border-b border-gold uppercase text-muted tracking-wider text-xs">
            <tr>
              <th className="p-4 font-semibold">Couple Names</th>
              <th className="p-4 font-semibold hidden lg:table-cell">Slug</th>
              <th className="p-4 font-semibold hidden md:table-cell">Date</th>
              <th className="p-4 font-semibold text-center md:text-left">Status</th>
              <th className="p-4 font-semibold hidden xl:table-cell">Clicks</th>
              <th className="p-4 font-semibold hidden xl:table-cell">RSVPs</th>
              <th className="p-4 font-semibold hidden xl:table-cell">Attending</th>
              <th className="p-4 font-semibold hidden md:table-cell">Created</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr key={event.id} className={`border-b border-gray-50 hover:bg-gold-light/20 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-ivory/50'}`}>
                <td className="p-4 font-display text-lg text-ink font-semibold whitespace-nowrap">{event.couple_names}</td>
                <td className="p-4 text-muted hidden lg:table-cell whitespace-nowrap">{event.event_slug}</td>
                <td className="p-4 text-ink hidden md:table-cell whitespace-nowrap">{(() => {
                  const d = new Date(event.event_date);
                  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                })()}</td>
                <td className="p-4 text-center md:text-left">{getStatusBadge(event.status)}</td>
                <td className="p-4 hidden xl:table-cell text-muted">{event.summary?.total_clicks || 0}</td>
                <td className="p-4 hidden xl:table-cell text-muted">{event.summary?.total_responded || 0}</td>
                <td className="p-4 hidden xl:table-cell text-success font-medium">{event.summary?.attending_count || 0}</td>
                <td className="p-4 hidden md:table-cell text-muted whitespace-nowrap">{(() => {
                  const d = new Date(event.created_at);
                  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                })()}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleToggleLive(event.id, event.status)}
                      title="Toggle Live"
                      className={`p-2 rounded-sm border transition-colors ${event.status === 'live' ? 'bg-error/10 text-error border-error/20 hover:bg-error/20' : 'bg-success/10 text-success border-success/20 hover:bg-success/20'}`}
                    >
                      <Power size={14} />
                    </button>
                    <button 
                      onClick={() => handleCopy(event.event_slug, event.id)}
                      title="Copy Link"
                      className="p-2 rounded-sm bg-ivory border border-gold-light text-muted hover:text-gold hover:border-gold transition-colors"
                    >
                      {copyFeedback === event.id ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                    <Link href={`/admin/events/${event.id}`}>
                      <button 
                        title="View Internals"
                        className="p-2 rounded-sm bg-ink text-ivory hover:bg-ink/90 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted font-display italic text-lg">No events found. Create your first one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     </div>
    </div>
  )
}
