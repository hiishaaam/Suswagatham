import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email/send'
import { paymentReceiptEmail, eventLiveEmail } from '@/lib/email/templates'

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, event_id } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !event_id) {
      return NextResponse.json({ success: false, error: 'Missing payment verification fields' }, { status: 400 })
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      // Mark the event as failed payment
      const supabase = await createClient()
      await (supabase.from('events') as any)
        .update({ payment_status: 'failed' })
        .eq('id', event_id)

      return NextResponse.json({ success: false, error: 'Payment verification failed — invalid signature' }, { status: 400 })
    }

    // Signature is valid — mark event as paid and go live
    const supabase = await createClient()

    // Fetch full event details for the email
    const { data: rawEvent } = await supabase
      .from('events')
      .select('couple_names, template_id, event_slug, event_date')
      .eq('id', event_id)
      .single()
    const eventData = rawEvent as any

    const { error: updateErr } = await (supabase.from('events') as any)
      .update({
        payment_status: 'paid',
        razorpay_payment_id,
        amount_paid: 200000, // paisa
        status: 'live',
      })
      .eq('id', event_id)

    if (updateErr) throw updateErr

    // Send emails (fire-and-forget — don't block the response)
    if (auth.user.email && eventData) {
      const templateName = eventData.template_id?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Premium'
      const receipt = paymentReceiptEmail(eventData.couple_names, '₹2,000', templateName, eventData.event_slug)
      sendEmail({ to: auth.user.email, subject: receipt.subject, html: receipt.html }).catch(() => {})

      const liveEmail = eventLiveEmail(eventData.couple_names, eventData.event_slug, eventData.event_date)
      sendEmail({ to: auth.user.email, subject: liveEmail.subject, html: liveEmail.html }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified. Event is now LIVE!',
    })
  } catch (err: any) {
    console.error('Razorpay Verify Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
