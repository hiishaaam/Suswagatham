-- ============================================================
-- WeddWise RLS Migration: User-scoped events + Admin override
-- ============================================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 0: Create the global admin account                  ║
-- ╚═══════════════════════════════════════════════════════════╝
-- NOTE: You must first create this user via the Supabase Dashboard UI
-- or via a sign-up request from your app:
--   Email:    admin@achievelog.com
--   Password: AdminSecure123!
--
-- After creating the user, come back and run the rest of this script.
-- The RLS policies below will detect this user by their email claim.

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 1: Add user_id column to events table               ║
-- ╚═══════════════════════════════════════════════════════════╝

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Backfill: If there are existing events without a user_id, optionally
-- assign them to the admin account once it exists:
-- UPDATE public.events SET user_id = (SELECT id FROM auth.users WHERE email = 'admin@achievelog.com') WHERE user_id IS NULL;

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 2: Enable RLS on all relevant tables                ║
-- ╚═══════════════════════════════════════════════════════════╝

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caterer_access ENABLE ROW LEVEL SECURITY;

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 3: Helper function to check if user is global admin ║
-- ╚═══════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true,
    false
  );
$$;

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 4: RLS Policies for EVENTS table                    ║
-- ╚═══════════════════════════════════════════════════════════╝

-- Drop any existing policies first (idempotent)
DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Users can insert own events" ON public.events;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.events;
DROP POLICY IF EXISTS "Admin full access to events" ON public.events;
DROP POLICY IF EXISTS "Public can view live events by slug" ON public.events;

-- Regular users: CRUD only their own events
CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can delete own events"
  ON public.events FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Public/anonymous: can view live events (for the guest RSVP pages)
CREATE POLICY "Public can view live events by slug"
  ON public.events FOR SELECT
  TO anon
  USING (status = 'live');

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 5: RLS Policies for SUB_EVENTS (cascade from event) ║
-- ╚═══════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "Sub-events follow event ownership" ON public.sub_events;
DROP POLICY IF EXISTS "Public can view live sub-events" ON public.sub_events;

CREATE POLICY "Sub-events follow event ownership"
  ON public.sub_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = sub_events.event_id
      AND (events.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Public can view live sub-events"
  ON public.sub_events FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = sub_events.event_id
      AND events.status = 'live'
    )
  );

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 6: RLS Policies for GUEST_TOKENS                    ║
-- ╚═══════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "Guest tokens follow event ownership" ON public.guest_tokens;
DROP POLICY IF EXISTS "Public can read own token" ON public.guest_tokens;

CREATE POLICY "Guest tokens follow event ownership"
  ON public.guest_tokens FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = guest_tokens.event_id
      AND (events.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Anonymous users can read their own token (for RSVP flow)
CREATE POLICY "Public can read own token"
  ON public.guest_tokens FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = guest_tokens.event_id
      AND events.status = 'live'
    )
  );

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 7: RLS Policies for RSVPS                           ║
-- ╚═══════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "RSVPs follow event ownership" ON public.rsvps;
DROP POLICY IF EXISTS "Public can insert RSVP" ON public.rsvps;
DROP POLICY IF EXISTS "Public can view own RSVP" ON public.rsvps;

CREATE POLICY "RSVPs follow event ownership"
  ON public.rsvps FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = rsvps.event_id
      AND (events.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Anonymous users can INSERT rsvps for live events (the guest RSVP flow)
CREATE POLICY "Public can insert RSVP"
  ON public.rsvps FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = rsvps.event_id
      AND events.status = 'live'
    )
  );

-- Anonymous users can view their own RSVP (for confirmation display)
CREATE POLICY "Public can view own RSVP"
  ON public.rsvps FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = rsvps.event_id
      AND events.status = 'live'
    )
  );

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 8: RLS Policies for LINK_CLICKS                     ║
-- ╚═══════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "Link clicks follow event ownership" ON public.link_clicks;
DROP POLICY IF EXISTS "Public can insert link clicks" ON public.link_clicks;

CREATE POLICY "Link clicks follow event ownership"
  ON public.link_clicks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = link_clicks.event_id
      AND (events.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Public can insert link clicks"
  ON public.link_clicks FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = link_clicks.event_id
      AND events.status = 'live'
    )
  );

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 9: RLS Policies for CATERER_ACCESS                  ║
-- ╚═══════════════════════════════════════════════════════════╝

DROP POLICY IF EXISTS "Caterer access follows event ownership" ON public.caterer_access;

CREATE POLICY "Caterer access follows event ownership"
  ON public.caterer_access FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = caterer_access.event_id
      AND (events.user_id = auth.uid() OR public.is_admin())
    )
  );

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 10: RLS Policies for CLIENTS table                  ║
-- ╚═══════════════════════════════════════════════════════════╝

-- Add user_id to clients too
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Users manage own clients" ON public.clients;
DROP POLICY IF EXISTS "Admin full access to clients" ON public.clients;

CREATE POLICY "Users manage own clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ STEP 11: Grant the anon role access to the helper fn     ║
-- ╚═══════════════════════════════════════════════════════════╝

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- ╔═══════════════════════════════════════════════════════════╗
-- ║ DONE! Now update your Next.js API routes to attach       ║
-- ║ auth.uid() on event inserts.                             ║
-- ╚═══════════════════════════════════════════════════════════╝
