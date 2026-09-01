import { useState, useMemo, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { Search, X, Star } from "lucide-react";
import { publishedAnime, populatedGenres, publishedCharacters, populatedStudios } from "@/lib/content-registry";

const animes = publishedAnime();
const genres = populatedGenres();
const characters = publishedCharacters();
const studios = populatedStudios();

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { anime: animes.slice(0, 6), genre: genres.slice(0,6), character: characters.slice(0,4), studio: studios.slice(0,4) };
    return {
      anime: animes.filter(a => a.title.toLowerCase().includes(term) || a.tagline.toLowerCase().includes(term)).slice(0, 8),
      genre: genres.filter(g => g.name.toLowerCase().includes(term)).slice(0, 6),
      character: characters.filter(c => c.name.toLowerCase().includes(term)).slice(0, 6),
      studio: studios.filter(s => s.name.toLowerCase().includes(term)).slice(0, 4),
    };
  }, [q]);

  const resultCount = Object.values(results).reduce((total, items) => total + items.length, 0);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-background/95" />
      <Dialog.Content aria-describedby={undefined} className="fixed inset-x-0 top-4 z-[80] mx-auto max-w-2xl px-4 sm:top-20">
        <Dialog.Title className="sr-only">Search GameCastle</Dialog.Title>
        <div className="overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              aria-label="Search anime, characters, genres, studios"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search anime, characters, genres, studios…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <button aria-label="Close search" onClick={() => onOpenChange(false)} className="rounded p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto p-4 space-y-6">
            {resultCount === 0 && <p role="status" className="py-8 text-center text-muted-foreground">No results found. Try another title, character, genre or studio.</p>}
            {results.anime.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Anime</div>
                <ul className="space-y-1">
                  {results.anime.map(a => (
                    <li key={a.slug}>
                      <Link to="/anime/$slug" params={{ slug: a.slug }} onClick={() => onOpenChange(false)} className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary">
                        <div className="h-10 w-8 shrink-0 rounded" style={{ background: a.cover }} />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{a.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{a.year} · {a.status} · {a.episodes} eps</div>
                        </div>
                        <div className="flex items-center gap-1 text-gold text-xs"><Star className="h-3 w-3 fill-current" />{a.rating}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.character.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Characters</div>
                <ul className="grid grid-cols-2 gap-1">
                  {results.character.map(c => (
                    <li key={c.slug}>
                      <Link to="/character/$slug" params={{ slug: c.slug }} onClick={() => onOpenChange(false)} className="block rounded-md p-2 hover:bg-secondary">
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.role}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.genre.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Genres</div>
                <div className="flex flex-wrap gap-1.5">
                  {results.genre.map(g => (
                    <Link key={g.slug} to="/genre/$slug" params={{ slug: g.slug }} onClick={() => onOpenChange(false)}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs hover:border-primary hover:text-primary">
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.studio.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Studios</div>
                <ul className="grid grid-cols-2 gap-1">
                  {results.studio.map(s => (
                    <li key={s.slug}>
                      <Link to="/studio/$slug" params={{ slug: s.slug }} onClick={() => onOpenChange(false)} className="block rounded-md p-2 hover:bg-secondary text-sm">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground flex justify-between">
            <span>Press ⌘K or / to open anywhere</span>
            <span>ESC to close</span>
          </div>
        </div>
      </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
