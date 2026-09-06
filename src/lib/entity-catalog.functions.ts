import { createServerFn } from "@tanstack/react-start";
import type { CatalogEntity } from "./entity-catalog";
import { loadEntityFromDb, loadEntitiesFromDb } from "./entity-catalog.server";

export const loadEntity = createServerFn({ method: "GET" })
  .validator((input: { kind: CatalogEntity["entity_type"]; slug: string }) => input)
  .handler(async ({ data }) => loadEntityFromDb(data.kind, data.slug));

export const loadEntities = createServerFn({ method: "GET" })
  .validator((input: { kind: CatalogEntity["entity_type"] }) => input)
  .handler(async ({ data }) => loadEntitiesFromDb(data.kind));
