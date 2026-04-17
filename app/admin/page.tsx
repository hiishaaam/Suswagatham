export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import EventsTable from './EventsTable'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // Fetch events
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch summaries
  const { data: summaryData } = await (supabase.from('event_summary') as any)
    .select('*')

  const summariesByEventId = (summaryData || []).reduce((acc: any, curr: any) => {
    acc[curr.event_id] = curr
    return acc
  }, {})

  const eventsDataArr = eventsData as any[] || []

  const events = eventsDataArr.map(e => ({
    ...e,
    summary: summariesByEventId[e.id] || null
  }))

  const totalEvents = events.length
  const liveEvents = events.filter(e => e.status === 'live').length
  const totalRsvps = events.reduce((sum, e) => sum + (e.summary?.total_responded || 0), 0)
  
  // Avg Response Rate -> (Total Responded / Total Generated Tokens limit...) 
  // Wait, let's simplify average response rate. Total Responded / Total Links Clicked ?
  // Or just Total Attending / Total Responded as attendance rate. Let's do that.
  const totalAttending = events.reduce((sum, e) => sum + (e.summary?.attending_count || 0), 0)
  const avgResponseRate = totalRsvps > 0 ? Math.round((totalAttending / totalRsvps) * 100) : 0

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink font-bold tracking-wide">Event Command Center</h1>
          <p className="text-muted text-sm uppercase tracking-widest mt-2 hover:text-gold transition-colors">Manage WeddWise Workloads</p>
        </div>
        <Link href="/admin/events/new">
          <button className="bg-gold text-ivory px-6 py-3 rounded-sm flex items-center gap-2 font-semibold uppercase tracking-wider text-xs hover:bg-gold/90 transition-colors shadow-sm">
            <PlusCircle size={16} />
            New Event
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-sm shadow-card border border-gold-light/50 flex flex-col justify-center">
          <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-2">Total Events</div>
          <div className="font-display text-4xl text-ink">{totalEvents}</div>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-card border border-gold-light/50 flex flex-col justify-center">
          <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-2">Live Events</div>
          <div className="font-display text-4xl text-gold">{liveEvents}</div>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-card border border-gold-light/50 flex flex-col justify-center">
          <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-2">Total RSVPs</div>
          <div className="font-display text-4xl text-ink">{totalRsvps}</div>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-card border border-gold-light/50 flex flex-col justify-center">
          <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-2">Attending Rate</div>
          <div className="font-display text-4xl text-gold">{avgResponseRate}%</div>
        </div>
      </div>

      <EventsTable initialEvents={events} />
    </div>
  )
}
