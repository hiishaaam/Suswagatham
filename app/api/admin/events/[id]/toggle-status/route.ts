import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { requireAdminCookie } from '@/lib/supabase/auth-guard'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdminCookie(req)
    if (authError) return authError

    const { id } = await params
    const supabase = createAdminClient()

    // Get current status
    const { data: rawEvent, error: fetchErr } = await supabase
      .from('events')
      .select('status')
      .eq('id', id)
      .single()

    const event = rawEvent as any
    if (fetchErr || !event) throw new Error('Event not found')

    const newStatus = event.status === 'live' ? 'draft' : 'live'

    const { error: updateErr } = await (supabase.from('events') as any)
      .update({ status: newStatus })
      .eq('id', id)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
