import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GuestPage from './GuestPage'
import { headers } from 'next/headers'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawData } = await supabase
    .from('events')
    .select('couple_names, couple_photo_url, event_date, venue_name')
    .eq('event_slug', slug)
    .single()

  const data = rawData as any

  if (!data) return { title: 'Event Not Found' }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/og/${slug}`
  const eventDate = data.event_date ? new Date(data.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

  return {
    title: `You're Invited — ${data.couple_names}`,
    description: `Join us for the wedding celebration of ${data.couple_names}${eventDate ? ` on ${eventDate}` : ''}${data.venue_name ? ` at ${data.venue_name}` : ''}. RSVP now!`,
    openGraph: {
      title: `You're Invited — ${data.couple_names}`,
      description: `Wedding celebration${eventDate ? ` · ${eventDate}` : ''}${data.venue_name ? ` · ${data.venue_name}` : ''}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${data.couple_names} Wedding Invitation` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `You're Invited — ${data.couple_names}`,
      images: [ogImageUrl],
    },
  }
}

export default async function EventPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { t: tokenStr } = await searchParams
  
  const supabase = await createClient()

  // Fetch LIVE Event
  const { data: rawEvent } = await supabase
    .from('events')
    .select('*')
    .eq('event_slug', slug)
    .eq('status', 'live')
    .single()

  const event = rawEvent as any

  if (!event) {
    return notFound()
  }

  let guestToken = null
  let existingRsvp = null

  // Process Token if provided
  if (tokenStr) {
    const { data: rawTokenData } = await supabase
      .from('guest_tokens')
      .select('*')
      .eq('unique_token', tokenStr)
      .eq('event_id', event.id)
      .single()

    const tokenData = rawTokenData as any

    if (tokenData) {
      guestToken = tokenData
      const { data: rsvpData } = await (supabase.from('rsvps') as any)
        .select('*')
        .eq('token_id', guestToken.id)
        .single()
        
      if (rsvpData) existingRsvp = rsvpData
    }
  }

  // Track Link Click
  try {
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 'desktop'

    await (supabase.from('link_clicks') as any).insert({
      event_id: event.id,
      token_id: guestToken?.id || null,
      device_type: deviceType,
      user_agent: userAgent,
    })
  } catch (err) {
    // Failsafe tracking, do not throw
    console.error('Click Tracking Error:', err)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${event.couple_names} Wedding Celebration`,
    startDate: event.event_date ? new Date(event.event_date).toISOString() : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue_name || 'Wedding Venue',
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue_address || 'Address provided upon RSVP',
      }
    },
    image: event.couple_photo_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/og/${slug}`,
    description: `You are invited to celebration of ${event.couple_names}`,
  };

  return (
    <div className="min-h-screen bg-ivory font-body text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuestPage 
        event={event} 
        guestToken={guestToken} 
        existingRsvp={existingRsvp} 
        tokenStr={tokenStr}
      />
    </div>
  )
}

