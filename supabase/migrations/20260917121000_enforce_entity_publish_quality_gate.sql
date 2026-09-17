-- Hard publish gate for every ingestion path.
-- Incomplete source records are retained, but can never remain publicly active.
-- This does not delete or archive games/products.

create or replace function public.enforce_entity_publish_quality_gate()
returns trigger
language plpgsql
as $$
declare
  reasons text[] := '{}';
begin
  if new.slug is null or btrim(new.slug) = '' then reasons := array_append(reasons, 'missing slug'); end if;
  if new.name is null or btrim(new.name) = '' then reasons := array_append(reasons, 'missing name'); end if;
  if new.description is null or char_length(btrim(new.description)) < 120 then reasons := array_append(reasons, 'summary under 120 chars'); end if;
  if new.image_url is null or new.image_url !~* '^https?://' then reasons := array_append(reasons, 'missing image'); end if;
  if new.categories is null or cardinality(new.categories) = 0 then reasons := array_append(reasons, 'no categories'); end if;

  if cardinality(reasons) > 0 then
    new.status := 'incomplete';
    new.metadata := coalesce(new.metadata, '{}'::jsonb) || jsonb_build_object(
      'publish_gate', jsonb_build_object(
        'passed', false,
        'reasons', reasons,
        'checked_at', now()
      )
    );
  elsif new.status = 'active' then
    new.metadata := coalesce(new.metadata, '{}'::jsonb) || jsonb_build_object(
      'publish_gate', jsonb_build_object(
        'passed', true,
        'reasons', '[]'::jsonb,
        'checked_at', now()
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_entities_publish_quality_gate on public.entities;
create trigger trg_entities_publish_quality_gate
before insert or update of slug, name, description, image_url, categories, status
on public.entities
for each row execute function public.enforce_entity_publish_quality_gate();

comment on function public.enforce_entity_publish_quality_gate() is 'Hard publish gate: incomplete entity data can never be stored as active. Failed records remain incomplete and are not deleted.';
