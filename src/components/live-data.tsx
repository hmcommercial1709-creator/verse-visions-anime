import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAnimeEnrichment, getCharacterEnrichment } from "@/lib/jikan.functions";
import { Database, ExternalLink, Loader2 } from "lucide-react";

function Panel({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="my-10 rounded-2xl border border-border/60 bg-card/50 p-6">
      <div className="mb-4 flex items-center gap-2 text-primary">
        <Database className="h-4 w-4" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

function Fact({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

/**
 * Live database panel for an anime page: airing schedule, community scores,
 * legal streaming links, extended cast and the full episode directory.
 * Purely additive — the page is complete without it, and it silently hides
 * itself if the upstream database is unreachable.
 */
export function AnimeLiveData({
  title,
  year,
  slug,
}: {
  title: string;
  year?: number;
  slug: string;
}) {
  const fetcher = useServerFn(getAnimeEnrichment);
  const { data, isLoading } = useQuery({
    queryKey: ["jikan-anime", slug],
    queryFn: () => fetcher({ data: { title, year } }),
    staleTime: 6 * 60 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Panel title="Release schedule & live database">
        <Loading label="Loading airing schedule and community data…" />
      </Panel>
    );
  }
  if (!data) return null;

  return (
    <Panel title="Release schedule & live database">
      <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
        {data.image && (
          <img
            src={data.image}
            alt={`${title} key visual`}
            loading="lazy"
            decoding="async"
            width={140}
            height={210}
            className="w-full rounded-xl border border-border/60 object-cover"
          />
        )}
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Fact label="Aired" value={data.aired} />
            <Fact label="Broadcast" value={data.broadcast} />
            <Fact label="Season" value={data.season} />
            <Fact label="Runtime" value={data.duration} />
            <Fact
              label="Community score"
              value={data.score ? `${data.score}/10` : undefined}
            />
            <Fact
              label="Ratings"
              value={data.scoredBy ? data.scoredBy.toLocaleString() : undefined}
            />
            <Fact label="Rank" value={data.rank ? `#${data.rank}` : undefined} />
            <Fact label="Source" value={data.source} />
          </div>

          {data.synopsis && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">{data.synopsis}</p>
          )}
          {data.background && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{data.background}</p>
          )}

          {data.studios.length > 0 && (
            <div className="mt-4 text-sm">
              <span className="text-muted-foreground">Production: </span>
              {[...data.studios, ...data.producers].slice(0, 8).join(" · ")}
            </div>
          )}

          {data.streaming.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.streaming.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/20"
                >
                  {s.name} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {data.cast.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold">Character gallery & voice cast</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.cast.map((c) => (
              <div
                key={`${c.character}-${c.voiceActor ?? ""}`}
                className="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.character}
                    loading="lazy"
                    decoding="async"
                    width={225}
                    height={300}
                    className="mb-2 aspect-[3/4] w-full rounded-lg object-cover"
                  />
                )}
                <div className="truncate text-sm font-semibold">{c.character}</div>
                <div className="text-[11px] text-muted-foreground">{c.role}</div>
                {c.voiceActor && (
                  <div className="mt-1 truncate text-[11px] text-accent">CV: {c.voiceActor}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.episodes.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold">Full episode directory</h3>
          <div className="mt-3 max-h-96 overflow-y-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary/80 text-xs uppercase text-muted-foreground backdrop-blur">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Aired</th>
                </tr>
              </thead>
              <tbody>
                {data.episodes.map((e) => (
                  <tr key={e.number} className="border-t border-border/60">
                    <td className="p-2 text-muted-foreground">{e.number}</td>
                    <td className="p-2">
                      {e.title}
                      {e.filler && (
                        <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">
                          filler
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">
                      {e.aired ? new Date(e.aired).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Panel>
  );
}

/** Live profile panel for a character page: nicknames, VA credits, appearances. */
export function CharacterLiveData({ name }: { name: string }) {
  const fetcher = useServerFn(getCharacterEnrichment);
  const { data, isLoading } = useQuery({
    queryKey: ["jikan-character", name],
    queryFn: () => fetcher({ data: { name } }),
    staleTime: 6 * 60 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Panel title="Voice actors & appearances">
        <Loading label="Loading voice cast and appearance credits…" />
      </Panel>
    );
  }
  if (!data) return null;

  return (
    <Panel title="Voice actors & appearances">
      <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
        {data.image && (
          <img
            src={data.image}
            alt={name}
            loading="lazy"
            decoding="async"
            width={140}
            height={210}
            className="w-full rounded-xl border border-border/60 object-cover"
          />
        )}
        <div className="min-w-0">
          {data.nicknames.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {data.nicknames.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs"
                >
                  {n}
                </span>
              ))}
            </div>
          )}
          {data.about && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {data.about}
            </p>
          )}
          {data.favorites !== undefined && (
            <div className="mt-3 text-xs text-muted-foreground">
              {data.favorites.toLocaleString()} readers list this character as a favourite.
            </div>
          )}
        </div>
      </div>

      {data.voiceActors.length > 0 && (
        <div className="mt-6">
          <h3 className="font-display text-lg font-bold">Voice actors</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {data.voiceActors.map((v) => (
              <div
                key={`${v.name}-${v.language}`}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3 text-sm"
              >
                <span className="font-medium">{v.name}</span>
                <span className="text-xs text-muted-foreground">{v.language}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.appearances.length > 0 && (
        <div className="mt-6">
          <h3 className="font-display text-lg font-bold">Appearances</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {data.appearances.map((a) => (
              <li
                key={a.title}
                className="rounded-lg border border-border/60 bg-background/40 p-3 text-sm"
              >
                {a.title}
                {a.role && <span className="ml-2 text-xs text-muted-foreground">({a.role})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
