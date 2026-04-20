import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendRsvpHostNotification } from '@/lib/email/resend'

// RSVP rate limit: 5 submissions per 60 seconds per IP
const RSVP_RATE_LIMIT = { maxRequests: 5, windowMs: 60 * 1000 }

export async function POST(req: Request) {
  try {
    // Rate limit check — runs before any DB work
    const clientIp = getClientIp(req)
    const limit = rateLimit(`rsvp:${clientIp}`, RSVP_RATE_LIMIT)

    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: `Too many RSVP submissions. Please try again in ${limit.retryAfterSeconds} seconds.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(limit.retryAfterSeconds),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(limit.resetAt / 1000)),
          },
        }
      )
    }

    const body = await req.json()
    const { token, event_id, attending, guest_count, food_preference } = body

    const supabase = await createClient()

    // Validate event
    const { data: rawEvent } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .eq('status', 'live')
      .single()

    const event = rawEvent as any

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found or no longer live.' },
        { status: 400 }
      )
    }

    let tokenIdToUse = null
    let guestTokenData: any = null

    if (token) {
      const { data: guestToken } = await supabase
        .from('guest_tokens')
        .select('*')
        .eq('unique_token', token)
        .eq('event_id', event_id)
        .single() // auto-typed by Supabase depending on generated types, but sometimes falls back to 'never' if types.ts isn't perfectly mapped to the query. 
        // We'll safely type it.

      guestTokenData = guestToken

      if (!guestToken) {
        return NextResponse.json(
          { success: false, message: 'Invalid invitation token.' },
          { status: 400 }
        )
      }
      
      const gt = guestToken as any
      if (gt.expires_at && new Date(gt.expires_at) < new Date()) {
        return NextResponse.json(
          { success: false, message: 'This invitation link has expired.' },
          { status: 410 }
        )
      }

      const limit = (guestToken as any).max_guests

      if (attending && guest_count > limit) {
        return NextResponse.json(
          { success: false, message: `Exceeded maximum allowed guests (${limit}).` },
          { status: 400 }
        )
      }
      tokenIdToUse = (guestToken as any).id
    } else {
      if (attending && guest_count > event.max_guests_default) {
        return NextResponse.json(
          { success: false, message: `Exceeded maximum allowed guests (${event.max_guests_default}).` },
          { status: 400 }
        )
      }
      // If open RSVP, dynamically create an anonymous guest_token to uniquely anchor this RSVP
      const { data: newToken, error: tokenErr } = await (supabase.from('guest_tokens') as any)
        .insert({
          event_id: event_id,
          family_name: 'Anonymous Guest (Open Link)',
          max_guests: event.max_guests_default,
        })
        .select()
        .single()

      if (tokenErr || !newToken) {
        throw new Error('Failed to create open guest token')
      }
      tokenIdToUse = newToken.id
    }

    // Upsert RSVP
    const { error: rsvpError } = await (supabase.from('rsvps') as any)
      .upsert(
        {
          token_id: tokenIdToUse,
          event_id: event_id,
          attending,
          guest_count: attending ? guest_count : 0,
          food_preference: attending ? food_preference : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'token_id' }
      )

    if (rsvpError) throw rsvpError

    // Asynchronously lookup Host Email & Fire Resend Notification 
    // We don't await the email to block the guest's UI success rendering
    if (event.user_id) {
      supabase.auth.admin.getUserById(event.user_id).then(userRes => {
         const hostEmail = userRes.data?.user?.email
         if (hostEmail) {
            sendRsvpHostNotification({
              hostEmail,
              coupleNames: event.couple_names,
              guestName: guestTokenData ? guestTokenData.family_name : 'An Open Guest',
              attending,
              guestCount: attending ? guest_count : undefined,
              foodPreference: attending ? food_preference : undefined
            }).catch(e => console.error("Resend error (async):", e))
         }
      }).catch(e => console.error("User lookup for email failed:", e))
    }

    return NextResponse.json({
      success: true,
      attending,
      event: {
        venue_lat: event.venue_lat,
        venue_lng: event.venue_lng,
        venue_address: event.venue_address,
        venue_parking_notes: event.venue_parking_notes,
        host_whatsapp: event.host_whatsapp,
        show_host_contact: event.show_host_contact,
      },
    })
  } catch (err: any) {
    console.error('RSVP API Error:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
