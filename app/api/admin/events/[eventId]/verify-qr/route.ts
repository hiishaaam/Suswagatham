import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'

export async function POST(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { eventId } = await params
    const body = await req.json()
    const unique_token = body?.unique_token

    // Guard: reject missing, empty, or non-string tokens before hitting the DB
    if (!unique_token || typeof unique_token !== 'string' || unique_token.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or missing QR token' }, { status: 400 })
    }

    const supabase = await createClient()

    // Call Supabase RPC
    // @ts-ignore: verify_qr_checkin is added via migration 007 and types might not be generated yet
    const { data: result, error } = await supabase.rpc('verify_qr_checkin', {
      p_token: unique_token,
      p_event_id: eventId
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ success: false, error: 'Database check failed' }, { status: 500 })
    }

    const resultObj = result as any;

    if (resultObj.status === 'error') {
      return NextResponse.json({ success: false, error: resultObj.message })
    }

    if (resultObj.status === 'warning') {
       return NextResponse.json({ success: false, error: `${resultObj.message} - ${resultObj.family_name} (${resultObj.guest_count} guests)` })
    }

    return NextResponse.json({ success: true, guest: resultObj })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
