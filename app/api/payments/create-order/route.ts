import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/supabase/admin-verify'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Template price map (in paisa — 100 paisa = ₹1)
const TEMPLATE_PRICES: Record<string, number> = {
  'emerald-islamic': 200000,   // ₹2,000
  'ivory-luxe': 200000,        // ₹2,000
  'amethyst-dream': 200000,    // ₹2,000
  'warm-rustic': 200000,       // ₹2,000
  'ivory-garden': 200000,      // ₹2,000
}
const DEFAULT_PRICE = 200000 // ₹2,000

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const { event_id } = await req.json()
    if (!event_id) {
      return NextResponse.json({ success: false, error: 'event_id is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch the event (RLS ensures ownership)
    const { data: rawEvent, error: fetchErr } = await supabase
      .from('events')
      .select('id, couple_names, template_id, payment_status, razorpay_order_id')
      .eq('id', event_id)
      .single()

    const event = rawEvent as any
    if (fetchErr || !event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })
    }

    // If already paid, no new order needed
    if (event.payment_status === 'paid') {
      return NextResponse.json({ success: false, error: 'Event is already paid' }, { status: 400 })
    }

    // If there's an existing unpaid order, return it (avoid duplicate orders)
    if (event.razorpay_order_id) {
      try {
        const existingOrder = await razorpay.orders.fetch(event.razorpay_order_id)
        if (existingOrder.status === 'created') {
          return NextResponse.json({
            success: true,
            order: existingOrder,
            key_id: process.env.RAZORPAY_KEY_ID,
          })
        }
      } catch {
        // Order expired or invalid — create a new one
      }
    }

    const amount = TEMPLATE_PRICES[event.template_id] || DEFAULT_PRICE

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `ww_${event_id.slice(0, 8)}`,
      notes: {
        event_id,
        couple_names: event.couple_names,
        user_id: auth.user.id,
      },
    })

    // Store the order ID on the event
    await (supabase.from('events') as any)
      .update({ razorpay_order_id: order.id })
      .eq('id', event_id)

    return NextResponse.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    console.error('Razorpay Create Order Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
