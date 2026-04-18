import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'

export async function GET(req: Request) {
  const auth = await verifyAuth()
  if (!auth.authorized) {
    return NextResponse.json({ available: false, error: auth.error }, { status: auth.status })
  }

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) return NextResponse.json({ available: false })

  // Use admin client for slug check — slugs must be globally unique
  // regardless of who owns the event
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('events')
    .select('id')
    .eq('event_slug', slug)
    .single()

  // if data exists, slug is taken. If error is PGRST116 (0 rows), slug is available.
  const available = !data

  return NextResponse.json({ available })
}
