# Production Patch 005

Applied after the production polish build. Environment files were not changed.

## Fixes

- Added `nullsFirst: false` to the `/api/users/me/registrations` registered_at ordering so older rows with NULL dates do not sort above real recent registrations.
- Reworked `/api/search` to use table-specific search columns. This prevents Supabase `.or()` filters from referencing columns that do not exist on some tables.
- Removed the orphaned legacy `/admin/content/new/page.tsx` file because `/admin/content` now uses the shared `AdminResourcePage` create/edit modal.
