import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    
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
