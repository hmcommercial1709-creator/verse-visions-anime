# GameCastle Anime — SEO & Content Plan

Tracked keyword/content map for https://gamecastle.store.

**Rules for this file**

- No search-volume or difficulty numbers unless a named source is cited
  next to them. None are cited today, so none are stated.
- Priority reflects our own judgement of intent match and how complete the
  page already is — it is not a traffic forecast.
- `/browse` is the single canonical anime discovery experience. `/explore` permanently redirects to it and must never appear in sitemaps or navigation.
- Empty genre, studio, and editorial-category shelves are `noindex, follow` and excluded from discovery and XML sitemaps until they contain published items.
- English is the only generic indexable locale. Arabic exists only where a
  genuinely translated page exists (`/ar/anime` and the guides in
  `src/data/ar-guides.ts`). Untranslated locale paths are `noindex` and are
  not advertised in the sitemap or hreflang.
- Every row's URL must resolve on the live site. Do not add planned URLs
  here as if they exist.

---

## 1. Hubs

| URL | Primary intent | Primary keyword | Supporting terms | Cluster | Status | Next action |
|-----|----------------|-----------------|------------------|---------|--------|-------------|
| `/guides` | Informational — find a guide | anime guides | anime watch order guides, anime beginner guides, anime explained | Hub for watch-order + power-scaling + recap clusters | Live; cornerstone module added | Add a short "which guide do I need" intro block once we have more guide types |
| `/watch-order` | Navigational/informational — what order do I watch this in | anime watch order | anime watch order guide, [franchise] watch order, anime filler list | Watch-order cluster | Rebuilt as a real hub: contents nav, franchise sections from `franchises.ts`, movie/optional notes, quick season orders | Promote the strongest franchise sections into their own long-form guides, one at a time |
| `/power-scaling` | Informational — how does this power system work | anime power systems explained | anime abilities explained, anime power scaling, [series] power system | Power-scaling cluster | Live; method + tiers + FAQ + 4 cornerstone cards | Add per-series methodology notes as ability articles land |
| `/characters` | Navigational — find a character | anime character profiles | anime character abilities, [character] abilities, [character] explained | Character cluster | Live | Link each profile back to its series' power-system guide |
| `/browse` | Navigational — browse the library | anime series list | anime hub, [anime] guide | Series-hub cluster | Live | Ensure each series hub links its own watch order + power-system guides |
| `/anime/$slug` | Navigational — series hub | [anime] guide | [anime] characters, [anime] watch order, [anime] arcs, [anime] power system | Series-hub cluster | Live template | Keep the internal-link block pointing to the matching cornerstone guides |

---

## 2. Cornerstone pages (priority order)

Source of truth for these links: `src/lib/cornerstones.ts`.

| URL | Primary intent | Primary keyword | Supporting terms | Cluster | Status | Next action |
|-----|----------------|-----------------|------------------|---------|--------|-------------|
| `/article/jujutsu-kaisen-watch-order-and-manga-jump` | Transactional-informational — what to watch next | jujutsu kaisen watch order | jjk watch order, where to start jjk manga, jujutsu kaisen 0 order | Watch-order | Optimised (quick answer, order table, FAQ schema) | Link from the JJK series hub and the Shibuya timeline |
| `/article/attack-on-titan-complete-watch-order` | Informational | attack on titan watch order | aot season order, aot final season parts | Watch-order | Live long-form | Add a numbered order table matching the JJK guide's format |
| `/article/solo-leveling-system-progression-explained` | Informational | solo leveling system explained | solo leveling stats, jinwoo levels, daily quest penalty | Power-scaling | Optimised (quick answer, FAQ schema) | Cross-link to the Solo Leveling series hub |
| `/article/gojo-satoru-limitless-technique-explained` | Informational | gojo limitless explained | infinity technique, hollow purple, cursed technique lapse | Power-scaling | Live long-form | Add an explicit mechanics table |
| `/article/hunter-x-hunter-nen-strategy-rules` | Informational | hunter x hunter nen explained | nen types, nen categories, nen abilities | Power-scaling | Optimised (quick answer, category table, FAQ schema) | Link from Gon and Killua profiles |
| `/article/dr-stone-science-tech-tree-guide` | Informational | dr stone inventions list | dr stone all inventions, senku inventions, dr stone tech tree | Power-scaling | Optimised (quick answer, invention table, FAQ schema) | Keep the spoiler gates on late-story builds |
| `/article/one-piece-wano-recap` | Informational | one piece wano recap | wano arc summary, wano ending explained | Recap | Optimised long-form | Link to the One Piece series hub arc list |
| `/article/shibuya-incident-timeline` | Informational | shibuya incident timeline | shibuya arc order, jjk shibuya explained | Recap | Live long-form | Cross-link to the JJK watch order and Gojo guide |

---

## 3. Internal linking model

```text
/guides ─────┬──> /watch-order ──> franchise sections ──> /anime/$slug
             ├──> /power-scaling ──> ability guides ────> /character/$slug
             └──> cornerstone guides (8)
```

- Each hub links the other two, in body copy, not only in a footer list.
- Cornerstone guides link back to their hub and to their series hub.
- Anchors vary per placement. No repeated exact-match anchor blocks.

---

## 4. Deliberately out of scope

- Bulk page generation. New pages only where the repo already holds
  verifiable material.
- Multilingual expansion beyond the existing Arabic cornerstone edition.
- FAQ schema on pages without visible Q&A.
- Any `AggregateRating` / `Review` markup. We do not collect community
  ratings, so we do not emit rating counts. Scores shown on the site are
  labelled editorial scores.
