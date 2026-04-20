# Trova Tavolo

Italian-first web app for finding tabletop RPG **players**, **Game Masters**, or **whole groups** in your city. Post a listing ("annuncio"), browse the board ("bacheca"), filter by city and game system.

## Status

MVP preview — web only. Mobile apps (Expo, same monorepo) are Phase 2.

## Stack

- **Next.js 15** (App Router, React 19, Server Actions)
- **Supabase** — Postgres + PostGIS + Auth + RLS
- **Tailwind CSS** for styling
- **next-intl** for i18n (Italian primary, English stub)
- **Zod** for shared schemas across UI and server actions
- **pnpm workspaces + Turborepo** monorepo

## Repository layout

```
apps/
  web/                   # Next.js application
packages/
  core/                  # Supabase clients, Zod schemas, shared types
  ui/                    # Shared Tailwind-based components
  config/                # ESLint + tsconfig presets
supabase/
  migrations/0001_init.sql
  seed.sql
```

## Prerequisites

- Node.js ≥ 20.11
- pnpm ≥ 10 (`corepack enable` on Node 20+)
- A Supabase project (free tier is fine)
- Supabase CLI if you want to apply migrations locally

## First-time setup

```bash
pnpm install

# Configure env
cp .env.example apps/web/.env.local
# then fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL

# Apply the schema to your Supabase project
supabase link --project-ref <your-ref>
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

In the Supabase dashboard:

- **Authentication → Providers** — enable Email (password). Magic link optional.
- **Authentication → URL Configuration** — add `http://localhost:3000/auth/callback` and your production URL as additional redirect URLs.

## Running locally

```bash
pnpm dev          # all apps via turbo
# or
pnpm --filter @trova-tavolo/web dev
```

The app runs on <http://localhost:3000>.

## Scripts

| Command            | What it does                              |
| ------------------ | ----------------------------------------- |
| `pnpm dev`         | Start every app in watch mode             |
| `pnpm build`       | Production build across the workspace     |
| `pnpm lint`        | ESLint across all packages                |
| `pnpm typecheck`   | `tsc --noEmit` across all packages        |
| `pnpm format`      | Format with Prettier                      |

## Key routes

| Path                   | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `/`                    | Landing page                             |
| `/bacheca`             | Listings board with filters & pagination |
| `/bacheca/nuovo`       | Create a new listing (auth required)     |
| `/bacheca/[id]`        | Listing detail; contact gated to signed-in users |
| `/signup`, `/login`    | Auth forms                               |
| `/auth/callback`       | Supabase email-confirmation exchange     |
| `/account`             | Profile edit and account deletion        |
| `/privacy`, `/termini` | Legal pages                              |

## Data model highlights

- `profiles` (1:1 with `auth.users`) — `display_name`, `bio`, `contact_handle` (user-curated, visible only to signed-in users). Auto-created by a trigger on signup.
- `games` — normalized TTRPG catalog (seeded).
- `cities` — Italian comuni with PostGIS `geography` for future radius search.
- `announcements` — kind (`looking_for_players` / `looking_for_gm` / `looking_for_group`), body, city, `expires_at` default 60 days.
- `announcement_games` — many-to-many so a listing can target multiple systems.

RLS is on for every table. Authors can only mutate their own rows.

## Phase 1.5 before public launch

- Report / block flows (`reports` table, moderation queue).
- Server-side rate-limit via Postgres trigger (currently enforced in the server action).
- Email verification required before posting.
- Privacy policy reviewed by legal counsel.

## Phase 2

- Radius search: `ST_DWithin` query on `cities.location` + geocoding for free-form addresses.
- In-app messaging via Supabase Realtime.
- Expo mobile apps under `apps/mobile` sharing `@trova-tavolo/core`.

## Working preferences

See `CLAUDE.md` for the per-project coding and communication standards.
