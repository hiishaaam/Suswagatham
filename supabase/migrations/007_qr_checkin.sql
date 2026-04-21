-- 007_qr_checkin.sql
-- Adds opt-in QR check-in capabilities and an RPC to verify tickets safely.

-- Add requires_qr_checkin to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS requires_qr_checkin BOOLEAN DEFAULT false;

-- Add check-in columns to rsvps
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS arrived BOOLEAN DEFAULT false;
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- RPC to verify QR code and mark as arrived
CREATE OR REPLACE FUNCTION verify_qr_checkin(p_token text, p_event_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_id uuid;
    v_rsvp_id uuid;
    v_family_name text;
    v_guest_count int;
    v_food_pref text;
    v_arrived boolean;
BEGIN
    -- Validate token exists for this event
    SELECT id, family_name INTO v_token_id, v_family_name
    FROM guest_tokens
    WHERE unique_token = p_token AND event_id = p_event_id;

    IF v_token_id IS NULL THEN
        RETURN json_build_object('status', 'error', 'message', 'Invalid QR ticket for this event.');
    END IF;

    -- Validate RSVP exists
    SELECT id, guest_count, food_preference, arrived 
    INTO v_rsvp_id, v_guest_count, v_food_pref, v_arrived
    FROM rsvps
    WHERE token_id = v_token_id AND event_id = p_event_id
    AND attending = true;

    IF v_rsvp_id IS NULL THEN
        RETURN json_build_object('status', 'error', 'message', 'Guest has not RSVPed as attending.');
    END IF;

    -- Check if already scanned
    IF v_arrived THEN
        RETURN json_build_object(
            'status', 'warning', 
            'message', 'Already Scanned', 
            'family_name', v_family_name, 
            'guest_count', v_guest_count
        );
    END IF;

    -- Mark as arrived
    UPDATE rsvps
    SET arrived = true, checked_in_at = now()
    WHERE id = v_rsvp_id;

    RETURN json_build_object(
        'status', 'success',
        'message', 'Checked in successfully!',
        'family_name', v_family_name,
        'guest_count', v_guest_count,
        'food_preference', v_food_pref
    );
END;
$$;
