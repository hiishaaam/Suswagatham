import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { verifyDashboardAuth } from '@/lib/supabase/auth-verify'

import { Suspense } from 'react'

type Props = {
  params: Promise<{ eventId: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { eventId } = await params
  
  // Auth Check
  const auth = await verifyDashboardAuth(eventId)
  if (!auth.authorized) {
    if (auth.status === 401) redirect(`/dashboard/login?redirect=/dashboard/${eventId}`)
    return <div className="p-10 text-center font-display text-2xl text-error">Access Denied: {auth.error}</div>
  }

  const supabase = createAdminClient()

  const [
    { data: rawEvent, error },
    { data: rawSummary },
    { count: totalTokens },
    { data: rawRsvps },
    { data: rawShagun }
  ] = await Promise.all([
    supabase.from('events').select('id, couple_names, event_date, status, event_slug, requires_qr_checkin, accept_shagun').eq('id', eventId).single(),
    (supabase.from('event_summary') as any).select('*').eq('event_id', eventId).single(),
    supabase.from('guest_tokens').select('*', { count: 'exact', head: true }).eq('event_id', eventId),
    (supabase.from('rsvps') as any)
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
      .limit(20),
    (supabase.from('shagun_payments') as any)
      .select('id, guest_name, amount, status, created_at')
      .eq('event_id', eventId)
      .eq('status', 'success')
      .order('created_at', { ascending: false })
  ])

  if (error || !rawEvent) {
    return notFound()
  }

  const event = rawEvent as any
  const summary = rawSummary as any
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

  const shagunData = {
    total: (rawShagun || []).reduce((sum: number, s: any) => sum + (s.amount || 0), 0),
    transactions: (rawShagun || []).map((s: any) => ({
      id: s.id,
      guest_name: s.guest_name || 'Anonymous',
      amount: s.amount,
      created_at: s.created_at,
    }))
  }

  return (
    <div className="min-h-screen bg-ivory font-body text-ink pb-24">
      <DashboardClient 
        event={event} 
        initialSummary={initialSummary} 
        initialGuests={initialGuests} 
        eventId={eventId}
        userPhone={auth.phone || ''}
        shagunData={event.accept_shagun ? shagunData : null}
      />
    </div>
  )
}
