-- ============================================================
-- WeddWise Migration 002: Payment columns on events table
-- ============================================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  ADD COLUMN IF NOT EXISTS razorpay_order_id text,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
  ADD COLUMN IF NOT EXISTS amount_paid integer DEFAULT 0;

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS idx_events_razorpay_order ON public.events(razorpay_order_id);
