import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Users, MousePointerClick, TrendingUp, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Check if user is authenticated and is Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@achievelog.com') {
    redirect('/admin')
  }

  // Fetch all events and summaries
  const { data: events } = await supabase.from('events').select('id, couple_names, event_slug')
  const { data: summaries } = await (supabase.from('event_summary') as any).select('*')

  const eventsDict = (events || []).reduce((acc: any, curr: any) => {
    acc[curr.id] = curr
    return acc
  }, {})

  // Calculate Global KPIs
  const totalRsvps = (summaries || []).reduce((sum: number, curr: any) => sum + (curr.total_responded || 0), 0)
  const totalAttending = (summaries || []).reduce((sum: number, curr: any) => sum + (curr.attending_count || 0), 0)
  const totalClicks = (summaries || []).reduce((sum: number, curr: any) => sum + (curr.total_clicks || 0), 0)
  const globalConversionRate = totalRsvps > 0 ? Math.round((totalAttending / totalRsvps) * 100) : 0

  // Combine and sort for Top Performing Events
  const topEvents = (summaries || [])
    .map((s: any) => ({
      ...s,
      couple_names: eventsDict[s.event_id]?.couple_names || 'Unknown',
      slug: eventsDict[s.event_id]?.event_slug
    }))
    .sort((a: any, b: any) => (b.total_responded || 0) - (a.total_responded || 0))
    .slice(0, 5) // Top 5

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body text-ink">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-muted text-sm uppercase tracking-widest">Global engagement data across all events</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-card border border-gold-light/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">Total Sent</div>
            <MousePointerClick size={16} className="text-gold" />
          </div>
          <div className="font-display text-4xl text-ink">{totalClicks}</div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gold/5 rounded-full" />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-card border border-gold-light/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">Total RSVPs</div>
            <Users size={16} className="text-gold" />
          </div>
          <div className="font-display text-4xl text-ink">{totalRsvps}</div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gold/5 rounded-full" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card border border-gold-light/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">Total Attending</div>
            <TrendingUp size={16} className="text-success" />
          </div>
          <div className="font-display text-4xl text-success">{totalAttending}</div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-success/5 rounded-full" />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-card border border-gold-light/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">Avg. Conversion</div>
            <BarChart3 size={16} className="text-gold" />
          </div>
          <div className="font-display text-4xl text-gold">{globalConversionRate}%</div>
          <div className="mt-4 h-1 w-full bg-gold-light/20 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${globalConversionRate}%` }} />
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold mb-4">Top Performing Events</h2>
      <div className="bg-white rounded-xl shadow-card border border-gold-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory border-b border-gold-light text-muted uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="p-4 pl-6">Event Pair</th>
                <th className="p-4">Total Clicks</th>
                <th className="p-4">RSVPs</th>
                <th className="p-4">Attending</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {topEvents.map((evt: any, idx: number) => (
                <tr key={evt.event_id} className="border-b border-gray-50 hover:bg-gold-light/10 transition-colors">
                  <td className="p-4 pl-6 font-display font-bold text-ink">{evt.couple_names}</td>
                  <td className="p-4 text-muted">{evt.total_clicks || 0}</td>
                  <td className="p-4 text-muted">{evt.total_responded || 0}</td>
                  <td className="p-4 font-bold text-success">{evt.attending_count || 0}</td>
                  <td className="p-4 pr-6 text-right">
                    <Link href={`/admin/events/${evt.event_id}`}>
                      <button className="text-xs uppercase tracking-widest font-bold text-gold hover:text-ink transition-colors flex items-center justify-end w-full gap-1">
                        View <ChevronRight size={14} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {topEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted italic">No data recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
