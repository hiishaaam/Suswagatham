import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'

export async function POST(req: Request) {
  try {
    const { eventId, amount: rawAmount, guestName } = await req.json()

    // Strict validation: positive integer, capped at ₹5,00,000
    const amount = Math.floor(Number(rawAmount))
    if (!eventId || !amount || !Number.isInteger(amount) || amount < 1 || amount > 500000) {
      return NextResponse.json({ success: false, error: 'Valid eventId and amount (₹1 – ₹5,00,000) are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the event exists and has shagun enabled
    const { data: rawEvent, error: fetchErr } = await supabase
      .from('events')
      .select('id, couple_names, accept_shagun')
      .eq('id', eventId)
      .single()

    const event = rawEvent as any
    if (fetchErr || !event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })
    }

    if (!event.accept_shagun) {
      return NextResponse.json({ success: false, error: 'Digital Shagun is not enabled for this event' }, { status: 400 })
    }

    // Create Razorpay order (amount in paise)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR to paise
      currency: 'INR',
      receipt: `shagun_${eventId.slice(0, 8)}_${Date.now()}`,
      notes: {
        event_id: eventId,
        guest_name: guestName || 'Anonymous',
        type: 'shagun',
      },
    })

    // Insert pending record
    const { error: insertErr } = await (supabase.from('shagun_payments') as any)
      .insert({
        event_id: eventId,
        guest_name: guestName || null,
        amount: amount,
        razorpay_order_id: order.id,
        status: 'pending',
      })

    if (insertErr) {
      console.error('Shagun insert error:', insertErr)
      // Don't fail — the order is already created at Razorpay
    }

    return NextResponse.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    console.error('Shagun Create Order Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
