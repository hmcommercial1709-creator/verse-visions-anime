import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Gamepad2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import {
  gamivoUrl,
  hubLinks,
  sponsoredRel,
  type PlatformGuide,
} from "@/data/gaming-hub";

export function GamingHubPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#090d18] text-white">
      <header className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[#090d18]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_12%,rgba(236,72,153,.2),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(34,211,238,.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(244,123,37,.14),transparent_40%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-9 sm:px-6 lg:pb-20 lg:pt-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-slate-400"
          >
            <Link to="/" className="hover:text-cyan-300">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/store" className="hover:text-cyan-300">
              Store
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-slate-200">
              Gaming Hub
            </span>
          </nav>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-cyan-300">
            <Gamepad2 className="h-4 w-4" /> {eyebrow}
          </div>
          <h1 className="mt-6 max-w-5xl font-display text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={gamivoUrl("/store/gift-cards")}
              target="_blank"
              rel={sponsoredRel}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f47b25] px-6 py-3 font-black transition hover:bg-[#dd3b10]"
            >
              Browse current digital listings{" "}
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              to="/gaming-gift-cards"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 font-bold text-cyan-200 transition hover:bg-cyan-400/20"
            >
              Compare gaming gift cards <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <HubNavigation />
      <main>{children}</main>
      <HubConversionPanel />
    </div>
  );
}

export function HubNavigation() {
  return (
    <nav
      aria-label="Gaming resource pages"
      className="border-b border-white/10 bg-[#0e1422]"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hubLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function HubLinkGrid({ exclude }: { exclude?: string }) {
  return (
    <section
      aria-labelledby="continue-gaming-research"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20"
    >
      <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
        Keep researching
      </p>
      <h2
        id="continue-gaming-research"
        className="mt-3 font-display text-3xl font-black"
      >
        Connected Gaming Resource Guides
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {hubLinks
          .filter((item) => item.to !== exclude && item.to !== "/gaming-hub")
          .map(({ to, label, description, icon: Icon }) => (
            <article
              key={to}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6"
            >
              <Icon className="h-6 w-6 text-cyan-300" />
              <h3 className="mt-4 font-display text-xl font-bold">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
              <Link
                to={to}
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-300 hover:text-cyan-200"
              >
                Read the guide <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
      </div>
    </section>
  );
}

export function PlatformGrid({ platforms }: { platforms: PlatformGuide[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {platforms.map((platform) => (
        <article
          key={platform.name}
          className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111827] transition hover:-translate-y-1 hover:border-cyan-400/40"
        >
          <img
            src={platform.image}
            width="342"
            height="240"
            loading="lazy"
            decoding="async"
            alt={platform.imageAlt}
            className="aspect-[342/240] w-full object-cover"
          />
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-xl font-black">{platform.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {platform.summary}
            </p>
            <p className="mt-4 flex-1 rounded-xl border border-amber-400/20 bg-amber-400/[.06] p-3 text-sm leading-6 text-amber-100/80">
              {platform.regionRule}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={platform.marketplaceUrl}
                target="_blank"
                rel={sponsoredRel}
                className="inline-flex items-center gap-2 rounded-lg bg-[#f47b25] px-4 py-2 text-sm font-black"
              >
                View listings <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={platform.officialSupport}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2 py-2 text-sm font-bold text-cyan-300"
              >
                Official help <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SourceDisclosure({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[.055] p-5 text-sm leading-6 text-slate-300">
      <strong className="text-cyan-200">Source policy:</strong> {children}
    </aside>
  );
}

function HubConversionPanel() {
  return (
    <section className="border-t border-white/10 bg-[#0e1422]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#f47b25]/30 bg-[#111827] p-7 sm:p-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_100%_50%,rgba(244,123,37,.2),transparent_65%)]" />
          <div className="relative max-w-3xl">
            <ShieldCheck className="h-8 w-8 text-[#f47b25]" />
            <h2 className="mt-5 font-display text-3xl font-black">
              Research first. Verify the live listing. Then purchase.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              GameCastle explains platform and regional checks. GAMIVO shows
              current offers and handles payment, digital delivery, returns and
              support.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={gamivoUrl("/store/gift-cards")}
                target="_blank"
                rel={sponsoredRel}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f47b25] px-6 py-3 font-black"
              >
                Open GAMIVO catalog <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                to="/store"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-bold"
              >
                Back to GameCastle Store <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Affiliate disclosure: GameCastle may earn a commission from
              qualifying outbound links. No price, discount or stock claim is
              made unless it is visible on the linked marketplace page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
