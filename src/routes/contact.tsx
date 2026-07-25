import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { Mail, Twitter, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AnimeVerse — Tips, Corrections & Business · AnimeVerse" },
      { name: "description", content: "Contact the AnimeVerse editorial team for tips, corrections, PR pitches, and business inquiries." },
      { property: "og:title", content: "Contact AnimeVerse" },
      { property: "og:description", content: "Reach the editorial team." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Contact" }]} />
      <h1 className="font-display text-5xl font-bold">Get in touch</h1>
      <p className="mt-3 text-lg text-muted-foreground">Tips, corrections, and pitches all welcome. Business inquiries answered within two working days.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card/40 p-5"><Mail className="h-5 w-5 text-primary mb-2" /><div className="font-semibold">Editorial</div><div className="text-sm text-muted-foreground">editors@animeverse.example</div></div>
        <div className="rounded-xl border border-border/60 bg-card/40 p-5"><Mail className="h-5 w-5 text-accent mb-2" /><div className="font-semibold">Business</div><div className="text-sm text-muted-foreground">partners@animeverse.example</div></div>
        <div className="rounded-xl border border-border/60 bg-card/40 p-5"><MapPin className="h-5 w-5 text-gold mb-2" /><div className="font-semibold">HQ</div><div className="text-sm text-muted-foreground">Tokyo · Los Angeles</div></div>
      </div>
      <form className="mt-10 space-y-4 rounded-2xl border border-border/60 bg-card/40 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="rounded-lg bg-input/60 border border-border px-4 py-2.5 text-sm" placeholder="Your name" />
          <input className="rounded-lg bg-input/60 border border-border px-4 py-2.5 text-sm" placeholder="Email" type="email" />
        </div>
        <input className="w-full rounded-lg bg-input/60 border border-border px-4 py-2.5 text-sm" placeholder="Subject" />
        <textarea rows={6} className="w-full rounded-lg bg-input/60 border border-border px-4 py-2.5 text-sm" placeholder="Message" />
        <button type="button" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary">Send message</button>
      </form>
    </div>
  ),
});
