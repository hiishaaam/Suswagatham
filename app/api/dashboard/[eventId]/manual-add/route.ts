import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const body = await req.json()
    const { family_name, guest_count, food_preference } = body

    const supabase = createAdminClient()

    // 1. Create a guest token
    const { data: token, error: tokenErr } = await (supabase.from('guest_tokens') as any)
      .insert({
        event_id: eventId,
        family_name: family_name,
        max_guests: guest_count,
      })
      .select()
      .single()

    if (tokenErr) throw tokenErr

    // 2. Create the RSVP
    const { data: rsvp, error: rsvpErr } = await (supabase.from('rsvps') as any)
      .insert({
        token_id: token.id,
        event_id: eventId,
        attending: true,
        guest_count: guest_count,
        food_preference: food_preference,
        is_manual: true,
        manual_added_by: 'Host',
      })
      .select()
      .single()

    if (rsvpErr) {
      // attempt rollback
      await supabase.from('guest_tokens').delete().eq('id', token.id)
      throw rsvpErr
    }

    return NextResponse.json({ success: true, rsvp, token })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
