# PCM Backend

Express API for the PCM website. It uses Supabase for database, auth and storage.

## Main endpoints

- `GET /api/health`
- `GET/POST/PUT/DELETE /api/posts`
- `GET/POST/PUT/DELETE /api/events`
- `POST /api/events/:id/register`
- `GET/POST/PUT/DELETE /api/resources`
- `GET/POST/PUT/DELETE /api/gallery`
- `POST /api/gallery/upload`
- `POST /api/forms/prayer-requests`
- `POST /api/forms/counseling-requests`
- `POST /api/forms/donations`
- `POST /api/forms/newsletter`
- `GET /api/search?q=term`
- `GET /api/dashboard/stats`

Protected routes require a Supabase access token in the `Authorization: Bearer <token>` header.
