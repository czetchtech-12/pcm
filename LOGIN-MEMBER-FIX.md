# Member Login Fix

This patch makes member login more tolerant after email confirmation.

What changed:
- Login no longer fails just because backend profile sync temporarily fails.
- AuthProvider now keeps a safe student fallback profile from the Supabase session.
- Signup uses `emailRedirectTo` so confirmed users return to `/login`.
- Supabase client explicitly enables persisted sessions, auto-refresh, URL session detection, and PKCE.
- Login error messages now distinguish invalid credentials from unconfirmed email.

Important:
- The real admin/member role still comes from the backend `/api/users/me` profile sync.
- If backend is off, regular members can still login, but admin role detection needs backend to be running.
