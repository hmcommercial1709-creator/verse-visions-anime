-- Structured extras for catalog rows, and the derived facts computed from them.
--
-- public.entities is deliberately narrow: slug, name, description, image_url,
-- categories, source. That is enough to list a title and not much else, which
-- is why the generated detail pages read thin — there is nothing else stored
-- to render.
--
-- One jsonb column carries the rest rather than a dozen typed columns, because
-- the shape differs per source (an anime has studios, seasons and episode
-- counts; a game has platforms and a release date) and because the derived
-- block is computed, versioned with the ingest script, and read whole. Adding
-- a field to it must never require a migration.
--
-- What goes in:
--   meta.*          facts as the source published them (score, episodes,
--                   studios, tags with their rank percentages, relations,
--                   characters)
--   meta.derived.*  facts COMPUTED across the whole catalog by
--                   scripts/derive-facts.mjs — genre placement, studio cohort,
--                   season cohort, length against the genre median, the
--                   franchise chain and the nearest titles by shared tags.
--                   These exist nowhere else, because no one else holds this
--                   exact collection, and they are what stops an imported
--                   catalog from being a duplicate of its source.
--
-- Nullable with no default: rows ingested before this column existed stay
-- valid and simply render without the extra sections.

alter table public.entities
  add column if not exists metadata jsonb;

comment on column public.entities.metadata is
  'Source-published extras plus derived cross-catalog facts. Written by scripts/ingest-anilist.mjs; see scripts/derive-facts.mjs for the derived block.';

-- The publishable (anon) role reads catalog rows through the existing
-- active_catalog_read policy, which is row-level. Column access is granted
-- separately, so without this GRANT the new column is simply invisible to the
-- site — and, because the client selects columns by name, every catalog query
-- naming it would fail rather than degrade.
grant select (metadata) on public.entities to anon, authenticated;

-- Lets a listing filter on the derived block without scanning every row.
-- Not CONCURRENTLY: this file is applied through the SQL editor, where a
-- transaction is always open and CONCURRENTLY is rejected outright.
create index if not exists entities_metadata_gin
  on public.entities using gin (metadata jsonb_path_ops);
