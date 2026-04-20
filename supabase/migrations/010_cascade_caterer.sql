-- Migration to fix Data Orphan Check (Cascading Deletes) for caterer_access

ALTER TABLE caterer_access
DROP CONSTRAINT IF EXISTS caterer_access_event_id_fkey;

ALTER TABLE caterer_access
ADD CONSTRAINT caterer_access_event_id_fkey
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
