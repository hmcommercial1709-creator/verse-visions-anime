-- game_nexus_matrix backs the public /games archive, the homepage "Latest
-- Game Codes" preview, and /$locale/codes/$slug detail pages. Unlike
-- public.entities, this table had no tracked RLS policy or grant, so
-- whether anon/authenticated could read it at all depended on whatever was
-- clicked together outside migrations — the likely cause of empty
-- Games results in production. Mirrors the entities pattern: RLS on,
-- anon/authenticated get SELECT on public-safe columns only.
alter table public.game_nexus_matrix enable row level security;
revoke all on public.game_nexus_matrix from anon, authenticated;
grant select (
  slug,
  title,
  target_language,
  target_market,
  aggregate_rating,
  reviews_count,
  sample_review,
  updated_at
) on public.game_nexus_matrix to anon, authenticated;
create policy game_nexus_matrix_public_read on public.game_nexus_matrix
  for select to anon, authenticated using (true);
