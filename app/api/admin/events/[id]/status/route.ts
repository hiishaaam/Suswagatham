import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { requireAdminCookie } from '@/lib/supabase/auth-guard'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdminCookie(req)
    if (authError) return authError

    const { id } = await params
    const { status } = await req.json()
    const supabase = createAdminClient()

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
