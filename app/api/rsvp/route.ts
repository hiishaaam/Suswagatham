import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
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

    if (token) {
      const { data: guestToken } = await supabase
        .from('guest_tokens')
        .select('*')
        .eq('unique_token', token)
        .eq('event_id', event_id)
        .single() // auto-typed by Supabase depending on generated types, but sometimes falls back to 'never' if types.ts isn't perfectly mapped to the query. 
        // We'll safely type it.

      if (!guestToken) {
        return NextResponse.json(
          { success: false, message: 'Invalid invitation token.' },
          { status: 400 }
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
