import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const proxy = (request: NextRequest) => {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin') && !path.startsWith('/admin/login') && !path.startsWith('/api/admin/login')) {
    const adminCookie = request.cookies.get('ADMIN_SECRET_COOKIE')
    if (!adminCookie || adminCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export default proxy;

export const config = {
  matcher: ['/admin/:path*'],
}
