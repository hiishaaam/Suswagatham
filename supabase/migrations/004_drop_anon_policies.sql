-- Drop insecure anon policies that leaked data as part of Phase 2 Fix.
DROP POLICY IF EXISTS "events_anon_read_scope" ON public.events;
DROP POLICY IF EXISTS "rsvps_anon_read_scope" ON public.rsvps;
DROP POLICY IF EXISTS "rsvps_anon_update" ON public.rsvps;
DROP POLICY IF EXISTS "rsvps_anon_insert" ON public.rsvps;

-- Fix the event_summary view to use security_invoker if possible
DROP VIEW IF EXISTS public.event_summary;
CREATE VIEW public.event_summary 
WITH (security_invoker = true) AS
SELECT 
  e.id AS event_id,
  (SELECT count(*) FROM link_clicks lc WHERE lc.event_id = e.id) AS total_clicks,
  (SELECT count(*) FROM rsvps r WHERE r.event_id = e.id) AS total_responded,
  (SELECT count(*) FROM rsvps r WHERE r.event_id = e.id AND r.attending = true) AS attending_count,
  (SELECT count(*) FROM rsvps r WHERE r.event_id = e.id AND r.attending = false) AS not_attending_count,
  (SELECT COALESCE(sum(r.guest_count), 0) FROM rsvps r WHERE r.event_id = e.id AND r.attending = true) AS total_headcount,
  (SELECT COALESCE(sum(r.guest_count), 0) FROM rsvps r WHERE r.event_id = e.id AND r.food_preference = 'veg' AND r.attending = true) AS veg_count,
  (SELECT COALESCE(sum(r.guest_count), 0) FROM rsvps r WHERE r.event_id = e.id AND r.food_preference = 'non_veg' AND r.attending = true) AS non_veg_count
FROM events e;
ALTER TABLE public.guest_tokens ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days');
