create extension if not exists pgcrypto;

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 80),
  description text not null default '' check (char_length(description) <= 800),
  category text not null default 'study' check (category in ('study', 'work', 'personal', 'reflection')),
  duration_minutes integer not null default 25 check (duration_minutes between 5 and 240),
  focus_date date not null default current_date,
  mood text not null default 'steady' check (mood in ('energized', 'steady', 'tired')),
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.focus_sessions is 'Flowday users own focus-session records';

create index if not exists focus_sessions_user_date_idx
  on public.focus_sessions (user_id, focus_date desc, created_at desc);

alter table public.focus_sessions enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists focus_sessions_set_updated_at on public.focus_sessions;
create trigger focus_sessions_set_updated_at
before update on public.focus_sessions
for each row execute function public.set_updated_at();

create policy "Users can read their own focus sessions"
on public.focus_sessions for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can create their own focus sessions"
on public.focus_sessions for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can update their own focus sessions"
on public.focus_sessions for update
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can delete their own focus sessions"
on public.focus_sessions for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.focus_sessions to authenticated;
