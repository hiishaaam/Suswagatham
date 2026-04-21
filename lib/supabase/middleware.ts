import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()
  
  const path = request.nextUrl.pathname

  // Protected routes: require Supabase session
  // /admin (except /admin/login which we keep for legacy), /dashboard
  const isProtectedRoute = (
    (path.startsWith('/admin') && !path.startsWith('/admin/login'))
    || (path.startsWith('/dashboard') && !path.startsWith('/dashboard/login'))
    || (path.startsWith('/api/admin') && !path.startsWith('/api/admin/login'))
  )

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is logged in and visits login pages, redirect them to their respective destinations
  if (user && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  if (user && path === '/dashboard/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
