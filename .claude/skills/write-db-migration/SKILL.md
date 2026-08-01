---
name: write-db-migration
description: "Use whenever a feature needs a NEW table, column, index, policy or database function. There is NO migration tool to run and no CLI to install: you WRITE app/web/supabase/migrations/<NNNN>_<slug>.sql, reference it from the code that needs it, and push - the platform applies every migration in that directory on every push with the Supabase admin token. This skill covers the file naming, the idempotency rules (every migration REPLAYS on every push), the widen-only allow_* helper for constraint changes, and how to confirm it applied from the deploy log instead of hunting for a tool. NEVER block or caveat a build on a missing migration tool."
metadata: {"openclaw":{"emoji":"🗄️"}}
---

# write-db-migration - the file IS the migration

**Stop looking for a tool. There isn't one, and you don't need one.**

To change this app's database schema you write ONE file and push it:

```
app/web/supabase/migrations/<NNNN>_<slug>.sql
```

On EVERY push, the platform clones the pushed branch and runs every `.sql`
file in that directory, in filename order, against this business's Supabase
database using the Management API admin token. Then it logs:

```
[business] push deploy: applied supabase migrations ref=... migrations=N applied=N failed=0
```

That is the whole mechanism. No `supabase` CLI, no `psql`, no MCP tool, no
service-role key to find, no dashboard step, and nothing for the owner to do
by hand.

## Never say these things

Both of these have shipped to an owner, and both were false:

- "The Supabase migration tool is unavailable or hanging, so I cannot land
  the merge."
- "This feature only works once a pending database migration is applied."

There is no pending state. A migration file that is committed and pushed is
an applied migration. If you catch yourself searching for a way to RUN sql,
that search is the bug: write the file, push it, move on. **NEVER block,
pause, or caveat a build on database migrations.**

## The four steps

### 1. Write the file

Pick the next free four-digit number and a readable slug. Numbers order the
run, so never reuse or renumber an existing one:

```bash
ls app/web/supabase/migrations/
# 0001_users.sql  0002_retro_drafts.sql   ->  yours is 0003_...
```

Write it idempotently (see below), with a comment at the top saying what it
is for.

### 2. Reference it from the code in the same commit

The migration and the code that queries the new table land together. A table
without its feature is dead weight; a feature without its table is a runtime
error the owner sees before you do.

### 3. Push

```bash
git add app/web/supabase/migrations/0003_<slug>.sql <the code>
git commit -m "add <thing> table + <feature>"
git push
```

### 4. Confirm from the deploy, not from a tool

Check the deploy your push triggered. The log line above must read
`failed=0`. You can also just query the table from the app.

If a migration fails, the server files a Home **blocker card** naming the
file and the error, so a failure comes to you. Fix the file and push again.

## Replay safety - this is where migrations actually break

**The applier keeps NO ledger.** Every file in the directory re-runs on
every push, forever. A file that fails is logged and SKIPPED so the deploy
still ships, which means a migration that is not replay-safe fails silently
on every push from then on and its schema NEVER lands.

### Rule 1 - every statement is idempotent

```sql
create table if not exists public.retro_drafts (...);
alter table public.retro_drafts add column if not exists archived boolean default false;
create index if not exists retro_drafts_owner_idx on public.retro_drafts (owner_id);
create or replace function public.touch_updated_at() returns trigger ...;

drop policy if exists "own drafts" on public.retro_drafts;
create policy "own drafts" on public.retro_drafts
  for select using (auth.uid() = owner_id);

drop trigger if exists retro_drafts_touch on public.retro_drafts;
create trigger retro_drafts_touch before update on public.retro_drafts
  for each row execute function public.touch_updated_at();
```

Never a bare `create table` / `create policy` / `create trigger` that errors
the second time it runs. `0001_users.sql` in this repo is the reference
shape: copy its style.

### Rule 2 - constraint changes WIDEN ONLY, and converge

This is the one that bit this repo (`W3` / `de83b07`).

A check constraint written as a **dated snapshot of an allow-list** is
correct the day you write it and wrong forever after:

```sql
-- WRONG. Correct today, permanently broken the moment anyone adds 'retro'.
alter table public.docs add constraint docs_kind_check
  check (kind in ('draft', 'final'));
```

On the next push this replays against rows that already hold `'retro'`,
fails, and takes the rest of its file down with it. And because failures are
swallowed, nobody notices until the schema is weeks out of date.

Keep the allowed set as DATA, and add an `allow_*` helper that UNIONS:

```sql
-- 0007_allow_doc_kind.sql
-- Widen-only allow-list. What is ALLOWED lives in a table, the helper only
-- ever ADDS to it, and the constraint is rebuilt from whatever is in there.
-- Replaying every migration in any order, any number of times, therefore
-- converges on the union of every value ever allowed.

create table if not exists public.doc_kind_allowed (kind text primary key);

create or replace function public.allow_doc_kind(new_kinds text[])
returns void
language plpgsql
as $$
declare
  allowed text[];
begin
  insert into public.doc_kind_allowed (kind)
    select unnest(new_kinds)
    on conflict (kind) do nothing;
  select array_agg(kind order by kind) into allowed
    from public.doc_kind_allowed;
  alter table public.docs drop constraint if exists docs_kind_check;
  execute format(
    'alter table public.docs add constraint docs_kind_check '
    'check (kind = any (%L::text[]))', allowed
  );
end;
$$;

-- Seed the values this migration needs.
select public.allow_doc_kind(array['draft', 'final']);
```

Every LATER migration that introduces a new value adds exactly one line and
nothing else:

```sql
-- 0009_doc_kind_retro.sql
select public.allow_doc_kind(array['retro']);
```

The same shape works for any widening change: enum-ish text columns, status
fields, role lists. The rule is always the same - **add to what is allowed,
never re-declare the whole set.**

## Checklist before you push

- [ ] Filename is `app/web/supabase/migrations/<next NNNN>_<slug>.sql`, not
      a renumbered or reused existing one.
- [ ] Every statement re-runs cleanly: `if not exists`, `or replace`, or
      `drop ... if exists` first.
- [ ] No constraint re-asserts a full allow-list snapshot; widening goes
      through an `allow_*` helper.
- [ ] Row-level security is on for any table the app reads with the anon
      key, with policies scoped to `auth.uid()` (see `0001_users.sql`).
- [ ] The code that uses the new schema is in the SAME commit.
- [ ] After the push: the deploy log reads `failed=0`, or the table answers
      a query from the app.
