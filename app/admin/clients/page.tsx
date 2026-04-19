import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail, Search, Users2, ChevronRight, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const supabase = await createClient()

  // Check if user is authenticated and is Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@achievelog.com') {
    redirect('/admin')
  }

  // Fetch all events for the CRM
  // Note: Since we don't have a distinct "clients" table in this MVP, we treat "couple_names" and "user_id" from events as our Client objects.
  const { data: events } = await supabase
    .from('events')
    .select('id, couple_names, event_slug, created_at, status')
    .order('created_at', { ascending: false })

  // Deduplicate by couple_names to create a mock "Client" array
  const clientMap = new Map<string, any>()
  ;((events as any[]) || []).forEach((evt: any) => {
    if (!clientMap.has(evt.couple_names)) {
      clientMap.set(evt.couple_names, {
        name: evt.couple_names,
        first_event_at: evt.created_at,
        events: [evt]
      })
    } else {
      clientMap.get(evt.couple_names).events.push(evt)
    }
  })

  const clients = Array.from(clientMap.values())

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body text-ink">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Clients Directory</h1>
          <p className="text-muted text-sm uppercase tracking-widest">Manage your platform users and their events</p>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gold-light flex items-center gap-3">
           <Users2 size={16} className="text-gold" />
           <span className="font-bold text-sm tracking-widest uppercase text-ink">{clients.length} Total Clients</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-gold-light overflow-hidden transition-all">
        <div className="p-4 border-b border-gold-light/50 bg-ivory/30 flex items-center gap-2">
           <Search size={14} className="text-muted" />
           <input 
             type="text" 
             placeholder="Search directory..." 
             className="bg-transparent border-none focus:outline-none text-sm w-full font-medium placeholder:text-muted/50"
             disabled // Make functional if client component, but static for server component MVP
           />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-ivory border-b border-gold-light text-muted uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4 hidden md:table-cell">Joined</th>
                <th className="p-4">Active Events</th>
                <th className="p-4 hidden sm:table-cell">Primary Event Status</th>
                <th className="p-4 pr-6 text-right">Contact</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => {
                const primaryEvent = client.events[0]
                return (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gold-light/10 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                          <User size={14} />
                        </div>
                        <span className="font-display text-lg text-ink font-semibold">{client.name}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted text-xs font-medium">
                      {new Date(client.first_event_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className="bg-ink/5 text-ink border border-ink/10 px-2.5 py-1 rounded-md text-xs font-bold">
                        {client.events.length} Event{client.events.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border ${
                        primaryEvent.status === 'live' ? 'bg-green-100 text-green-800 border-green-200' :
                        primaryEvent.status === 'draft' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {primaryEvent.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-ivory border border-gold-light text-muted hover:text-gold hover:border-gold hover:shadow-sm transition-all" title="Email Client">
                          <Mail size={14} />
                        </button>
                        <Link href={`/admin/events/${primaryEvent.id}`}>
                          <button className="text-xs uppercase tracking-widest font-bold text-gold hover:text-ink transition-colors flex items-center justify-end gap-1 p-2">
                            Folder <ChevronRight size={14} />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center text-muted">
                      <Users2 size={32} className="mb-3 opacity-20" />
                      <p className="font-display italic text-lg">No clients found on the platform.</p>
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
