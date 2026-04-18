import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const useSupabaseAuth = process.env.NEXT_PUBLIC_USE_SUPABASE_ADMIN_AUTH !== 'false'
  
  let userData = null

  if (useSupabaseAuth) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // For layout, we'll check platform admin status
      const supabaseAdmin = createAdminClient()
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_platform_admin')
        .eq('id', user.id)
        .single() as any

      if (profile?.is_platform_admin) {
        userData = { email: user.email, phone: user.phone }
      } else {
        // Logged in but not an admin — redirect to login (which should handle 403 or show login)
        // or just sign them out
        await supabase.auth.signOut()
        redirect('/admin/login')
      }
    }
  } else {
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get('ADMIN_SECRET_COOKIE')
    if (adminCookie?.value === 'authenticated') {
      userData = { email: 'Legacy Admin' }
    }
  }

  // If we have a user, show the dashboard layout
  if (userData) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-ivory font-body text-ink overflow-hidden">
        <AdminSidebar user={userData} />
        <main className="flex-1 overflow-y-auto bg-ivory relative">
          {children}
        </main>
      </div>
    )
  }

  // If no user (e.g., login page), just render children
  return <>{children}</>
}
