-- Trend signals: what the outside world is searching for and watching, stored
-- over time so growth can be measured rather than asserted.
--
-- Why two tables and not one:
--
-- A single call to any trends endpoint returns a SNAPSHOT — today's hottest
-- terms, in rank order. It does not return growth. "This term is up 500% this
-- week" is a statement about two points in time, so it cannot be computed from
-- one fetch no matter how the response is massaged. trend_observations is the
-- history that makes the second point exist; trend_terms is the rolled-up
-- verdict recomputed from it on every run.
--
-- Until a term has observations in BOTH windows its velocity stays null, and
-- the pipeline reports it as "baseline establishing" rather than inventing a
-- percentage. A null here is the honest answer to a question the data cannot
-- yet answer.
--
-- These tables are operational, not public: no anon grant, so nothing here is
-- readable by the site or by a crawler. Promoting a term to a visible page is
-- a separate, gated step.

create table if not exists public.trend_observations (
  id bigint generated always as identity primary key,

  -- Which feed this came from, and for where. Two sources naming the same
  -- term on the same day is corroboration, so the pair is kept, not merged.
  source text not null,
  geo text not null,

  -- `term` is the normalized key (lowercased, collapsed whitespace); raw_term
  -- keeps the source's own spelling for display, because "PUBG UC" should not
  -- be shown back to anyone as "pubg uc".
  term text not null,
  raw_term text not null,

  -- Position in the source's list, 1 = hottest. Converted to a 0..1 heat by
  -- the scorer so lists of different lengths stay comparable.
  rank integer not null,
  list_size integer not null,

  -- Source-specific magnitude when the feed publishes one (view counts,
  -- approximate traffic). Null when it does not — never a stand-in value.
  weight numeric,

  observed_at timestamptz not null default now(),
  observed_on date not null default (now() at time zone 'utc')::date
);

-- One row per source, geo, term and day. A re-run on the same day corrects
-- that day's observation instead of stacking a second one, which would
-- silently double a term's weight every time the workflow was retried.
create unique index if not exists trend_observations_daily_key
  on public.trend_observations (source, geo, term, observed_on);

-- The velocity query reads one term across a date range.
create index if not exists trend_observations_term_day
  on public.trend_observations (term, observed_on desc);

create table if not exists public.trend_terms (
  term text primary key,
  display_term text not null,

  -- Which part of the site this belongs to: games, anime, or the gift-card
  -- and top-up products. A term that matches none of them is never stored.
  domain text not null,

  -- The catalog row this term already maps to, if any. Populated means the
  -- demand has somewhere to land today; null means it is a gap, and gaps are
  -- reported for a human to decide on, not auto-published.
  matched_entity_type text,
  matched_entity_slug text,

  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  observation_count integer not null default 0,
  source_count integer not null default 0,

  -- Mean heat across the recent window, and across the window before it.
  current_score numeric,
  baseline_score numeric,

  -- (current - baseline) / baseline. NULL until both windows have data.
  velocity numeric,

  updated_at timestamptz not null default now()
);

create index if not exists trend_terms_velocity
  on public.trend_terms (velocity desc nulls last);

create index if not exists trend_terms_gaps
  on public.trend_terms (domain, velocity desc nulls last)
  where matched_entity_slug is null;

comment on table public.trend_observations is
  'Daily snapshots from the trend feeds. Written by scripts/ingest-trends.mjs; the history that makes velocity computable.';
comment on table public.trend_terms is
  'Rolled-up verdict per term. velocity is NULL until two windows of observations exist - it is never estimated.';
