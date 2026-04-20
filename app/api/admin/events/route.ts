import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const body = await req.json()
    const supabase = await createClient()

    let client_id = body.client_id
    // If it's a new client, we insert them first
    if (!client_id && body.new_client_name && body.new_client_phone) {
      const { data: newClient, error: clientErr } = await (supabase.from('clients') as any)
        .insert({
          name: body.new_client_name,
          phone: body.new_client_phone,
          user_id: auth.user.id,
        })
        .select()
        .single()

      if (clientErr) throw clientErr
      client_id = newClient.id
    }

    const { data: event, error: eventErr } = await (supabase.from('events') as any)
      .insert({
        client_id,
        user_id: auth.user.id,
        couple_names: body.couple_names,
        event_slug: body.event_slug,
        event_date: body.event_date,
        venue_name: body.venue_name,
        venue_lat: body.venue_lat || null,
        venue_lng: body.venue_lng || null,
        venue_address: body.venue_address,
        venue_parking_notes: body.venue_parking_notes,
        host_whatsapp: body.host_whatsapp,
        show_host_contact: body.show_host_contact ?? true,
        status: 'draft',
        template_id: body.template_id || 'ivory-luxe',
        custom_theme_data: body.custom_theme_data || null,
        language: body.language || 'english',
        couple_photo_url: body.couple_photo_url,
        invitation_text_en: body.invitation_text_en,
        invitation_text_ml: body.invitation_text_ml,
        max_guests_default: body.max_guests_default || 6,
        rsvp_cutoff_at: body.rsvp_cutoff_at || null,
      })
      .select()
      .single()

    if (eventErr) throw eventErr

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    // Session-scoped client: RLS will automatically filter by user_id
    // Admin users see all events via is_admin() in the RLS policy
    const supabase = await createClient()
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ success: true, events: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
