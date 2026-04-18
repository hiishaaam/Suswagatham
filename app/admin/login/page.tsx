import { redirect } from 'next/navigation'

/**
 * Legacy admin login page — redirects to the unified /login page.
 * The old cookie-based admin auth has been replaced by Supabase Email/Password auth.
 */
export default function AdminLogin() {
  redirect('/login')
}
