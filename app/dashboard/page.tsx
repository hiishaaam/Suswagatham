import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardIndex() {
  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) {
    redirect('/dashboard/login')
  }

  const supabase = await createClient()

  const userPhone = user.phone || null
  const userEmail = user.email || null

  // 1. Check if they own any events directly (via user_id)
  if (user.id) {
    const { data: ownedEvent, error: error_owned } = await supabase
      .from('events')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single()
      
    if (ownedEvent && ownedEvent.id) {
      redirect(`/dashboard/${ownedEvent.id}`)
    }
  }

  // 2. Check if they are configured as a client for any events (via Phone)
  if (userPhone) {
    const normalize = (p: string) => p.replace(/^\+91/, '').replace(/\D/g, '')
    const normalizedUserPhone = normalize(userPhone)

    // This query is slightly tricky because we need to find events matching the client phone.
    // clients table has phone, and belongs to user_id. events table has user_id.
    // But Suswagatham seems to use clients.phone. 
    // Let's do a direct join approach:
    const { data: clientEvent } = await supabase
      .from('clients')
      .select('event_id, phone')
      .ilike('phone', `%${normalizedUserPhone}%`) 
      .limit(1)
      .single()

    if (clientEvent && clientEvent.event_id) {
      redirect(`/dashboard/${clientEvent.event_id}`)
    }

    // Alternative exact match check
    const { data: allClients } = await supabase
      .from('clients')
      .select('event_id, phone')

    const matchedClient = allClients?.find(c => {
      if (!c.phone) return false
      return normalize(c.phone) === normalizedUserPhone
    })

    if (matchedClient && matchedClient.event_id) {
      redirect(`/dashboard/${matchedClient.event_id}`)
    }
  }

  // If no events found, maybe they don't have any events yet.
  // We'll show a friendly message instead of a 404.
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border border-gold/20">
        <h1 className="font-display text-2xl text-ink font-bold mb-4">No Events Found</h1>
        <p className="text-muted text-sm mb-6">
          We couldn&apos;t find any wedding events associated with your account ({userEmail || userPhone}).
        </p>
        <p className="text-muted text-sm">
          If you believe this is an error, please contact your event administrator or support.
        </p>
      </div>
    </div>
  )
}
