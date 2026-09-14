-- Growth engine setup — paste this whole file into the Supabase SQL editor.
--
-- One file, safe to run any number of times. It creates every table the search
-- growth engine reads or writes, and nothing else. Running it twice changes
-- nothing and errors on nothing.
--
-- Why this exists alongside the migrations: supabase/migrations/ is the history,
-- and parts of that history are NOT safe to re-run in the SQL editor —
-- 20260901204040 issues a bare CREATE POLICY (Postgres has no IF NOT EXISTS for
-- policies, so a second run errors), 20260902000737 uses CREATE TABLE ... AS
-- and then deletes the rows it copied, and 20260913000000 uses CREATE INDEX
-- CONCURRENTLY, which cannot run inside a transaction block — and the SQL
-- editor always opens one. Pasting the whole directory therefore fails partway
-- through on statements that have nothing to do with the growth engine.
--
-- This file contains only IF NOT EXISTS statements, no policies and no
-- CONCURRENTLY, so it is safe to paste in one go.
--
-- The five tables below are the complete set. There is deliberately no
-- gsc_performance_daily, no trend_signals and no content_opportunities table:
-- no code in this repository reads or writes those names. Creating them would
-- add tables nothing ever queries.

-- ── Trend signals ────────────────────────────────────────────────────────────
-- Daily snapshots, so growth can be measured across two windows rather than
-- asserted from one.

create table if not exists public.trend_observations (
  id bigint generated always as identity primary key,
  source text not null,
  geo text not null,
  term text not null,
  raw_term text not null,
  rank integer not null,
  list_size integer not null,
  weight numeric,
  observed_at timestamptz not null default now(),
  observed_on date not null default (now() at time zone 'utc')::date
);

-- One row per source, geo, term and day: a re-run corrects that day instead of
-- stacking a second observation and silently doubling the term's weight.
create unique index if not exists trend_observations_daily_key
  on public.trend_observations (source, geo, term, observed_on);

create index if not exists trend_observations_term_day
  on public.trend_observations (term, observed_on desc);

create table if not exists public.trend_terms (
  term text primary key,
  display_term text not null,
  domain text not null,
  matched_entity_type text,
  matched_entity_slug text,
  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  observation_count integer not null default 0,
  source_count integer not null default 0,
  current_score numeric,
  baseline_score numeric,
  velocity numeric,
  updated_at timestamptz not null default now()
);

create index if not exists trend_terms_velocity
  on public.trend_terms (velocity desc nulls last);

create index if not exists trend_terms_gaps
  on public.trend_terms (domain, velocity desc nulls last)
  where matched_entity_slug is null;

-- ── Search Console performance ───────────────────────────────────────────────

create table if not exists public.search_page_stats (
  id bigint generated always as identity primary key,
  page text not null,
  observed_on date not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric,
  position numeric,
  created_at timestamptz not null default now()
);

create unique index if not exists search_page_stats_daily_key
  on public.search_page_stats (page, observed_on);

create index if not exists search_page_stats_recent
  on public.search_page_stats (observed_on desc, impressions desc);

create table if not exists public.search_query_stats (
  id bigint generated always as identity primary key,
  page text not null,
  query text not null,
  observed_on date not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric,
  position numeric,
  created_at timestamptz not null default now()
);

create unique index if not exists search_query_stats_daily_key
  on public.search_query_stats (page, query, observed_on);

create index if not exists search_query_stats_position
  on public.search_query_stats (observed_on desc, position);

create table if not exists public.search_actions (
  page text primary key,
  action text not null,
  reason text not null,
  best_query text,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric,
  position numeric,
  position_delta numeric,
  impressions_delta integer,
  priority numeric not null default 0,
  window_days integer not null,
  updated_at timestamptz not null default now()
);

create index if not exists search_actions_priority
  on public.search_actions (action, priority desc);

-- ── Verification ─────────────────────────────────────────────────────────────
-- Prints one row per table with its column count. Five rows means the engine
-- has everything it needs; a missing row names exactly what did not get created.

select
  t.table_name,
  count(c.column_name) as columns,
  'ready' as status
from information_schema.tables t
join information_schema.columns c
  on c.table_schema = t.table_schema and c.table_name = t.table_name
where t.table_schema = 'public'
  and t.table_name in (
    'trend_observations', 'trend_terms',
    'search_page_stats', 'search_query_stats', 'search_actions'
  )
group by t.table_name
order by t.table_name;
