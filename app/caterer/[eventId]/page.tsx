import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import CatererView from './CatererView'
type Props = {
  params: Promise<{ eventId: string }>
  searchParams: Promise<{ access?: string }>
}

export default async function CatererPage({ params, searchParams }: Props) {
  const { eventId } = await params
  const { access } = await searchParams

  if (!access) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-sm shadow-card max-w-lg text-center border border-gold-light">
          <div className="text-gold font-display text-2xl font-bold flex items-center justify-center w-12 h-12 rounded border border-gold/50 bg-gold/10 mx-auto mb-6">W</div>
          <h1 className="font-display text-4xl text-ink font-bold mb-4">Access Denied</h1>
          <p className="text-muted">A valid access token is required to view this kitchen report. Please request a new link from the host.</p>
        </div>
      </div>
    )
  }

  const supabase = createAdminClient()

  // 1. Verify access
  const { data: accessRecord, error: accessErr } = await supabase
    .from('caterer_access')
    .select('caterer_name')
    .eq('event_id', eventId)
    .eq('access_token', access)
    .single()

  if (accessErr || !accessRecord) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-sm shadow-card max-w-lg text-center border border-error/20">
          <div className="text-error font-display text-2xl font-bold flex items-center justify-center w-12 h-12 rounded border border-error/50 bg-error/10 mx-auto mb-6">X</div>
          <h1 className="font-display text-4xl text-ink font-bold mb-4">Invalid Link</h1>
          <p className="text-muted">This caterer access link is invalid or has been revoked.</p>
        </div>
      </div>
    )
  }

  const [
    { data: rawEvent, error: eventErr },
    { data: rawSummary },
    { data: rawSubEvents },
    { data: rawRsvps }
  ] = await Promise.all([
    supabase.from('events').select('id, couple_names, event_date, venue_name, rsvp_cutoff_at').eq('id', eventId).single(),
    (supabase.from('event_summary') as any).select('*').eq('event_id', eventId).single(),
    supabase.from('sub_events').select('*').eq('event_id', eventId).order('display_order', { ascending: true }),
    (supabase.from('rsvps') as any).select('guest_count, food_preference, sub_event_id').eq('event_id', eventId).eq('attending', true)
  ])

  const event = rawEvent as any
  if (eventErr || !event) return notFound()

  const summary = rawSummary as any || {}
  const subEventsData = rawSubEvents as any[] || []
  const rsvpsData = rawRsvps as any[] || []

  const subEvents = subEventsData.map(se => {
    const seRsvps = rsvpsData.filter(r => r.sub_event_id === se.id)
    const total = seRsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0)
    const vegCount = seRsvps.filter(r => r.food_preference === 'veg').reduce((sum, r) => sum + (r.guest_count || 0), 0)
    const nonVegCount = seRsvps.filter(r => r.food_preference === 'non_veg').reduce((sum, r) => sum + (r.guest_count || 0), 0)

    // Note: If guests could choose "both", they map to veg + non_veg in a complex way, but for MVP standard is veg/non-veg split. 
    // We treat "both" as non_veg by default or splitting, but in the DB summary they are just separate strings. 
    // Wait, the main schema says ('veg', 'non_veg', 'both'). In event_summary, Both isn't counted in Veg or NonVeg directly.
    // Let's count "both" for the sub_events too so they get added. We'll add both to BOTH categories for buffer, or show a 'both' count.
    // The prompt says "Recommended Buffer: veg prepare for veg+10% | non-veg prepare for non_veg+10%".
    const bothCount = seRsvps.filter(r => r.food_preference === 'both').reduce((sum, r) => sum + (r.guest_count || 0), 0)

    return {
      ...se,
      headcount: total,
      veg_count: vegCount + bothCount, // Count "both" as requiring both prep
      non_veg_count: nonVegCount + bothCount
    }
  })

  // For main summary, if guests selected "both", we should add them to both metrics for safety.
  // We'll calculate veg/non_veg precisely here.
  let finalVeg = 0
  let finalNonVeg = 0
  let finalTotal = summary.total_headcount || 0

  rsvpsData.forEach(r => {
    if (r.food_preference === 'veg') finalVeg += r.guest_count
    if (r.food_preference === 'non_veg') finalNonVeg += r.guest_count
    if (r.food_preference === 'both') {
      finalVeg += r.guest_count
      finalNonVeg += r.guest_count
    }
  })

  const finalSummary = {
    total_headcount: finalTotal,
    veg_count: finalVeg,
    non_veg_count: finalNonVeg
  }

  const isCutoffPassed = event.rsvp_cutoff_at ? new Date(event.rsvp_cutoff_at) < new Date() : false

  return (
    <div className="min-h-screen bg-ivory font-body text-ink">
      <CatererView 
        event={event} 
        summary={finalSummary}
        subEvents={subEvents}
        isCutoffPassed={isCutoffPassed}
        catererName={(accessRecord as any).caterer_name}
        accessToken={access}
      />
    </div>
  )
}
