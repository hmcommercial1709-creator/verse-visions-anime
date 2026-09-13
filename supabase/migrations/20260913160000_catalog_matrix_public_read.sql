-- Lets the site read the programmatic-SEO matrix index.
--
-- scripts/write-matrix-index.mjs computes, once per ingest, which facet
-- intersections have enough catalog rows behind them to deserve a page, and
-- which title pairs are worth a comparison page. It stores that as one row in
-- automation_state.
--
-- The Worker has to read it on every facet and comparison render — it is what
-- decides whether a URL exists at all. Aggregating the catalog per request
-- instead would mean thousands of rows scanned inside a Worker with a
-- subrequest budget, on every page, which is not a thing that works.
--
-- automation_state also holds operational state that is nobody's business:
-- ingest cursors, run timestamps, whatever a later job puts there. So this
-- does NOT open the table. The policy is scoped by key prefix, and only the
-- two columns the site reads are granted. A cursor row stays invisible to the
-- public client even though it lives in the same table.

create table if not exists public.automation_state (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.automation_state enable row level security;

-- Idempotent: CREATE POLICY has no IF NOT EXISTS, so re-applying this file
-- without the drop would fail on the second run. This migration is applied by
-- the nightly workflow, so it has to survive being run again.
drop policy if exists catalog_matrix_public_read on public.automation_state;

create policy catalog_matrix_public_read on public.automation_state
  for select
  to anon, authenticated
  using (key like 'catalog_matrix:%');

-- Column-level grant, so even a row the policy exposes cannot leak a column
-- added to this table later.
grant select (key, value) on public.automation_state to anon, authenticated;

-- The pipeline writes with the service role, which bypasses RLS; granting it
-- explicitly keeps the intent readable rather than implied.
grant select, insert, update, delete on public.automation_state to service_role;
