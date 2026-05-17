# Implementation Status

This version moves the project beyond scaffolding into a separated full-stack implementation.

Implemented:
- `frontend/` and `backend/` separated.
- Express backend connected to Supabase.
- Public API routes for posts/news, events, resources, gallery, programs, committees, magazines, announcements, search, prayer requests, counseling requests, donations, newsletter, analytics tracking.
- Protected leader/admin routes for content management, dashboard stats, event attendees, CSV export, and JSON backup.
- Frontend pages rewired to backend API for news, events, resources, gallery, programs, committees, magazines and search.
- Individual detail pages for news, events, and resources.
- Event registration form connected to backend.
- Resource preview page before download.
- Prayer request, counseling, newsletter/donation records connected to backend API.
- Unsupported fake statistics and placeholder cards removed from key public pages.
- Consistent footer/contact details added.
- Privacy/emergency language added to counseling.
- SEO `robots.ts`, `sitemap.ts`, and richer metadata added.
- Optional SMTP notification support added through environment variables.
- Analytics and backup SQL tables added.

Still needs real live keys before production:
- Supabase URL, anon key, service role key.
- SMTP credentials if email notifications should send.
- Real payment provider credentials if you want automatic mobile-money/card confirmation. Current donation flow records manual giving/pending confirmation.
- Real content/images entered through the database/admin workflow.

Run order:
1. Create Supabase project.
2. Run `backend/src/sql/schema.sql` then `backend/src/sql/seed.sql`.
3. Copy env examples to real `.env` files and fill keys.
4. Install dependencies in root/frontend/backend.
5. Run backend on `5001`, frontend on `3000`.


## Database SQL note

For Supabase, run only `backend/src/sql/RUN_THIS_ONLY.sql` or `backend/src/sql/schema.sql`. The old migration files have been consolidated into that one file.
