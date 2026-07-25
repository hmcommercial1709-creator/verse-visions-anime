import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { ContactForm } from "@/components/contact-form";
import { Mail, Clock, ShieldCheck, MapPin } from "lucide-react";

const TITLE = "Contact AnimeVerse — Tips, Corrections & Partnerships";
const DESC =
  "Contact the AnimeVerse editorial team: story tips, corrections, article pitches, advertising partnerships, and copyright notices. Replies within two working days.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `${TITLE} · AnimeVerse` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://verse-visions-anime.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://verse-visions-anime.lovable.app/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: TITLE,
          description: DESC,
          url: "https://verse-visions-anime.lovable.app/contact",
        }),
      },
    ],
  }),
  component: ContactPage,
});

const desks = [
  { icon: Mail, tone: "text-primary", title: "Editorial & corrections", value: "editors@animeverse.example", note: "Story tips, factual corrections, review requests." },
  { icon: ShieldCheck, tone: "text-accent", title: "Advertising & partnerships", value: "partners@animeverse.example", note: "Media kit, sponsorships, affiliate programs." },
  { icon: MapPin, tone: "text-primary", title: "Copyright & DMCA", value: "dmca@animeverse.example", note: "Takedown notices and counter-notices." },
];

function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Contact" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Contact us</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        A real editor reads everything that arrives here. Tips, corrections, and pitches are all welcome — use the form
        below and pick the desk that fits, or email us directly.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-primary" />
        Typical reply time: two working days
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {desks.map((d) => (
          <div key={d.title} className="rounded-xl border border-border/60 bg-card/40 p-5">
            <d.icon className={`mb-2 h-5 w-5 ${d.tone}`} />
            <div className="font-semibold">{d.title}</div>
            <a href={`mailto:${d.value}`} className="mt-1 block break-all text-sm text-primary hover:underline">{d.value}</a>
            <p className="mt-2 text-sm text-muted-foreground">{d.note}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Send us a message</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        All fields are validated before sending. We never sell or share what you write here.
      </p>
      <div className="mt-5">
        <ContactForm />
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-card/30 p-6 text-sm text-muted-foreground">
        <h2 className="font-display text-lg font-bold text-foreground">Before you write</h2>
        <ul className="mt-3 space-y-2">
          <li>· Reporting an error in an article? Include the URL and, where possible, a source. Corrections are logged publicly in our <a href="/editorial-policy" className="text-primary hover:underline">editorial policy</a>.</li>
          <li>· AnimeVerse does not host, stream, or distribute episodes. We cannot provide download links or file requests.</li>
          <li>· Copyright holders should follow the formal process on our <a href="/dmca" className="text-primary hover:underline">DMCA &amp; Copyright Notice</a> page.</li>
        </ul>
      </div>
    </div>
  );
}
