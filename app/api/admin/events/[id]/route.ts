import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

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
    const { id } = await params
    const body = await req.json()
    const supabase = createAdminClient()

    // remove undefined/id/created_at fields before update
    const { id: _, created_at, ...updates } = body

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
