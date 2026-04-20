import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { id } = await params
    const { status } = await req.json()
    const supabase = await createClient()

    const VALID_STATUSES = [
      'draft', 'design_pending', 'preview_sent', 'live', 'completed'
    ] as const
    
    const ALLOWED_TRANSITIONS: Record<string, string[]> = {
      draft:          ['design_pending', 'live'], // Allowing live directly for ease of use in some flows if needed, but per prompt:
      design_pending: ['preview_sent', 'draft'],
      preview_sent:   ['live', 'design_pending'],
      live:           ['completed', 'preview_sent'],
      completed:      [],
    }
    // Update ALLOWED_TRANSITIONS per prompt exact spec:
    ALLOWED_TRANSITIONS.draft = ['design_pending']
    
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' }, 
        { status: 400 }
      )
    }
    
    const { data: current } = await (supabase.from('events') as any)
      .select('status')
      .eq('id', id)
      .single()
    
    if (current && !ALLOWED_TRANSITIONS[current.status as keyof typeof ALLOWED_TRANSITIONS]?.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Cannot transition from ${current.status} to ${status}` },
        { status: 400 }
      )
    }

    const { error: updateErr, data } = await (supabase.from('events') as any)
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true, event: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
