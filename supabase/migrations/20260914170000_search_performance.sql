-- Google Search Console performance, stored per day so movement can be
-- measured rather than guessed.
--
-- Everything upstream of this file is a prediction: trend feeds say what the
-- world is searching for, and the opportunity score says what that might be
-- worth. This table is the only place the site learns what actually happened —
-- which pages Google shows, for which queries, at what position, and whether
-- anyone clicked.
--
-- That makes it the input to the highest-value action in search: improving a
-- page that already ranks 5-20. Such a page has proven it can rank; moving it
-- up a few places is a far better use of a day than a new page that has proven
-- nothing. Without stored history there is no way to tell a page climbing from
-- a page falling, and both look identical in a single export.
--
-- Two grains, because the decisions differ:
--   search_page_stats   per page per day  -> which pages to work on
--   search_query_stats  per page+query    -> what that work should say
--
-- Operational tables: no anon grant. Nothing here is rendered.

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

-- One row per page per day. A re-run corrects the day rather than stacking a
-- duplicate, which would double every impression count on any retry.
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

-- The striking-distance scan reads by position band across a date range.
create index if not exists search_query_stats_position
  on public.search_query_stats (observed_on desc, position);

-- The verdict per page, recomputed each run from the two tables above.
create table if not exists public.search_actions (
  page text primary key,

  -- Which play this page is queued for. One of:
  --   striking_distance  ranks 5-20; closest thing to free traffic
  --   ctr_gap            ranks well, few clicks; title and description work
  --   rising             gaining impressions; expand while it is moving
  --   declining          losing ground; diagnose before writing anything new
  --   unexpected_query   ranking for something the page was not written for
  action text not null,

  -- Why it was chosen, in the numbers that chose it. The plan asks for
  -- explainable recommendations; this is where the explanation lives.
  reason text not null,

  best_query text,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric,
  position numeric,

  -- Change against the previous window. Null on the first run, when there is
  -- no previous window to compare against - never zero, which would read as
  -- "measured, and flat".
  position_delta numeric,
  impressions_delta integer,

  priority numeric not null default 0,
  window_days integer not null,
  updated_at timestamptz not null default now()
);

create index if not exists search_actions_priority
  on public.search_actions (action, priority desc);

comment on table public.search_page_stats is
  'Per-page GSC performance by day. Written by scripts/ingest-gsc.mjs.';
comment on table public.search_query_stats is
  'Per-page-per-query GSC performance by day; the input to striking-distance and CTR-gap detection.';
comment on table public.search_actions is
  'One queued action per page, with the numbers that chose it. Recomputed each run.';
