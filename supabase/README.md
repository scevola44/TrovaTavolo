# Supabase

All schema changes live here as version-controlled migrations. Never edit tables from the Supabase dashboard directly.

## Applying locally with the Supabase CLI

```bash
supabase login
supabase link --project-ref <your-ref>
supabase db push                # run migrations
psql "$SUPABASE_DB_URL" -f supabase/seed.sql   # one-time seed
```

## Ordering

- `migrations/0001_init.sql` — tables, indexes, RLS, triggers.
- `seed.sql` — games catalog and starter Italian cities. Idempotent (`on conflict do nothing`).
