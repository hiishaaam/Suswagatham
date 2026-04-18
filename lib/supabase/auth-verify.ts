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
  if (!user || !user.phone) {
    return { authorized: false, error: 'Unauthorized', status: 401, phone: null }
  }

  const supabase = await createClient()
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
    return { authorized: false, error: 'Event not found', status: 404, phone: user.phone }
  }

  // Type assertion since postgrest-js might map clients to an array or object depending on relationship
  const clientData = Array.isArray(event.clients) ? event.clients[0] : event.clients
  
  if (!clientData || clientData.phone !== user.phone) {
    return { authorized: false, error: 'Forbidden. Phone mismatch.', status: 403, phone: user.phone }
  }

  return { authorized: true, error: null, status: 200, phone: user.phone }
}
