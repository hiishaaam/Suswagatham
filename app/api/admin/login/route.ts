import { NextResponse } from 'next/server'

/**
 * Legacy admin login route — kept for backward compatibility.
 * The cookie-based admin auth has been replaced by Supabase session auth.
 * All admin routes now use verifyAuth() which checks the Supabase session.
 * 
 * This route simply redirects to /login.
 */
export async function POST(req: Request) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'This endpoint is deprecated. Please use /login with your email and password.' 
    },
    { status: 410 }
  )
}
