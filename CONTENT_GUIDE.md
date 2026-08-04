# GameCastle Anime — Content Authoring Guide

This document is the source of truth for how editors add content to
GameCastle Anime without touching route files, SEO wiring, sitemap, search,
or the recommendation engine.

> The content engine is data-driven. If you add a record correctly, it
> automatically appears in the right routes, sitemap, search index,
> internal-linking graph, and recommendation rails.

---

## 1. Golden rules

- **Never fabricate.** No made-up ratings, awards, box-office numbers,
  streaming availability, staff credits, quotes, or user reviews. If
  we do not have a verified fact, we do not state it.
- **Never reproduce copyrighted scripts, subtitles, or long dialogue.**
  Episode recaps are original editorial. Quotes are short and
  attributed.
- **Never use placeholder authors, reviewers, or dates** to make a
  page look more authoritative than it is. GameCastle Anime publishes
  under one organisational byline — the GameCastle Anime Editorial Team
  (`EDITORIAL_DESK` in `src/data/articles.ts`). Do not add named staff
  profiles, job titles, former employers, or years-of-experience claims.
- **Everything must be verifiable before publish.** Credentials,
  metrics, scores, rating counts, dates, awards and streaming
  availability all need a source you can point to in the repo or an
  external citation. Scores are labelled as *editorial* judgement and
  are never presented as community or aggregated ratings; never emit
  `AggregateRating` / `Review` structured data unless the page shows a
  genuine, labelled editorial review. If you cannot verify a claim,
  soften it or cut it — do not invent support.
- **Draft first, publish deliberately.** Set `publicationStatus:
  "draft"` on any record that is not editorially complete. Drafts stay
  routable at their URL but are excluded from sitemap, search, and
  public rails.

---

## 2. Where content lives

| File | Owns |
|------|------|
| `src/data/animes.ts` | Anime records |
| `src/data/episodes.ts` | Episode records |
| `src/data/characters.ts` | Character records |
| `src/data/studios.ts` | Studio records |
| `src/data/genres.ts` | Genre records |
| `src/data/articles.ts` | News, reviews, editorial, guides + author profiles |
| `src/data/franchises.ts` | Franchises + watch-order guides |
| `src/data/arcs.ts` | Story arcs |
| `src/data/relationships.ts` | Directed character relationships |
| `src/data/rankings.ts` | Editorial rankings + comparisons |

Every read path in the app goes through `src/lib/content-registry.ts`.
Route files import from the registry — never from raw data — so
publication filtering is applied uniformly.

---

## 3. Slug and ID conventions

- Lowercase, kebab-case: `attack-on-titan`, `naruto-uzumaki`.
- Stable forever. Never rename a slug after publishing — instead,
  mark the record archived and create a new one.
- Slugs are unique within their collection. Cross-collection
  duplicates (e.g. an anime and a character sharing a slug) are fine.

Run `bun run scripts/validate-content.ts` to catch duplicates.

---

## 4. Publication status

Optional field on any record:

```ts
publicationStatus?: "draft" | "review" | "published" | "archived";
```

- Missing / undefined → treated as `published` (backwards compatible
  with existing seed data).
- `draft` / `review` → NOT included in sitemap, search, catalog
  listings, or public recommendation rails. Direct URL still renders.
- `archived` → same as draft, plus signals the record is retired.

---

## 5. Editorial quality metadata

Optional but strongly encouraged on long-form editorial content:

```ts
editorialReview?: boolean;
factChecked?: boolean;
spoilerLevel?: "none" | "minor" | "major" | "ending";
publishedAt?: string;    // ISO date
updatedAt?: string;      // ISO date
reviewer?: string;       // author slug
sources?: { label: string; url?: string }[];
imageAttribution?: string;
```

Only set `editorialReview: true` or `factChecked: true` when a real
person actually did the work.

---

## 6. Spoilers

Wrap spoiler-heavy passages in the `<Spoiler />` component:

```tsx
import { Spoiler } from "@/components/spoiler";

<Spoiler level="major" scope="Shibuya arc">
  <p>…spoiler paragraph…</p>
</Spoiler>
```

Episode recaps are allowed to contain spoilers by nature — the recap
page carries a top-of-page warning; individual reveals inside earlier
articles should be gated.

---

## 7. Relationships

