import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { id } = await params
    const supabase = await createClient()

    // RLS will ensure user can only see their own events (or all if admin)
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    const { data: summary } = await (supabase.from('event_summary') as any)
      .select('*')
      .eq('event_id', id)
      .single()

    return NextResponse.json({ success: true, event: { ...(event as any), summary } })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { id } = await params
    const body = await req.json()
    const supabase = await createClient()

    // remove non-updatable fields before sending to Supabase
    const { id: _, created_at, updated_at, summary, status, user_id, ...updates } = body

    // RLS will ensure user can only update their own events (or all if admin)
    const { data: event, error } = await (supabase.from('events') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { id } = await params
    const supabase = await createClient()

    // Cascade delete: rsvps → guest_tokens → link_clicks → caterer_access → sub_events → event
    // RLS ensures user can only delete their own events (or admin can delete any)
    await (supabase.from('rsvps') as any).delete().eq('event_id', id)
    await (supabase.from('link_clicks') as any).delete().eq('event_id', id)
    await (supabase.from('caterer_access') as any).delete().eq('event_id', id)
    await (supabase.from('guest_tokens') as any).delete().eq('event_id', id)
    await (supabase.from('sub_events') as any).delete().eq('event_id', id)

    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true, message: 'Event deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
