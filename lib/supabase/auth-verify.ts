import { hasEventAccess } from './rbac'
import { createClient } from './server'

export async function verifyDashboardAuth(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, error: 'Unauthorized', status: 401, phone: null }
  }

  const hasAccess = await hasEventAccess(eventId)
  
  if (!hasAccess) {
    return { authorized: false, error: 'Forbidden. No access to this event.', status: 403, phone: user.phone || user.email }
  }

  return { authorized: true, error: null, status: 200, phone: user.phone || user.email }
}
