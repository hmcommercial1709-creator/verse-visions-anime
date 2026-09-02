-- Preserve exact rejected rows privately before removing them from publication tables.
create schema if not exists content_archive;
revoke all on schema content_archive from public, anon, authenticated;
create table content_archive.generated_pages_20260902 as
select * from public.generated_pages where content->>'generated' = 'true' and content->>'source' = 'AniList';
create table content_archive.seo_metadata_20260902 as
select s.* from public.seo_metadata s join content_archive.generated_pages_20260902 p on p.id=s.page_id;
revoke all on all tables in schema content_archive from public, anon, authenticated;
delete from public.generated_pages p using content_archive.generated_pages_20260902 a where p.id=a.id;

create table public.anime_content_drafts (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  source_id bigint not null,
  locale text not null default 'en' check(locale='en'),
  title text not null,
  canonical_path text not null,
  content jsonb not null,
  synopsis_hash text not null,
  completeness jsonb not null,
  status text not null check(status in ('needs_data','ready_for_review','approved','rejected','duplicate')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entity_id,locale),
  unique(source_id,locale),
  check(status <> 'approved' or (reviewed_by is not null and reviewed_at is not null
    and length(trim(coalesce(content->'editorial'->>'original_analysis',''))) >= 600))
);
create index anime_drafts_synopsis_hash_idx on public.anime_content_drafts(synopsis_hash);
create unique index anime_drafts_ready_synopsis_unique on public.anime_content_drafts(synopsis_hash)
where status in ('ready_for_review','approved');
alter table public.anime_content_drafts enable row level security;
revoke all on public.anime_content_drafts from public,anon,authenticated;
grant select,insert,update,delete on public.anime_content_drafts to service_role;
comment on table public.anime_content_drafts is 'Private factual dossiers. Completeness is not editorial approval. Never automatically indexed.';
