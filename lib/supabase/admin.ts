import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Use this ONLY in server environments (API routes, Server Components)
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
