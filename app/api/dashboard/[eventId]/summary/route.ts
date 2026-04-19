import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyDashboardAuth } from '@/lib/supabase/auth-verify'

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    
    const auth = await verifyDashboardAuth(eventId)
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const supabase = await createClient()

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
