import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'

export async function POST(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { eventId: id } = await params
    const supabase = await createClient()

    // Get current status — RLS enforces ownership
    const { data: rawEvent, error: fetchErr } = await supabase
      .from('events')
      .select('status')
      .eq('id', id)
      .single()

    const event = rawEvent as any
    if (fetchErr || !event) throw new Error('Event not found')

    const newStatus = event.status === 'live' ? 'completed' : 'live'

    const { error: updateErr } = await (supabase.from('events') as any)
      .update({ status: newStatus })
      .eq('id', id)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
