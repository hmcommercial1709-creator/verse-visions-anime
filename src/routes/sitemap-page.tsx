import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { EXPLORE_PAGES } from "@/data/explore-pages";
import { storeProducts } from "@/data/store-products";
import {
  populatedCategorySlugs,
  populatedGenres,
  populatedStudios,
  publishedAnime,
  publishedArticles,
  publishedCharacters,
  publishedEpisodes,
} from "@/lib/content-registry";

import { partitionEntries, AR_ENTRIES, urlsetXml } from "@/lib/sitemap";
const STATIC_PAGES = partitionEntries("pages").map((entry) => entry.path);
const ARABIC_PAGES = [...new Set([
  ...AR_ENTRIES.map((entry) => entry.path),
  ...["pages", "anime"].flatMap((partition) =>
    [...urlsetXml(partitionEntries(partition as "pages" | "anime"), "ar").matchAll(/<loc>https:\/\/gamecastle.store([^<]+)<\/loc>/g)].map((match) => match[1])
  ),
])];

export const Route = createFileRoute("/sitemap-page")({
  head: () => ({
    meta: [
      { title: "HTML Sitemap · GameCastle Anime" },
      { name: "description", content: "A complete, crawlable directory of published pages on GameCastle Anime." },
      { property: "og:title", content: "Sitemap · GameCastle Anime" },
      { property: "og:description", content: "All published pages on GameCastle Anime." },
      { property: "og:url", content: "https://gamecastle.store/sitemap-page" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/sitemap-page" }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  const anime = publishedAnime();
  const articles = publishedArticles();
  const characters = publishedCharacters();
  const episodes = publishedEpisodes();
  const genres = populatedGenres();
  const studios = populatedStudios();
  const categories = populatedCategorySlugs();
  const animeTitles = new Map(anime.map((item) => [item.slug, item.title]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Sitemap" }]} />
      <h1 className="font-display text-4xl font-bold">HTML Sitemap</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
        A complete directory of published content. This crawlable HTML sitemap complements our XML sitemap and helps visitors and search engines reach deep pages.
      </p>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-2 xl:grid-cols-3">
        <Section title="Anime" count={anime.length}>
          {anime.map((item) => <SiteLink key={item.slug} href={`/anime/${item.slug}`} label={item.title} />)}
        </Section>
        <Section title="Episodes" count={episodes.length}>
          {episodes.map((episode) => (
            <SiteLink key={`${episode.animeSlug}-${episode.number}`} href={`/anime/${episode.animeSlug}/episode/${episode.number}`} label={`${animeTitles.get(episode.animeSlug) ?? titleCase(episode.animeSlug)} — Episode ${episode.number}: ${episode.title}`} />
          ))}
        </Section>
        <Section title="Articles" count={articles.length}>
          {articles.map((article) => <SiteLink key={article.slug} href={`/article/${article.slug}`} label={article.title} />)}
        </Section>
        <Section title="Characters" count={characters.length}>
          {characters.map((character) => <SiteLink key={character.slug} href={`/character/${character.slug}`} label={character.name} />)}
        </Section>
        <Section title="Genres" count={genres.length}>
          {genres.map((genre) => <SiteLink key={genre.slug} href={`/genre/${genre.slug}`} label={genre.name} />)}
        </Section>
        <Section title="Studios" count={studios.length}>
          {studios.map((studio) => <SiteLink key={studio.slug} href={`/studio/${studio.slug}`} label={studio.name} />)}
        </Section>
        <Section title="Categories" count={categories.length}>
          {categories.map((slug) => <SiteLink key={slug} href={`/category/${slug}`} label={titleCase(slug)} />)}
        </Section>
        <Section title="Explore" count={EXPLORE_PAGES.length}>
          {EXPLORE_PAGES.map((page) => <SiteLink key={page.slug} href={`/explore/${page.slug}`} label={page.en.title} />)}
        </Section>
        <Section title="Store" count={storeProducts.length}>
          {storeProducts.map((product) => <SiteLink key={product.slug} href={`/store/${product.slug}`} label={product.title} />)}
        </Section>
        <Section title="العربية" count={ARABIC_PAGES.length}>
          {ARABIC_PAGES.map((path) => <SiteLink key={path} href={path} label={titleCase(path.split("/").at(-1) || "العربية")} />)}
        </Section>
        <Section title="Pages" count={STATIC_PAGES.length}>
          {STATIC_PAGES.map((path) => <SiteLink key={path} href={path} label={path === "/" ? "Home" : titleCase(path.split("/").filter(Boolean).at(-1) ?? path)} />)}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {title} <span className="text-muted-foreground">({count})</span>
      </h2>
      <ul className="space-y-1">{children}</ul>
    </section>
  );
}

function SiteLink({ href, label }: { href: string; label: string }) {
  return <li><a href={href} className="text-sm text-foreground/85 hover:text-primary hover:underline">{label}</a></li>;
}

function titleCase(value: string) {
  return value.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
