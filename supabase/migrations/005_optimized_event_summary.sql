DROP VIEW IF EXISTS public.event_summary;

CREATE VIEW public.event_summary 
WITH (security_invoker = true) AS
SELECT
  e.id AS event_id,
  COUNT(DISTINCT lc.id) AS total_clicks,
  COUNT(DISTINCT r.id) FILTER (WHERE r.id IS NOT NULL) AS total_responded,
  COUNT(DISTINCT r.id) FILTER (WHERE r.attending = true) AS attending_count,
  COUNT(DISTINCT r.id) FILTER (WHERE r.attending = false) AS not_attending_count,
  COALESCE(SUM(r.guest_count) FILTER (WHERE r.attending = true), 0) AS total_headcount,
  COALESCE(SUM(r.guest_count) FILTER (WHERE r.attending = true AND r.food_preference = 'veg'), 0) AS veg_count,
  COALESCE(SUM(r.guest_count) FILTER (WHERE r.attending = true AND r.food_preference = 'non_veg'), 0) AS non_veg_count
FROM events e
LEFT JOIN link_clicks lc ON lc.event_id = e.id
LEFT JOIN rsvps r ON r.event_id = e.id
GROUP BY e.id;
