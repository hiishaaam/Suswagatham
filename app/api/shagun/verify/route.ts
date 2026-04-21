import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 })
    }

    // Verify signature using HMAC SHA256
    const payload = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(payload)
      .digest('hex')

    const sigBuffer = Buffer.from(razorpay_signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      // Update status to failed
      const supabase = await createClient()
      await (supabase.from('shagun_payments') as any)
        .update({ status: 'failed' })
        .eq('razorpay_order_id', razorpay_order_id)

      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }

    // Signature valid — mark as success
    const supabase = await createClient()
    const { error: updateErr } = await (supabase.from('shagun_payments') as any)
      .update({
        status: 'success',
        razorpay_payment_id,
      })
      .eq('razorpay_order_id', razorpay_order_id)

    if (updateErr) {
      console.error('Shagun verify update error:', updateErr)
      return NextResponse.json({ success: false, error: 'Failed to update payment record' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Shagun verified successfully!' })
  } catch (err: any) {
    console.error('Shagun Verify Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
