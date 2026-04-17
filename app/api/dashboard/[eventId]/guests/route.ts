import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const { searchParams } = new URL(req.url)
    
    // pagination parameters
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createAdminClient()

    const { data: rawRsvps, error } = await (supabase.from('rsvps') as any)
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
      .range(offset, offset + limit - 1)

    if (error) throw error

    const guests = (rawRsvps || []).map((rsvp: any) => ({
      id: rsvp.id,
      attending: rsvp.attending,
      guest_count: rsvp.guest_count,
      food_preference: rsvp.food_preference,
      is_manual: rsvp.is_manual,
      submitted_at: rsvp.submitted_at,
      family_name: rsvp.token?.family_name || 'Anonymous',
      phone: rsvp.token?.phone || null,
    }))

    return NextResponse.json({ success: true, guests })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
