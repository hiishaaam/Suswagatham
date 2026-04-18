import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/send'
import { welcomeEmail } from '@/lib/email/templates'

// Called after successful Supabase signup from the client
export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    if (!email || !name) {
      return NextResponse.json({ success: false, error: 'Missing email or name' }, { status: 400 })
    }

    const template = welcomeEmail(name)
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })

    return NextResponse.json({ success: result.success })
  } catch (err: any) {
    console.error('[Welcome Email Error]', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