Character-to-character links live in `src/data/relationships.ts`. They
are **directional**: adding an edge from `A → B` with kind `mentor`
does not automatically add `B → A` with kind `student`. Add both if
both directions are meaningful.

Only add relationships that are canonical in the source material. Do
not infer relationships from fan wikis.

---

## 8. Adding a new anime

1. Add an entry to `src/data/animes.ts`.
2. Confirm the `studio` slug exists in `src/data/studios.ts`.
3. Confirm every `genres[]` slug exists in `src/data/genres.ts`.
4. Add or reference character slugs in `src/data/characters.ts`.
5. Run `bun run scripts/validate-content.ts`.

The anime page, catalog listing, genre pages, studio page,
recommendation rails, search index, and sitemap all update
automatically.

---

## 9. Adding a new episode

1. Add an entry to `src/data/episodes.ts` with `animeSlug` matching an
   existing anime.
2. `number` is the episode number and must be unique within its anime.
3. Write an original recap. **Do not paste subtitles or scripts.**
4. Fill `majorEvents`, `characterDevelopment`, `themes`, `trivia`.
5. Populate `connectionsPrev` / `connectionsNext` to build the
   internal-link graph between episodes.
6. Add `related` entries pointing at existing character / anime /
   article slugs — these appear in the "Continue reading" rail.

---

## 10. Adding a new character

1. Add to `src/data/characters.ts` with `anime` matching an existing
   anime slug.
2. Add any known relationships to `src/data/relationships.ts`.
3. If the character has arc-level significance, list them in the
   relevant `storyArcs[].characters` in `src/data/arcs.ts`.

---

## 11. Adding a new article

1. Add to `src/data/articles.ts`.
2. `author` slug must exist in the `authors` export of the same file.
3. `related` slugs must reference existing anime.
4. `section` drives which section index the article appears in.

---

## 12. Adding a new ranking

1. Add to `src/data/rankings.ts`.
2. Only reference published anime / character / article slugs.
3. Editorial rankings must be labelled as such in copy — never present
   as absolute review scores or user-voted results.

---

## 13. Adding a new watch order or franchise

1. Add the franchise to `src/data/franchises.ts` with every entry
   (main series, sequels, movies, OVAs, specials) and both
   chronological and release orderings.
2. Add one or more `watchOrders` referencing the franchise slug and
   describing the audience (`beginner`, `chronological`, `release`,
   `completionist`).
3. Mark optional entries with `optional: true` and add a `note`.

---

## 14. How recommendations are calculated

See `src/lib/recommendations.ts`. In summary:

- **Anime rec:** curated `similar` list, then weighted overlap on
  genres + studio + themes + shared characters.
- **Article rec:** shared related-anime tags, shared section, shared
  metadata tags.
- **Character rec:** same anime, then shared personality traits.

You do not manage recommendations directly — they emerge from the
underlying data. To improve them, improve the underlying tags.

---

## 15. Validation before publishing

```bash
bun run scripts/validate-content.ts
```

The script prints stats and reports:

- duplicate slugs (error)
- missing references — unknown studio / genre / character / anime
  (error or warning depending on severity)
- duplicate episode numbers within one anime (error)
- unreferenced relationships (error)
- broken article → anime links (warning)

The command exits non-zero on any error-level issue so it can be
wired into CI.

Additionally, run:

```bash
bun run build
```

to confirm every generated route (including sitemap) compiles.

---

## 16. What NOT to do

- Do not add empty sections to make a page look longer. The templates
  gracefully hide missing sections; a blank heading is worse than a
  missing one.
- Do not use "coming soon" placeholders on published pages.
- Do not seed characters or episodes without a matching anime record.
- Do not remove or rename `publicationStatus` on records that other
  routes / rails rely on being filtered.
- Do not commit fabricated ratings, awards, or user reviews.
- Do not paste copyrighted scripts, subtitles, promotional artwork,
  or licensed images.

---

## 17. Recommended next passes

- Migrate free-text `themes[]` on anime into a shared `themes.ts`
  taxonomy so theme-based filtering has a stable slug set.
- Add per-image licensing metadata (`imageAttribution`) once real
  imagery is added.
- Introduce localised copy under a `translations` submodule on each
  record — the routing shell for that is intentionally out of scope
  for this pass.
