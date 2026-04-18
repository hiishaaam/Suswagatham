import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { requireEventAccess } from '@/lib/supabase/rbac'

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    
    const authError = await requireEventAccess(eventId)
    if (authError) return authError

    const supabase = createAdminClient()

    // Fetch summary
    const { data: summary, error } = await (supabase.from('event_summary') as any)
      .select('*')
      .eq('event_id', eventId)
      .single()

    if (error) throw error

    // Count total tokens 
    const { count: totalTokens } = await supabase
      .from('guest_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    return NextResponse.json({ 
      success: true, 
      summary: { 
        ...summary, 
        totalTokens: totalTokens || 0 
      } 
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
