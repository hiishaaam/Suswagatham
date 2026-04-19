import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient } from './admin'

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

  // Check event's client phone using admin client to bypass RLS if needed,
  // or just regular client if RLS allows it. Admin is safer for explicit checks.
  const supabaseAdmin = createAdminClient()
  const { data: rawEvent, error } = await supabaseAdmin
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
  
  // Normalize both phones to 10-digit format before comparing.
  // Supabase stores phone in E.164 (+91XXXXXXXXXX), clients.phone is 10 digits.
  const normalize = (p: string) => p.replace(/^\+91/, '').replace(/\D/g, '')
  if (!clientData || normalize(clientData.phone) !== normalize(user.phone)) {
    return { authorized: false, error: 'Forbidden. Phone mismatch.', status: 403, phone: user.phone }
  }

  return { authorized: true, error: null, status: 200, phone: user.phone }
}
