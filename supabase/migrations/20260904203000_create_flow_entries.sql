create extension if not exists pgcrypto;

create table if not exists public.flow_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  mood text not null check (mood in ('Calm', 'Focused', 'Electric', 'Foggy', 'Heavy')),
  energy integer not null check (energy between 1 and 5),
  focus integer not null check (focus between 1 and 5),
  reflection text not null,
  wins text not null default '',
  blockers text not null default '',
  next_step text not null,
  entry_date date not null default current_date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists flow_entries_user_id_idx on public.flow_entries (user_id);
create index if not exists flow_entries_entry_date_idx on public.flow_entries (entry_date desc);

create or replace function public.set_flow_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists flow_entries_set_updated_at on public.flow_entries;
create trigger flow_entries_set_updated_at
before update on public.flow_entries
for each row
execute function public.set_flow_entries_updated_at();

alter table public.flow_entries enable row level security;

drop policy if exists "Users can read own flow entries" on public.flow_entries;
create policy "Users can read own flow entries"
on public.flow_entries
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own flow entries" on public.flow_entries;
create policy "Users can insert own flow entries"
on public.flow_entries
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own flow entries" on public.flow_entries;
create policy "Users can update own flow entries"
on public.flow_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own flow entries" on public.flow_entries;
create policy "Users can delete own flow entries"
on public.flow_entries
for delete
to authenticated
using (auth.uid() = user_id);
