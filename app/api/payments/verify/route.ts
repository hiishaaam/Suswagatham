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

    // Fetch existing event to check idempotency and ownership
    const supabase = await createClient()
    const { data: rawEvent, error: fetchErr } = await (supabase.from('events') as any)
      .select('user_id, payment_status, razorpay_payment_id, couple_names, template_id, event_slug, event_date')
      .eq('id', event_id)
      .single()
      
    if (fetchErr || !rawEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })
    }
    
    // Auth validation check: event user must match current authenticated user unless admin
    if (rawEvent.user_id !== auth.user.id && !auth.user.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized to modify this event' }, { status: 403 })
    }

    // Idempotency check
    if (rawEvent.payment_status === 'paid') {
      return NextResponse.json({ 
        success: true, 
        message: 'Already processed' 
      })
    }

    // Verify signature using HMAC SHA256 and timingSafeEqual
    const payloadBody = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(payloadBody)
      .digest('hex')

    const sigBuffer = Buffer.from(razorpay_signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      // Mark the event as failed payment
      await (supabase.from('events') as any)
        .update({ payment_status: 'failed' })
        .eq('id', event_id)

      return NextResponse.json({ success: false, error: 'Payment verification failed — invalid signature' }, { status: 400 })
    }

    // Signature is valid — mark event as paid and go live
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
