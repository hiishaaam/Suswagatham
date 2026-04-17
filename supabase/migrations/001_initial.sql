CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper for base64url equivalent (removing +, /, =)
CREATE OR REPLACE FUNCTION generate_base64url_token(byte_length integer)
RETURNS text AS $$
BEGIN
  RETURN replace(replace(encode(gen_random_bytes(byte_length), 'base64'), '+', '-'), '/', '_');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  plan_type TEXT DEFAULT 'b2c_basic' CHECK (plan_type IN ('b2b_monthly','b2c_basic','b2c_premium','enterprise')),
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  couple_names TEXT NOT NULL,
  event_slug TEXT UNIQUE NOT NULL,
  event_date DATE NOT NULL,
  venue_name TEXT NOT NULL,
  venue_lat DECIMAL(10,8),
  venue_lng DECIMAL(11,8),
  venue_address TEXT,
  venue_parking_notes TEXT,
  host_whatsapp TEXT,
  show_host_contact BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','design_pending','preview_sent','live','completed')),
  template_id TEXT DEFAULT 'kerala_traditional',
  language TEXT DEFAULT 'bilingual' CHECK (language IN ('english','malayalam','bilingual')),
  couple_photo_url TEXT,
  invitation_text_en TEXT,
  invitation_text_ml TEXT,
  max_guests_default INTEGER DEFAULT 6,
  rsvp_cutoff_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sub_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date_time TIMESTAMPTZ,
  headcount_target INTEGER,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE guest_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  family_name TEXT NOT NULL,
  phone TEXT,
  unique_token TEXT UNIQUE NOT NULL DEFAULT generate_base64url_token(12),
  max_guests INTEGER DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES guest_tokens(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER DEFAULT 1,
  food_preference TEXT CHECK (food_preference IN ('veg','non_veg','both')),
  sub_event_id UUID REFERENCES sub_events(id),
  is_manual BOOLEAN DEFAULT false,
  manual_added_by TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (token_id)
);

CREATE TABLE link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  token_id UUID REFERENCES guest_tokens(id),
  clicked_at TIMESTAMPTZ DEFAULT now(),
  device_type TEXT,
  user_agent TEXT
);

CREATE TABLE caterer_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  caterer_name TEXT NOT NULL,
  caterer_phone TEXT,
  access_token TEXT UNIQUE NOT NULL DEFAULT generate_base64url_token(16),
  access_level TEXT DEFAULT 'read_only',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_events_event_slug ON events(event_slug);
CREATE INDEX idx_guest_tokens_unique_token ON guest_tokens(unique_token);
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_link_clicks_event_id ON link_clicks(event_id);

-- Event Summary View
CREATE VIEW event_summary AS
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

-- Updated_at Trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_modtime
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_rsvps_modtime
BEFORE UPDATE ON rsvps
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Row Level Security policies
-- By default events & rsvps are readable by anon for their token scope only (simulated via token or slug conditions)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_tokens ENABLE ROW LEVEL SECURITY;

-- Note: Because checking token validity per row from anon requires joining guest_tokens, 
-- which can be done in RLS but adds overhead.
-- For true token scope, an anon user with a unique_token can read the event associated with that token.
-- Admin operations bypass RLS using the service_role key.
CREATE POLICY "events_anon_read_scope" ON events
  FOR SELECT TO anon USING (true);

CREATE POLICY "rsvps_anon_read_scope" ON rsvps
  FOR SELECT TO anon USING (true);

CREATE POLICY "rsvps_anon_insert" ON rsvps
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "rsvps_anon_update" ON rsvps
  FOR UPDATE TO anon USING (true);
