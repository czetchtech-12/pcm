# Production polish fixes applied

No `.env`, `.env.local`, or `.env.example` files were changed or deleted.

## Fixed authentication token handling
- Removed direct `localStorage.getItem('access_token')` usage from admin pages and shared admin components.
- `AuthProvider` now exposes `session`, `accessToken`, and `getAccessToken()` from the live Supabase session.
- `apiFetch()` also falls back to `supabase.auth.getSession()` on the client so API calls use the current refreshed token.

## Fixed admin users page UX
- Leaders can view users if allowed by the admin layout/backend route.
- Only admins see the role-change dropdown.
- Leaders see a read-only "Admin only" state instead of a failing dropdown.
- Backend still enforces role changes with `requireAdmin`.

## Fixed member dashboard gaps
- Added a Counseling action card.
- Added a recent event registrations panel for logged-in members.
- Added `/api/users/me/registrations`.

## Connected admin settings to public UI
- Footer now fetches `/api/settings/public` and uses admin-controlled contact email, helpline, emergency number, location, footer note, and social URLs.
- Footer newsletter form now calls the existing newsletter API.
- Homepage contact form now submits instead of doing nothing.
- Homepage urgent/high announcements now display in a banner.
- Homepage feature cards, FAQs, and hero slider images are now admin-controlled through Settings.

## Fixed backend production issues
- Posts and events now use `z.enum(...)` matching database CHECK constraints.
- Donation purpose/type now default safely if omitted by a frontend form.
- Event registration now checks duplicate logged-in registrations and returns a clean 409 message.
- Event registration now reads optional auth so logged-in members get personal history.
- Added announcement `priority` database support.
- Added RLS hardening for `analytics_events` and `content_audit_logs`.

## New migration to run
If you already ran previous SQL files, run:

`backend/src/sql/migrations/004_production_polish_and_security.sql`

If setting up a fresh Supabase project, run the updated:

`backend/src/sql/schema.sql`
