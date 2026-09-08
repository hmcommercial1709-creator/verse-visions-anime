import { createServerFn } from "@tanstack/react-start";
import type { CatalogEntity } from "./entity-catalog";
import { loadEntityFromDb, loadEntitiesFromDb, loadEntityPageFromDb } from "./entity-catalog.server";

export const loadEntity = createServerFn({ method: "GET" })
  .validator((input: { kind: CatalogEntity["entity_type"]; slug: string }) => input)
  .handler(async ({ data }) => loadEntityFromDb(data.kind, data.slug));

export const loadEntities = createServerFn({ method: "GET" })
  .validator((input: { kind: CatalogEntity["entity_type"] }) => input)
  .handler(async ({ data }) => loadEntitiesFromDb(data.kind));

export const loadEntityPage = createServerFn({ method: "GET" })
  .validator((input: { kind: CatalogEntity["entity_type"]; page: number; pageSize?: number }) => input)
  .handler(async ({ data }) => loadEntityPageFromDb(data.kind, data.page, data.pageSize));
