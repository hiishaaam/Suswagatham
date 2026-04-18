import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { requireAdminCookie } from '@/lib/supabase/auth-guard'

export async function GET(req: Request) {
  const authError = await requireAdminCookie(req)
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) return NextResponse.json({ available: false })

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
