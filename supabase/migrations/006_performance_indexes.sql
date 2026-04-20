-- supabase/migrations/006_performance_indexes.sql
-- Create B-Tree indexes on heavily queried foreign keys to prevent sequential scans

-- RSVPs Table Indexes
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_token_id ON public.rsvps(token_id);

-- Link Clicks Table Indexes
CREATE INDEX IF NOT EXISTS idx_link_clicks_event_id ON public.link_clicks(event_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_token_id ON public.link_clicks(token_id);

-- Guest Tokens Table Indexes
CREATE INDEX IF NOT EXISTS idx_guest_tokens_event_id ON public.guest_tokens(event_id);

-- Sub Events Table Indexes
CREATE INDEX IF NOT EXISTS idx_sub_events_event_id ON public.sub_events(event_id);
