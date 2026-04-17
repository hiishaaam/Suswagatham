import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
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
