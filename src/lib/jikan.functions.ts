import { createServerFn } from "@tanstack/react-start";
import {
  fetchAnimeEnrichment,
  fetchCharacterEnrichment,
  fetchSeasonNow,
} from "./jikan.server";

/** Live MAL/Jikan metadata for an anime page. Resolves to null on any failure. */
export const getAnimeEnrichment = createServerFn({ method: "GET" })
  .validator((input: { title: string; year?: number }) => input)
  .handler(async ({ data }) => fetchAnimeEnrichment(data.title, data.year));

/** Live MAL/Jikan profile for a character page. Resolves to null on any failure. */
export const getCharacterEnrichment = createServerFn({ method: "GET" })
  .validator((input: { name: string }) => input)
  .handler(async ({ data }) => fetchCharacterEnrichment(data.name));

/** Currently airing season list for the /seasonal hub. */
export const getSeasonNow = createServerFn({ method: "GET" }).handler(async () =>
  fetchSeasonNow(),
);
