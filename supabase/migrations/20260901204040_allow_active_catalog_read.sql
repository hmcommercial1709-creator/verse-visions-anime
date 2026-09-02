alter table public.entities enable row level security;
revoke all on public.entities from anon, authenticated;
grant select (slug, name, description, image_url, entity_type, status, source_name, source_url) on public.entities to anon, authenticated;
create policy active_catalog_read on public.entities for select to anon, authenticated using (status = 'active');
