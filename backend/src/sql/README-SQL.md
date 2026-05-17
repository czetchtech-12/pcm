# Database setup

Use **one file only** for Supabase setup.

## Fresh Supabase project
Run this file in Supabase SQL Editor:

```text
backend/src/sql/RUN_THIS_ONLY.sql
```

`schema.sql` contains the same consolidated SQL.

## Existing Supabase project
You can also run `RUN_THIS_ONLY.sql` because it was made safer with `IF NOT EXISTS`, `DROP POLICY IF EXISTS`, and `DROP TRIGGER IF EXISTS`.

## Do not run migrations
The old migration files were removed to avoid confusion. Their changes are now included in this one file.
