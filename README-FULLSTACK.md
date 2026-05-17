# CBU SDA PCM Full-Stack Website

This version separates the project into:

```txt
frontend/   Next.js + React + Tailwind website
backend/    Express REST API + Supabase database/storage/auth support
shared/     API contract notes and deployment checklist
```

## What was added

- Full backend folder with Express API.
- Supabase service-role backend integration.
- Auth verification middleware.
- Role checks for admin/leader-only routes.
- CRUD endpoints for posts/news, events, registrations, resources, gallery, committees, prayer requests, counseling requests, donations, magazines, announcements, newsletter subscribers, search and dashboard statistics.
- Separated environment files for frontend and backend.
- Expanded production SQL schema with slugs, publishing status, search indexes, registrations, donation references, audit fields and helper views.
- Frontend API helper at `frontend/lib/api.ts`.
- New dynamic frontend pages for individual news, event and resource details.
- Frontend search page that calls the backend search endpoint.
- Resource detail pages designed to open resources first, then download only when the user chooses.

## Run locally

```bash
npm install
cp .env.example backend/.env
cp .env.example frontend/.env.local
npm run dev
```

Then open:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:5001/api/health`

## Database setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run `backend/src/sql/schema.sql`.
4. Run `backend/src/sql/seed.sql` only if you want starter data.
5. Add the values to `backend/.env` and `frontend/.env.local`.

## Important production notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in the frontend.
- Keep admin routes protected by the backend middleware.
- Replace all placeholder content/images before launch.
- Use verified numbers only; avoid fake impact statistics.
- Configure Supabase Storage buckets: `gallery`, `resources`, `covers`, `profiles`.
- Connect real donation provider before accepting live money.


## Database SQL note

For Supabase, run only `backend/src/sql/RUN_THIS_ONLY.sql` or `backend/src/sql/schema.sql`. The old migration files have been consolidated into that one file.
