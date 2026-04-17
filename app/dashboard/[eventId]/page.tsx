import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ eventId: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { eventId } = await params
  const supabase = createAdminClient()

  // Verify event
  const { data: rawEvent, error } = await supabase
    .from('events')
    .select('id, couple_names, event_date, status, event_slug')
    .eq('id', eventId)
    .single()

  const event = rawEvent as any

  if (error || !event) {
    return notFound()
  }

  // Fetch initial summary
  const { data: rawSummary } = await (supabase.from('event_summary') as any)
    .select('*')
    .eq('event_id', eventId)
    .single()

  const summary = rawSummary as any

  // Count total tokens for 'No Reply' calculation
  const { count: totalTokens } = await supabase
    .from('guest_tokens')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  // Fetch recent RSVPs (initial load)
  const { data: rawRsvps } = await (supabase.from('rsvps') as any)
    .select(`
      id,
      attending,
      guest_count,
      food_preference,
      is_manual,
      submitted_at,
      token:guest_tokens(id, family_name, phone)
    `)
    .eq('event_id', eventId)
    .order('submitted_at', { ascending: false })
    .limit(20)

  // Remap data to a flattened structure
  const initialGuests = (rawRsvps || []).map((rsvp: any) => ({
    id: rsvp.id,
    attending: rsvp.attending,
    guest_count: rsvp.guest_count,
    food_preference: rsvp.food_preference,
    is_manual: rsvp.is_manual,
    submitted_at: rsvp.submitted_at,
    family_name: rsvp.token?.family_name || 'Anonymous',
    phone: rsvp.token?.phone || null,
  }))

  const initialSummary = {
    ...summary,
    totalTokens: totalTokens || 0
  }

  return (
    <div className="min-h-screen bg-ivory font-body text-ink pb-24">
      <DashboardClient 
        event={event} 
        initialSummary={initialSummary} 
        initialGuests={initialGuests} 
        eventId={eventId}
      />
    </div>
  )
}
