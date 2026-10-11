-- Run once in the Supabase SQL editor. Keys stay on Render, never in browser JS.
create table if not exists public.community_looks (
 id uuid primary key default gen_random_uuid(),
 nickname text not null check (char_length(nickname) between 1 and 40),
 title text not null check (char_length(title) between 1 and 80),
 caption text not null default '' check (char_length(caption) <= 600),
 look jsonb not null,
 theme text not null check (theme in ('everyday','heritage','graduation')),
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now()
);
create table if not exists public.community_reports (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.community_looks(id),
 reason text not null check (reason in ('culture','spam','abuse','other')),
 created_at timestamptz not null default now()
);
create index if not exists community_status_created on public.community_looks(status,created_at desc);
alter table public.community_looks enable row level security;
alter table public.community_reports enable row level security;
revoke all on public.community_looks, public.community_reports from anon, authenticated;
grant all on public.community_looks, public.community_reports to service_role;
-- No public write/read policies: the website server enforces publication and moderation.
