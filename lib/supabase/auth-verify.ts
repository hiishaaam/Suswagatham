import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from './server'

export async function verifyDashboardAuth(eventId: string) {
  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // Read-only for verification
      }
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) {
    return { authorized: false, error: 'Unauthorized', status: 401, phone: null }
  }

  // Identify the user — they might have logged in via phone or email
  const userPhone = user.phone || null
  const userEmail = user.email || null

  if (!userPhone && !userEmail) {
    return { authorized: false, error: 'Unauthorized', status: 401, phone: null }
  }

  const supabase = await createClient()

  // Strategy 1: Check if the user owns this event directly (via user_id from Supabase Auth)
  const { data: ownedEvent } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single()

  if (ownedEvent) {
    return { authorized: true, error: null, status: 200, phone: userPhone || userEmail || '' }
  }

  // Strategy 2: Fall back to phone-match against client record
  if (userPhone) {
    const { data: rawEvent, error } = await supabase
      .from('events')
      .select(`
        id,
        clients (
          phone
        )
      `)
      .eq('id', eventId)
      .single()

    const event = rawEvent as any

    if (error || !event) {
      return { authorized: false, error: 'Event not found', status: 404, phone: userPhone }
    }

    const clientData = Array.isArray(event.clients) ? event.clients[0] : event.clients
    
    if (clientData?.phone) {
      const normalize = (p: string) => p.replace(/^\+91/, '').replace(/\D/g, '')
      if (normalize(clientData.phone) === normalize(userPhone)) {
        return { authorized: true, error: null, status: 200, phone: userPhone }
      }
    }
  }

  return { authorized: false, error: 'Access denied. You do not own this event.', status: 403, phone: userPhone || userEmail || '' }
}
