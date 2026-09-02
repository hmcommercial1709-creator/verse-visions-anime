# Content generation repair — 2026-09-02

## Verified cause

- 8,815 generated rows represented only 1,763 distinct payloads when `page_type` was removed: five labels per anime, not five articles.
- The Cloudflare application does not render `generated_pages`; its sitemaps use the published editorial registry. Database insertion is not website publication.
- Supabase `import-anime` v6 ran every five minutes and reintroduced `gamecastle.example` canonicals, `indexable: true`, and a fixed quality score of 85. A one-time database cleanup could not fix that source.
- 570 entity descriptions were generic fallback promises rather than real synopses.

## Changes

- Exact copies of all 8,815 generated rows and 8,815 associated SEO rows were stored in the private `content_archive` schema before removal from publication tables. Original entities and source records remain. No legitimate editorial route was deleted.
- Edge Function v8 writes one private English dossier per source/entity to `anime_content_drafts`. It never writes publication or sitemap rows.
- The query now includes character roles, franchise relations and official/streaming links. It processes ten titles per existing scheduled run, prioritizing popularity rather than sparse newest entries.
- Missing text is not replaced with SEO filler. Incomplete records remain `needs_data`; sufficiently complete records are `ready_for_review`, not published.
- Duplicate synopsis hashing, source/entity uniqueness and a partial unique index prevent duplicate ready dossiers. Previously reviewed work is preserved.
- Approval requires reviewer identity, review timestamp and original analysis; completeness alone does not establish quality or promise Google indexing.
- Source attribution and checking timestamps are retained. Franchise relationships are not misrepresented as viewing order, nor are source summaries presented as our original reviews.
- Draft internal links are drawn from the real published anime manifest. Matching existing editorial titles reuse their canonical path. CI detects a stale manifest.
- The website gains a lightweight, bilingual discovery panel: current-topic/saved-interest recommendations, a local reading list, clearing controls and more suggestions. No additional API, images, videos or third-party tracker is introduced.

## Verification

- First two live v7 batches: HTTP 200, 20 dossiers, 12 ready for review, 8 needing data, zero generated/publication pages. v8 adds validated editorial links.
- Cron was paused during replacement and restored after the live test.
- TypeScript, targeted ESLint, quality/discovery tests, locale/reward tests, Offerwall consent tests and the Cloudflare production build pass locally.

## Deliberate limits

No 8,815-page bulk release, fake translations, unverified episode lists, invented reviews, forced engagement, keyword stuffing or promise of global rankings. Strong original editorial content and future approved-page rendering remain separate work; drafts are not public pages. No numeric speed or Core Web Vitals claim is made without field measurement.
