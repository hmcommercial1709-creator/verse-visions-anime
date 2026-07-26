import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileAnchorAd } from "@/components/ad-slot";
import { useLocaleDocumentSync } from "@/lib/i18n";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
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
          Something went wrong on our end. You can try refreshing or head back home.
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AnimeVerse — The Home of Anime Reviews, Guides & Culture" },
      { name: "description", content: "Discover the best anime with AnimeVerse: reviews, character deep-dives, watch orders, studio profiles, and long-form editorial from a fan-led editorial team." },
      
      { name: "author", content: "AnimeVerse Editorial" },
      { property: "og:site_name", content: "AnimeVerse" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#12081b" },
      { property: "og:title", content: "AnimeVerse — The Home of Anime Reviews, Guides & Culture" },
      { name: "twitter:title", content: "AnimeVerse — The Home of Anime Reviews, Guides & Culture" },
      { property: "og:description", content: "Discover the best anime with AnimeVerse: reviews, character deep-dives, watch orders, studio profiles, and long-form editorial from a fan-led editorial team." },
      { name: "twitter:description", content: "Discover the best anime with AnimeVerse: reviews, character deep-dives, watch orders, studio profiles, and long-form editorial from a fan-led editorial team." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9cd417b-e16a-4090-b662-44bab1f1acea/id-preview-1f3f96cb--de879c4f-dc90-4b0b-beba-7d068ab16cd3.lovable.app-1784963580036.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9cd417b-e16a-4090-b662-44bab1f1acea/id-preview-1f3f96cb--de879c4f-dc90-4b0b-beba-7d068ab16cd3.lovable.app-1784963580036.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap" },
      { rel: "preconnect", href: "https://pagead2.googlesyndication.com" },
      { rel: "dns-prefetch", href: "https://googleads.g.doubleclick.net" },
    ],

    scripts: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-LETSF76JTN",
      },

      {
        children:
          "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-LETSF76JTN');",
      },
      {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6422431093727588",
        crossOrigin: "anonymous",
      },

      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://gamecastle.store/#organization",
              name: "AnimeVerse",
              url: "https://gamecastle.store/",
              description:
                "AnimeVerse is an independent anime editorial publication covering reviews, character deep-dives, watch orders, studio profiles and long-form analysis.",
              email: "editors@animeverse.example",
            },
            {
              "@type": "WebSite",
              "@id": "https://gamecastle.store/#website",
              name: "AnimeVerse",
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
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useLocaleDocumentSync();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <div className="h-16 lg:hidden" aria-hidden />
        <MobileAnchorAd />
      </div>
    </QueryClientProvider>

  );
}
