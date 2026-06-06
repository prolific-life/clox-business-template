-- Profile table for the app's signed-in users.
--
-- Supabase manages the real identities in auth.users; this public.users
-- table mirrors the subset the app renders (name / email / picture) and
-- is what /app reads. It's populated automatically on signup by the
-- handle_new_user trigger below, from the OAuth identity metadata
-- (Google supplies full_name / email / avatar_url).
--
-- Apply this to the project's database once (the v9 provision step runs
-- it against the freshly-created Supabase project; you can also paste it
-- into the Supabase SQL editor).

create table if not exists public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text,
  email      text,
  picture    text,
  created_at timestamptz not null default now()
);

-- Row-level security: a user can only see / change their own row.
alter table public.users enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- On every new auth user, upsert the matching profile row. security
-- definer + empty search_path is the Supabase-recommended hardening for
-- trigger functions that write to public from the auth schema.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email, picture)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.email
    ),
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do update
    set name    = excluded.name,
        email   = excluded.email,
        picture = excluded.picture;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
