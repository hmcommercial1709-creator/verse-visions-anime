import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DeferredScripts } from "@/components/deferred-scripts";
import { PropellerConversion } from "@/components/propeller-conversion";
import { VisitorRewardTracker } from "@/components/visitor-reward-tracker";
import { useLocale, useLocaleDocumentSync } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "robots",
        content:
          "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      { title: "GameCastle Anime | Anime Guides & Watch Orders" },

      {
        name: "description",
        content:
          "Explore clear anime guides, watch orders, power systems, character abilities and timelines at GameCastle Anime.",
      },
      { name: "author", content: "GameCastle Anime Editorial" },
      { property: "og:site_name", content: "GameCastle Anime" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "monetag", content: "348a180a6837274a1caffc015dd1769f" },
      { name: "google-adsense-account", content: "ca-pub-6422431093727588" },
      { name: "p:domain_verify", content: "8000a4375c6a6d65c126359606bc05d7" },
      { name: "impact-site-verification", value: "56a2f44b-19f7-4598-a36d-9b8558aaee80" },

      { name: "theme-color", content: "#12081b" },
      {
        property: "og:title",
        content: "GameCastle Anime | Anime Guides & Watch Orders",
      },
      {
        name: "twitter:title",
        content: "GameCastle Anime | Anime Guides & Watch Orders",
      },
      {
        property: "og:description",
        content:
          "Explore clear anime guides, watch orders, power systems, character abilities and timelines at GameCastle Anime.",
      },
      {
        name: "twitter:description",
        content:
          "Explore clear anime guides, watch orders, power systems, character abilities and timelines at GameCastle Anime.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "preconnect",
        href: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev",
        crossOrigin: "anonymous",
      },
      {
        rel: "sitemap",
        type: "application/xml",
        title: "Sitemap",
        href: "https://gamecastle.store/sitemap.xml",
      },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "GameCastle Anime RSS Feed",
        href: "https://gamecastle.store/rss.xml",
      },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://gamecastle.store/#organization",
              name: "GameCastle Anime",
              url: "https://gamecastle.store/",
              description:
                "GameCastle Anime is an independent anime editorial publication covering reviews, character deep-dives, watch orders, studio profiles and long-form analysis.",
            },
            {
              "@type": "WebSite",
              "@id": "https://gamecastle.store/#website",
              name: "GameCastle Anime",
              url: "https://gamecastle.store/",
              inLanguage: "en",
              publisher: { "@id": "https://gamecastle.store/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://gamecastle.store/browse?q={query}",
                },
                "query-input": "required name=query",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang={locale.hrefLang} dir={locale.dir} className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useLocaleDocumentSync();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <SiteHeader />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <VisitorRewardTracker />
      <DeferredScripts />
      <PropellerConversion />
    </div>
  );
}
