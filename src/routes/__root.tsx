import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { OFFERWALL_POLICY_SCRIPT } from "@/lib/offerwall-policy";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { LocaleRedirectGuard } from "@/components/locale-redirect-guard";
import { SiteFooter } from "@/components/site-footer";
import { DeferredScripts } from "@/components/deferred-scripts";
import { VisitorRewardTracker } from "@/components/visitor-reward-tracker";
import { useLocale, useLocaleDocumentSync } from "@/lib/i18n";

const SITE_URL = "https://gamecastle.store";
const SITE_NAME = "GameCastle Anime";

const SITE_TITLE =
  "GameCastle Anime | Anime Guides, Characters & Watch Orders";

const SITE_DESCRIPTION =
  "GameCastle Anime is a global English-language anime and entertainment guide covering anime stories, characters, episodes, watch orders, reviews, guides and more.";

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

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  const router = useRouter();


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
      {
        charSet: "utf-8",
      },

      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      {
        name: "robots",
        content:
          "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },

      {
        title: SITE_TITLE,
      },

      {
        name: "description",
        content: SITE_DESCRIPTION,
      },

      {
        name: "author",
        content: "GameCastle Anime Editorial",
      },

      {
        name: "publisher",
        content: SITE_NAME,
      },

      {
        name: "theme-color",
        content: "#12081b",
      },

      {
        property: "og:site_name",
        content: SITE_NAME,
      },

      {
        property: "og:type",
        content: "website",
      },

      {
        property: "og:title",
        content: SITE_TITLE,
      },

      {
        property: "og:description",
        content: SITE_DESCRIPTION,
      },

      {
        property: "og:url",
        content: `${SITE_URL}/`,
      },

      {
        name: "twitter:card",
        content: "summary_large_image",
      },

      {
        name: "twitter:title",
        content: SITE_TITLE,
      },

      {
        name: "twitter:description",
        content: SITE_DESCRIPTION,
      },

      {
        name: "google-adsense-account",
        content: "ca-pub-6422431093727588",
      },

      {
        name: "p:domain_verify",
        content: "8000a4375c6a6d65c126359606bc05d7",
      },

      {
        name: "impact-site-verification",
        content: "56a2f44b-19f7-4598-a36d-9b8558aaee80",
      },
    ],

    links: [
      // Canonicals belong to leaf routes. A root-level homepage canonical is
      // inherited by every page and conflicts with each route's own URL.
      {
        rel: "stylesheet",
        href: appCss,
      },

      {
        rel: "icon",
        href: "/favicon.svg?v=2",
        type: "image/svg+xml",
      },

      {
        rel: "icon",
        href: "/favicon-32x32.png?v=2",
        type: "image/png",
        sizes: "32x32",
      },

      {
        rel: "icon",
        href: "/favicon-16x16.png?v=2",
        type: "image/png",
        sizes: "16x16",
      },

      {
        rel: "shortcut icon",
        href: "/favicon.ico?v=2",
        type: "image/x-icon",
      },

      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png?v=2",
        sizes: "180x180",
      },

      {
        rel: "manifest",
        href: "/site.webmanifest?v=2",
      },

      {
        rel: "preconnect",
        href: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev",
        crossOrigin: "anonymous",
      },

      {
        rel: "sitemap",
        type: "application/xml",
        title: "Sitemap",
        href: `${SITE_URL}/sitemap.xml`,
      },

      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "GameCastle Anime RSS Feed",
        href: `${SITE_URL}/rss.xml`,
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

              "@id": `${SITE_URL}/#organization`,

              name: SITE_NAME,

              url: `${SITE_URL}/`,

              description:
                "GameCastle Anime is an independent English-language anime and entertainment publication covering reviews, character deep-dives, watch orders, studio profiles, episode guides and long-form analysis.",
            },

            {
              "@type": "WebSite",

              "@id": `${SITE_URL}/#website`,

              name: SITE_NAME,

              url: `${SITE_URL}/`,

              inLanguage: "en",

              publisher: {
                "@id": `${SITE_URL}/#organization`,
              },

              potentialAction: {
                "@type": "SearchAction",

                target: {
                  "@type": "EntryPoint",

                  urlTemplate: `${SITE_URL}/browse?q={query}`,
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
    <html
      lang={locale.hrefLang}
      dir={locale.dir}
      className="dark"
    >
      <head>
        <script id="gamecastle-offerwall-policy" dangerouslySetInnerHTML={{ __html: OFFERWALL_POLICY_SCRIPT }} />
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
      <LocaleRedirectGuard />

      <div className="sticky top-0 z-50">
        <SiteHeader />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />

      <VisitorRewardTracker />


      <DeferredScripts />

    </div>
  );
}
