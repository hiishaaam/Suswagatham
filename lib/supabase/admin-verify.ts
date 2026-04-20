import { createClient } from './server'


/**
 * Verifies that the request comes from an authenticated Supabase user.
 * Returns the user object on success.
 * 
 * Used by ALL /api/admin/* routes.
 * Regular users get scoped access via RLS; admin gets full access.
 */
export async function verifyAuth(): Promise<{
  authorized: boolean
  user: { id: string; email: string; isAdmin: boolean } | null
  error: string | null
  status: number
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        authorized: false,
        user: null,
        error: 'Unauthorized — please log in',
        status: 401,
      }
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email || '',
        isAdmin: (user.app_metadata as any)?.is_admin === true,
      },
      error: null,
      status: 200,
    }
  } catch {
    return {
      authorized: false,
      user: null,
      error: 'Failed to verify authentication',
      status: 500,
    }
  }
}

/**
 * Legacy alias — kept for backward compatibility with existing route guards.
 * Now delegates to the real Supabase session check.
 */
export async function verifyAdminAuth() {
  return verifyAuth()
}
