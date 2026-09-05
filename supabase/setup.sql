-- ============================================================
-- Yuval Boker portfolio — full Supabase setup
-- Run this once in the SQL Editor of a fresh Supabase project.
-- Covers: project likes/clicks, comments, and the hoops leaderboard.
-- ============================================================

-- ---------- project stats (likes / repo clicks) ----------
create table if not exists public.project_stats (
  project_id text primary key,
  likes int not null default 0,
  clicks int not null default 0
);

alter table public.project_stats enable row level security;

create policy "public read stats" on public.project_stats
  for select using (true);

create policy "public upsert stats" on public.project_stats
  for insert with check (true);

create policy "public update stats" on public.project_stats
  for update using (true);

-- atomic increment functions used by the site
create or replace function public.inc_like(pid text)
returns int
language sql
security definer
set search_path = public
as $$
  insert into public.project_stats (project_id, likes, clicks)
  values (pid, 1, 0)
  on conflict (project_id) do update set likes = project_stats.likes + 1
  returning likes;
$$;

create or replace function public.inc_click(pid text)
returns int
language sql
security definer
set search_path = public
as $$
  insert into public.project_stats (project_id, likes, clicks)
  values (pid, 0, 1)
  on conflict (project_id) do update set clicks = project_stats.clicks + 1
  returning clicks;
$$;

-- ---------- project comments ----------
create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  text text not null check (char_length(text) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists project_comments_project_idx
  on public.project_comments (project_id, created_at desc);

alter table public.project_comments enable row level security;

create policy "public read comments" on public.project_comments
  for select using (true);

create policy "public write comments" on public.project_comments
  for insert with check (true);

-- ---------- hoops game leaderboard ----------
create table if not exists public.hoops_scores (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 14),
  score int not null check (score between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists hoops_scores_score_idx
  on public.hoops_scores (score desc);

alter table public.hoops_scores enable row level security;

create policy "public read scores" on public.hoops_scores
  for select using (true);

create policy "public submit scores" on public.hoops_scores
  for insert with check (true);
