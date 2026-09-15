-- Community polls: the one table that turns local vote bars into global ones.
--
-- OPTIONAL. Without it the Mission Loadout's polls still work and still show
-- real numbers — they just count this browser only, and the caption under the
-- bars says exactly that. Applying this file changes nothing in the app code:
-- src/lib/community-poll.ts already reads the table when it is there and falls
-- back when it is not.
--
-- Safe to paste into the Supabase SQL editor, and safe to run twice. No
-- CREATE INDEX CONCURRENTLY (the editor always opens a transaction) and every
-- policy is dropped before it is created, because Postgres has no
-- CREATE POLICY IF NOT EXISTS.

create extension if not exists "pgcrypto";

create table if not exists public.poll_votes (
  id         uuid primary key default gen_random_uuid(),
  poll_id    text        not null,
  option_id  text        not null,
  created_at timestamptz not null default now()
);

create index if not exists poll_votes_poll_id_idx on public.poll_votes (poll_id);

alter table public.poll_votes enable row level security;

-- Anyone may read the tally. Counts are the whole point of the feature and
-- they carry nothing about who cast them: no user id, no IP, no session.
drop policy if exists poll_votes_public_read on public.poll_votes;
create policy poll_votes_public_read
  on public.poll_votes for select
  to anon, authenticated
  using (true);

-- Anyone may add a vote, and only a vote. No update and no delete policy
-- exists, so a row cannot be altered or removed from the browser — the worst
-- a bad actor can do is inflate a count, which is the normal cost of an
-- unauthenticated poll and is why nothing on the site depends on these
-- numbers being adversarially correct.
drop policy if exists poll_votes_public_insert on public.poll_votes;
create policy poll_votes_public_insert
  on public.poll_votes for insert
  to anon, authenticated
  with check (
    length(poll_id)   between 1 and 120
    and length(option_id) between 1 and 120
  );

-- Verification: one row, with the policies that should exist.
select
  (select count(*) from public.poll_votes)                              as votes_so_far,
  (select count(*) from pg_policies
    where schemaname = 'public' and tablename = 'poll_votes')           as policies;
