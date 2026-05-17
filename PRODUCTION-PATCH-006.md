# Production Patch 006

This patch hardens the production admin/member system without changing or deleting any `.env`, `.env.local`, or `.env.example` files.

## Security
- Added `express-rate-limit` to public POST endpoints: prayer requests, counseling requests, donations, newsletter, involvement requests, and analytics tracking.
- Added Zod validation and text-size caps to form routes.
- Reduced Express body size limit from 2MB to 500KB for JSON and URL-encoded form bodies.
- Analytics no longer stores raw IP addresses. New events store `ip_hash` and set `ip` to `null`.
- Added migration to clear old raw IP values from `analytics_events`.
- Added unique slug generation so duplicate titles no longer collide silently.
- Delete routes now allow only admins or the original creator/owner to delete records.

## Backend reliability
- Event registration now resolves both event UUIDs and event slugs before saving attendees.
- Duplicate event registrations return a clean message for logged-in users.
- `increment_event_attendees` RPC failures are logged instead of swallowed silently.
- Event attendees CSV export now includes event title and event slug columns.
- Backup route now limits rows per table and includes a warning to avoid timeouts/OOM.
- Mailer now logs once when SMTP is not configured.
- Added graceful shutdown for SIGTERM/SIGINT.

## Frontend/admin UX
- Added admin error boundary so admin render errors do not blank the whole admin shell.
- Added 300ms debounce to admin table search.
- Added pagination controls to admin resource tables.
- Delete action already confirms before deleting.
- Page-view analytics is now wired from the frontend.

## Member profile pictures
- Added `avatar_url` support to users.
- Added member dashboard DP upload.
- Added avatar thumbnails to `/admin/users`.
- Upload route allows normal authenticated members to upload only to the `avatars` bucket; all other uploads still require leader/admin.

## Storage URL handling
- New file uploads return a `storageRef` like `storage:avatars:profiles/...`.
- API responses resolve storage refs to public URLs for frontend display.
- Existing absolute URLs still continue working.

## Required migration
Run this in Supabase SQL Editor after migration 004:

```sql
backend/src/sql/migrations/005_security_member_avatar_and_ops.sql
```
