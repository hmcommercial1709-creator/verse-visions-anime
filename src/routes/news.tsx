import { createFileRoute, Link } from "@tanstack/react-router";
import { listArticles, type Article } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";
import { InfiniteArticleFeed } from "@/components/article-feed";
import { HeaderBannerAd, StickySidebarAd } from "@/components/ad-slot";

const TITLE = "Anime News";
const INTRO = "Studio announcements, licensing news, and the daily beat on the industry.";
const META = "The latest anime news — studios, licensing, streaming, and industry updates.";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { property: "og:url", content: "https://gamecastle.store/news" },
      { title: `${TITLE} · GameCastle Anime` },
      { name: "description", content: META },
      { property: "og:title", content: `${TITLE} · GameCastle Anime` },
      { property: "og:description", content: META },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/news" }],
  }),
  component: NewsIndex,
});

function NewsIndex() {
  const list: Article[] = listArticles("news");

  return (
    <div>
      <HeaderBannerAd />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: TITLE }]} />
        <h1 className="font-display text-5xl font-bold">{TITLE}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{INTRO}</p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {list.length > 0 ? (
              <InfiniteArticleFeed items={list} />
            ) : (
              <p className="text-muted-foreground">No stories published yet — check back soon.</p>
            )}
          </div>
          <aside className="hidden lg:block">
            <StickySidebarAd unitId="av-news-rail" />
          </aside>
        </div>
      </div>
    </div>
  );
}
