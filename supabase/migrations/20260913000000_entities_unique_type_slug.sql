-- public.entities keys on `id`, so an upsert targeting the slug had no
-- matching constraint and Postgres raised 42P10:
--   "there is no unique or exclusion constraint matching the ON CONFLICT
--    specification"
--
-- The natural key is (entity_type, slug), not slug alone. Catalog slugs are
-- shaped `{sourceId}-{title}` and both Jikan (mal_id) and FreeToGame (id)
-- issue small integers, so the same slug can legitimately arise from two
-- different sources. Scoping by entity_type keeps them distinct and matches
-- the type-scoped routes (/catalog/anime/... vs /catalog/games/...).
--
-- Existing duplicates will block this index. Find them first with:
--
--   select entity_type, slug, count(*)
--   from public.entities
--   group by entity_type, slug
--   having count(*) > 1;
--
-- CONCURRENTLY avoids taking a write lock on a populated table. It cannot
-- run inside a transaction block, so apply this statement on its own — if
-- your migration runner wraps statements in a transaction, drop the keyword.

create unique index concurrently if not exists entities_entity_type_slug_key
  on public.entities (entity_type, slug);
