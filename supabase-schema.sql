-- Run this once in the Supabase SQL Editor.
create table if not exists public.opportunities (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_notifications (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.opportunities enable row level security;
alter table public.admin_notifications enable row level security;

create policy "Public can read opportunities" on public.opportunities
  for select using (true);
create policy "Authenticated admins manage opportunities" on public.opportunities
  for all to authenticated
  using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create policy "Public can read notifications" on public.admin_notifications
  for select using (true);
create policy "Authenticated admins manage notifications" on public.admin_notifications
  for all to authenticated
  using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
