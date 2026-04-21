-- 009_razorpay_shagun.sql
-- Opt-in Digital Shagun: guests can send cash gifts processed via Razorpay.

-- 1. Add opt-in flag to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS accept_shagun BOOLEAN DEFAULT false;

-- 2. Create shagun_payments ledger
CREATE TABLE IF NOT EXISTS shagun_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_name TEXT,
  amount INTEGER NOT NULL,                    -- stored in INR (rupees, not paise)
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',     -- pending | success | failed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_shagun_event_status ON shagun_payments(event_id, status);

-- 3. RLS policies
ALTER TABLE shagun_payments ENABLE ROW LEVEL SECURITY;

-- Public guests can create pending orders (the guest-facing payment initiation)
CREATE POLICY "Anyone can insert shagun" ON shagun_payments
  FOR INSERT WITH CHECK (true);

-- Anyone can update (needed for status -> success after verify)
CREATE POLICY "Service can update shagun" ON shagun_payments
  FOR UPDATE USING (true);

-- Authenticated users (host/admin) can view shagun for their events
CREATE POLICY "Hosts can view shagun" ON shagun_payments
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  );
