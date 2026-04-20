-- Create a new migration file: supabase/migrations/003_custom_theme_data.sql

-- Add a JSONB column to the events table to store AI-generated dynamic themes
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS custom_theme_data JSONB DEFAULT NULL;

-- Comment on the column for future reference
COMMENT ON COLUMN public.events.custom_theme_data IS 'Stores the output of Gemini-generated JSON themes directly. When this is present, template_id should be treated as "custom".';
 