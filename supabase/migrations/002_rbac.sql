-- 2.1 Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE,
  full_name TEXT,
  is_platform_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mirror the updated_at trigger pattern from 001_initial.sql
CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 2.2 Client Memberships Table
CREATE TABLE public.client_memberships (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client_owner', 'client_staff')),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, client_id)
);

CREATE INDEX idx_client_memberships_user ON public.client_memberships(user_id);
CREATE INDEX idx_client_memberships_client ON public.client_memberships(client_id);

-- 2.3 Event Memberships Table
CREATE TABLE public.event_memberships (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('event_manager', 'caterer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, event_id)
);

CREATE INDEX idx_event_memberships_user ON public.event_memberships(user_id);
CREATE INDEX idx_event_memberships_event ON public.event_memberships(event_id);

-- 2.4 Tighten RLS Policies
-- Drop the open policies
DROP POLICY IF EXISTS "events_anon_read_scope" ON public.events;
DROP POLICY IF EXISTS "rsvps_anon_read_scope" ON public.rsvps;
DROP POLICY IF EXISTS "rsvps_anon_insert" ON public.rsvps;
DROP POLICY IF EXISTS "rsvps_anon_update" ON public.rsvps;

-- Guests can only read LIVE events (by slug, enforced in app layer)
CREATE POLICY "anon_read_live_events"
ON public.events FOR SELECT TO anon
USING (status = 'live');

-- Guests can insert RSVPs only for live events
CREATE POLICY "anon_insert_rsvps"
ON public.rsvps FOR INSERT TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_id AND e.status = 'live'
  )
);

-- Guests can update their own RSVP via token (upsert pattern)
CREATE POLICY "anon_update_rsvps"
ON public.rsvps FOR UPDATE TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.guest_tokens gt
    WHERE gt.id = token_id
  )
);

-- Authenticated users can read events they are members of
CREATE POLICY "auth_read_own_events"
ON public.events FOR SELECT TO authenticated
USING (
  -- Platform admin sees all
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.is_platform_admin = true)
  OR
  -- Client member sees their client's events
  EXISTS (
    SELECT 1 FROM public.client_memberships cm
    WHERE cm.client_id = events.client_id AND cm.user_id = (select auth.uid())
  )
  OR
  -- Event member sees their events
  EXISTS (
    SELECT 1 FROM public.event_memberships em
    WHERE em.event_id = events.id AND em.user_id = (select auth.uid())
  )
);

-- Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_memberships ENABLE ROW LEVEL SECURITY;

-- Profiles: users read their own
CREATE POLICY "users_read_own_profile"
ON public.profiles FOR SELECT TO authenticated
USING (id = (select auth.uid()));

-- Platform admins read all profiles
CREATE POLICY "platform_admin_read_profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.is_platform_admin = true)
);

-- 2.5 Auto-Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, full_name)
  VALUES (
    NEW.id,
    NEW.phone,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
