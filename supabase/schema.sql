-- BWstory demo schema: intentionally auth-free.
-- WARNING: anon INSERT/UPDATE/DELETE access is only for this demo/assignment.
-- Lock these policies down before any real production use or before adding auth.

create extension if not exists "pgcrypto";

-- Demo reset: removes the earlier auth-based tables so this schema can be rerun cleanly.
-- Do not use this reset in production because it deletes existing demo rows.
drop table if exists public.posts cascade;
drop table if exists public.followers cascade;
drop table if exists public.follows cascade;
drop table if exists public.profiles cascade;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'New user',
  gender text not null default '',
  location text not null default '',
  profession text not null default '',
  bio text not null default '',
  anchor_role text not null default '',
  avatar_url text,
  cover_url text,
  feed_count integer not null default 0,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  video_url text,
  thumbnail_url text,
  headline text not null default '',
  location text not null default '',
  date_posted timestamptz not null default now(),
  view_count integer not null default 0,
  like_count integer not null default 0,
  duration_seconds integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.followers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  follower_name text not null,
  follower_handle text not null default '',
  follower_avatar_url text,
  relationship_type text not null check (relationship_type in ('follower', 'following')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.followers enable row level security;

-- Demo-only public access. Replace these policies with owner-based policies after auth is added.
drop policy if exists "anon can read profiles" on public.profiles;
create policy "anon can read profiles" on public.profiles for select to anon using (true);
drop policy if exists "anon can insert profiles" on public.profiles;
create policy "anon can insert profiles" on public.profiles for insert to anon with check (true);
drop policy if exists "anon can update profiles" on public.profiles;
create policy "anon can update profiles" on public.profiles for update to anon using (true) with check (true);
drop policy if exists "anon can delete profiles" on public.profiles;
create policy "anon can delete profiles" on public.profiles for delete to anon using (true);

drop policy if exists "anon can read posts" on public.posts;
create policy "anon can read posts" on public.posts for select to anon using (true);
drop policy if exists "anon can insert posts" on public.posts;
create policy "anon can insert posts" on public.posts for insert to anon with check (true);
drop policy if exists "anon can update posts" on public.posts;
create policy "anon can update posts" on public.posts for update to anon using (true) with check (true);
drop policy if exists "anon can delete posts" on public.posts;
create policy "anon can delete posts" on public.posts for delete to anon using (true);

drop policy if exists "anon can read followers" on public.followers;
create policy "anon can read followers" on public.followers for select to anon using (true);
drop policy if exists "anon can insert followers" on public.followers;
create policy "anon can insert followers" on public.followers for insert to anon with check (true);
drop policy if exists "anon can update followers" on public.followers;
create policy "anon can update followers" on public.followers for update to anon using (true) with check (true);
drop policy if exists "anon can delete followers" on public.followers;
create policy "anon can delete followers" on public.followers for delete to anon using (true);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('videos', 'videos', true)
on conflict (id) do update set public = true;

-- Demo-only public Storage access. Lock these policies down before production.
drop policy if exists "anon can read avatars" on storage.objects;
create policy "anon can read avatars" on storage.objects for select to anon using (bucket_id = 'avatars');
drop policy if exists "anon can insert avatars" on storage.objects;
create policy "anon can insert avatars" on storage.objects for insert to anon with check (bucket_id = 'avatars');
drop policy if exists "anon can update avatars" on storage.objects;
create policy "anon can update avatars" on storage.objects for update to anon using (bucket_id = 'avatars') with check (bucket_id = 'avatars');

drop policy if exists "anon can read videos" on storage.objects;
create policy "anon can read videos" on storage.objects for select to anon using (bucket_id = 'videos');
drop policy if exists "anon can insert videos" on storage.objects;
create policy "anon can insert videos" on storage.objects for insert to anon with check (bucket_id = 'videos');
drop policy if exists "anon can update videos" on storage.objects;
create policy "anon can update videos" on storage.objects for update to anon using (bucket_id = 'videos') with check (bucket_id = 'videos');
