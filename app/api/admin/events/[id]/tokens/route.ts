import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: tokens, error } = await supabase
      .from('guest_tokens')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Fetch rsvps to see statuses
    const { data: rsvps } = await (supabase.from('rsvps') as any)
      .select('token_id, attending')
      .eq('event_id', id)

    const rsvpsByToken = (rsvps || []).reduce((acc: any, curr: any) => {
      acc[curr.token_id] = curr
      return acc
    }, {})

    const enriched = tokens.map(t => ({
      ...(t as any),
      rsvp_status: rsvpsByToken[(t as any).id] ? (rsvpsByToken[(t as any).id].attending ? 'Attending' : 'Not Attending') : 'Pending'
    }))

    return NextResponse.json({ success: true, tokens: enriched })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const supabase = createAdminClient()

    // Support single or array
    const toInsert = Array.isArray(body) 
      ? body.map(t => ({ ...t, event_id: id }))
      : [{ ...body, event_id: id }]

    const { data, error } = await (supabase.from('guest_tokens') as any)
      .insert(toInsert)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, tokens: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
