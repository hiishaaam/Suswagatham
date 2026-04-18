import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, phone, password } = body

    // Support both old password check and new Supabase Auth if flag is enabled
    const useSupabaseAuth = process.env.NEXT_PUBLIC_USE_SUPABASE_ADMIN_AUTH !== 'false'

    if (useSupabaseAuth) {
      const supabase = await createClient()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email || undefined,
        phone: phone || undefined,
        password: password
      })

      if (authError || !authData.user) {
        return NextResponse.json({ success: false, error: authError?.message || 'Invalid credentials' }, { status: 401 })
      }

      // Check if user is platform admin
      const supabaseAdmin = createAdminClient()
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('is_platform_admin')
        .eq('id', authData.user.id)
        .single() as any

      if (profileError || !profile?.is_platform_admin) {
        // Sign out if not an admin
        await supabase.auth.signOut()
        return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 })
      }

      return NextResponse.json({ success: true })
    }

    // Backward compatibility for static password
    if (password === (process.env.ADMIN_PASSWORD || 'secret')) {
      const cookieStore = await cookies()
      cookieStore.set('ADMIN_SECRET_COOKIE', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
