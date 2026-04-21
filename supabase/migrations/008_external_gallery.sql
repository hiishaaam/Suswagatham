-- 008_external_gallery.sql
-- Adds a Post-Event Portal: hosts paste an external gallery link (Google Drive, Photos, iCloud)
-- which automatically transforms the guest page into a post-event thank-you screen.

ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_link TEXT;
