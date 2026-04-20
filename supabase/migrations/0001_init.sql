-- Trova Tavolo — initial schema
-- Multi-game ready, radius-search ready (PostGIS), RLS on from day one.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;
create extension if not exists postgis;
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- profiles — 1:1 with auth.users (public-facing identity)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  bio text,
  contact_handle text,
  created_at timestamptz not null default now(),
  constraint display_name_length check (display_name is null or char_length(display_name) between 2 and 40),
  constraint bio_length check (bio is null or char_length(bio) <= 500),
  constraint contact_handle_length check (contact_handle is null or char_length(contact_handle) between 3 and 120)
);

alter table public.profiles enable row level security;

create policy "profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create a profile row whenever a new auth.users row appears.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- games — catalog of TTRPG systems
-- ---------------------------------------------------------------------------
create table public.games (
  id serial primary key,
  slug text not null unique,
  name_it text not null,
  name_en text not null,
  is_active boolean not null default true
);

alter table public.games enable row level security;

create policy "games are readable by everyone"
  on public.games for select
  to anon, authenticated
  using (is_active = true);

-- ---------------------------------------------------------------------------
-- cities — Italian cities (extensible). location is ready for radius search.
-- ---------------------------------------------------------------------------
create table public.cities (
  id serial primary key,
  name text not null,
  region text not null,
  location geography(Point, 4326),
  unique (name, region)
);

create index cities_name_trgm on public.cities using gin (name gin_trgm_ops);

alter table public.cities enable row level security;

create policy "cities are readable by everyone"
  on public.cities for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- announcements — the bacheca posts
-- ---------------------------------------------------------------------------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('looking_for_players', 'looking_for_gm', 'looking_for_group')),
  title text not null,
  body text not null,
  city_id integer not null references public.cities (id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '60 days'),
  is_active boolean not null default true,
  constraint title_length check (char_length(title) between 4 and 120),
  constraint body_length check (char_length(body) between 20 and 4000)
);

create index announcements_active_recent
  on public.announcements (is_active, created_at desc)
  where is_active = true;

create index announcements_city on public.announcements (city_id) where is_active = true;
create index announcements_kind on public.announcements (kind) where is_active = true;
create index announcements_author on public.announcements (author_id);

alter table public.announcements enable row level security;

create policy "active announcements are readable by everyone"
  on public.announcements for select
  to anon, authenticated
  using (is_active = true and expires_at > now());

create policy "authors can read their own inactive/expired announcements"
  on public.announcements for select
  to authenticated
  using (author_id = auth.uid());

create policy "authenticated users can create their own announcements"
  on public.announcements for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "authors can update their own announcements"
  on public.announcements for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "authors can delete their own announcements"
  on public.announcements for delete
  to authenticated
  using (author_id = auth.uid());

-- ---------------------------------------------------------------------------
-- announcement_games — many-to-many
-- ---------------------------------------------------------------------------
create table public.announcement_games (
  announcement_id uuid not null references public.announcements (id) on delete cascade,
  game_id integer not null references public.games (id) on delete restrict,
  primary key (announcement_id, game_id)
);

create index announcement_games_game on public.announcement_games (game_id);

alter table public.announcement_games enable row level security;

create policy "announcement_games are readable when parent is readable"
  on public.announcement_games for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.announcements a
      where a.id = announcement_games.announcement_id
        and (
          (a.is_active = true and a.expires_at > now())
          or a.author_id = auth.uid()
        )
    )
  );

create policy "announcement authors manage their announcement_games"
  on public.announcement_games for all
  to authenticated
  using (
    exists (
      select 1 from public.announcements a
      where a.id = announcement_games.announcement_id and a.author_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.announcements a
      where a.id = announcement_games.announcement_id and a.author_id = auth.uid()
    )
  );
