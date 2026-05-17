# API Contract Summary

Frontend uses `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:5001/api`.

Public reads:
- `GET /posts?status=published`
- `GET /posts/:idOrSlug`
- `GET /events?status=published`
- `GET /events/:idOrSlug`
- `GET /resources?status=published`
- `GET /resources/:idOrSlug`
- `GET /search?q=term`

Public forms:
- `POST /forms/prayer-requests`
- `POST /forms/counseling-requests`
- `POST /forms/donations`
- `POST /forms/newsletter`

Protected:
- Admin/leader content management routes require a Supabase bearer token.
