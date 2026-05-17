# Production Admin/Auth Status

This build includes a full separated production-style admin panel and a single login/signup portal.

## Implemented

- One login form at `/login` for members, leaders, and admins.
- New member signup at `/login`; new signups are created as `student` members only.
- Role-based redirect after login:
  - `student` -> `/member`
  - `leader` or `admin` -> `/admin`
- Member dashboard at `/member`.
- Protected admin layout at `/admin`.
- Completed admin pages:
  - `/admin`
  - `/admin/content`
  - `/admin/events`
  - `/admin/resources`
  - `/admin/gallery`
  - `/admin/committees`
  - `/admin/programs`
  - `/admin/magazines`
  - `/admin/announcements`
  - `/admin/prayers`
  - `/admin/counseling`
  - `/admin/volunteers`
  - `/admin/donations`
  - `/admin/users`
  - `/admin/analytics`
  - `/admin/settings`
- Backend routes added for users, role management, profile syncing, and site settings.
- Admin dashboard stats and backup/export support.
- `.env` files were not changed or deleted.

## First admin account

Set `ADMIN_EMAILS` in `backend/.env` to your admin email. When that email signs in, the backend syncs the profile as `admin`.

Example:

```env
ADMIN_EMAILS=r46705591@gmail.com
```

If the SQL was already run before this update, also run:

```text
backend/src/sql/migrations/003_production_admin_auth.sql
```


## Database SQL note

For Supabase, run only `backend/src/sql/RUN_THIS_ONLY.sql` or `backend/src/sql/schema.sql`. The old migration files have been consolidated into that one file.
