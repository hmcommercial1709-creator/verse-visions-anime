import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

const platforms = [
  { name: "Crunchyroll", desc: "The largest global anime streaming service. Subs and dubs for most licensed anime released in the last decade." },
  { name: "Netflix", desc: "Aggressive licensing of tentpole hits like Chainsaw Man, plus original productions like Devilman Crybaby." },
  { name: "HIDIVE", desc: "Home of Sentai catalog titles including the Made in Abyss films and select Muse license." },
  { name: "Disney+", desc: "Exclusive home for Bleach: Thousand-Year Blood War internationally." },
  { name: "Max", desc: "Home to Studio Ghibli's international streaming catalog." },
  { name: "Amazon Prime Video", desc: "Selected exclusives including Vinland Saga Season 2." },
];

export const Route = createFileRoute("/streaming")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/streaming" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Where to Watch Anime — Streaming Platforms Guide · AnimeVerse" },
      { name: "description", content: "Compare anime streaming services: what's on Crunchyroll, Netflix, HIDIVE, Max, and Prime Video." },
      { property: "og:title", content: "Anime Streaming Platforms · AnimeVerse" },
      { property: "og:description", content: "Where to watch, compared." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/streaming" }],
  }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Streaming" }]} />
      <h1 className="font-display text-5xl font-bold">Anime streaming platforms</h1>
      <p className="mt-3 text-lg text-muted-foreground">The services that carry the anime you're looking for — compared side by side.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {platforms.map(p => (
          <div key={p.name} className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="font-display text-xl font-bold">{p.name}</div>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
