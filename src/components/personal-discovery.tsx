import { useEffect, useMemo, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { publishedAnime, publishedArticles } from '@/lib/content-registry';
import { AR_GUIDES } from '@/data/ar-guides';
import { parseSaved, rankDiscovery, SAVED_LIMIT, type DiscoveryItem } from '@/lib/discovery-model';
import { MediaImage } from '@/components/media';
import { posterFor, backdrops, type MediaArt } from '@/lib/media';
import { TRAILERS } from '@/data/trailers';
import { Play } from 'lucide-react';

const KEY = 'gamecastle.saved-reading.v1';
const items: DiscoveryItem[] = [
  ...publishedAnime().map(a => ({path: `/anime/${a.slug}`, title: a.title, description: a.tagline,
    topics: [a.slug, ...a.genres], locale: 'en' as const})),
  ...publishedArticles().map(a => ({path: `/article/${a.slug}`, title: a.title, description: a.excerpt,
    topics: [...a.related, ...(a.tags ?? []), a.section], locale: 'en' as const})),
  ...[
    ['anime-games', 'Anime games', 'Find games connected to your favourite anime.', ['anime','games']],
    ['genshin-impact-ultimate-guide', 'Genshin Impact guide', 'Explore progression, teams and exploration guides.', ['games','adventure','fantasy']],
    ['honkai-star-rail-ultimate-guide', 'Honkai: Star Rail guide', 'Explore combat, progression and team-building guidance.', ['games','fantasy']],
    ['troubleshooting-performance', 'Game performance help', 'Find practical troubleshooting and performance guidance.', ['games','technology']],
  ].map(([slug,title,description,topics]) => ({path:`/gaming-hub/${slug}`,title:title as string,description:description as string,topics:topics as string[],locale:'en' as const})),
  ...AR_GUIDES.map(a => ({path: `/ar/anime/${a.slug}`, title:a.h1, description:a.metaDescription,
    topics: a.keywords, locale:'ar' as const})),
];
const allowed = new Set(items.map(item => item.path));
const anime = publishedAnime();
const gamingArt: Record<string,string> = {
  '/gaming-hub/anime-games':'/gaming-hub/anime-gaming-hub-2026/hero.webp',
  '/gaming-hub/genshin-impact-ultimate-guide':'/gaming-hub/genshin-impact-guide/hero.webp',
  '/gaming-hub/honkai-star-rail-ultimate-guide':'/gaming-hub/honkai-star-rail-guide/hero.webp',
  '/gaming-hub/troubleshooting-performance':'/gaming-hub/global-gaming-network/troubleshooting.webp',
};
function artwork(path: string): MediaArt {
  if (gamingArt[path]) return {src:gamingArt[path],srcSet:`${gamingArt[path]} 1280w`,width:1280,height:720};
  const englishPath = AR_GUIDES.find(g=>`/ar/anime/${g.slug}`===path)?.enPath ?? path;
  const slug = englishPath.startsWith('/anime/') ? englishPath.split('/')[2] :
    publishedArticles().find(a=>`/article/${a.slug}`===englishPath)?.related.find(s=>anime.some(a=>a.slug===s));
  return slug && anime.some(a=>a.slug===slug) ? posterFor(slug) : backdrops.trailer;
}

export function PersonalDiscovery({homeOnly=false}: {homeOnly?: boolean}) {
  const path = useRouterState({select: s => s.location.pathname});
  if (homeOnly !== (path === '/')) return null;
  const arabicAlias = path.startsWith('/ar/anime/') && !allowed.has(path)
    ? AR_GUIDES.find(guide => guide.enPath === path.replace('/ar/', '/')) : undefined;
  const contentPath = arabicAlias ? `/ar/anime/${arabicAlias.slug}` : path;
  // Reset per-route pagination without changing browser history.
  return <DiscoveryPanel key={path} path={contentPath} />;
}
function DiscoveryPanel({path}: {path:string}) {
  const ar = path === '/ar' || path.startsWith('/ar/');
  const [saved, setSaved] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [storageFailed, setStorageFailed] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  useEffect(() => {
    try { setSaved(parseSaved(localStorage.getItem(KEY), allowed)); }
    catch { setStorageFailed(true); }
  }, []);
  const ranked = useMemo(() => rankDiscovery(items,path,saved,ar?'ar':'en'),[path,saved,ar]);
  const current = items.find(item => item.path === path);
  const videoCandidates = [current,...ranked].filter((item): item is DiscoveryItem => Boolean(item))
    .map(item => {
      const englishPath = AR_GUIDES.find(g=>`/ar/anime/${g.slug}`===item.path)?.enPath ?? item.path;
      const slug = englishPath.startsWith('/anime/') ? englishPath.split('/')[2] : '';
      return {item, id:TRAILERS[slug]};
    }).filter(video=>video.id).slice(0,2);
  const savedItems = items.filter(item => saved.includes(item.path) && item.locale === (ar?'ar':'en'));
  const hub = ['/', '/browse', '/gaming-hub', '/ar', '/ar/anime'].includes(path);
  if (!current && !hub) return null;
  function persist(next: string[]) {
    setSaved(next); setOffset(0);
    try { localStorage.setItem(KEY, JSON.stringify(next)); setStorageFailed(false); }
    catch { setStorageFailed(true); }
  }
  return <section className="mx-auto my-10 w-full max-w-7xl rounded-2xl border border-border bg-card/60 p-5 sm:p-8" dir={ar?'rtl':'ltr'} aria-label={ar?'اكتشف ما يناسبك':'Discover your next read'} style={{contentVisibility:'auto',containIntrinsicSize:'auto 800px'}}>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="font-display text-2xl font-bold">{ar?'رحلتك التالية':'Your next discovery'}</h2>
      {current && <button className="rounded-lg border border-primary px-4 py-2 text-sm" type="button" aria-pressed={saved.includes(path)} onClick={() => persist(saved.includes(path) ? saved.filter(p => p !== path) : [path,...saved].slice(0,SAVED_LIMIT))}>
        {saved.includes(path) ? (ar?'إزالة من المحفوظات':'Remove from saved') : (ar?'احفظ للعودة لاحقًا':'Save for later')}
      </button>}
    </div>
    <p className="mt-2 text-sm text-muted-foreground">{ar?'اقتراحات من المحتوى المنشور حسب الصفحة الحالية وما تحفظه. تُحفظ اختياراتك في هذا المتصفح فقط.':'Published reads selected from this page and your saved interests. Your choices stay in this browser; no account or tracking service needed.'}</p>
    {storageFailed && <p role="status" className="mt-2 text-sm">{ar?'تعذر الحفظ في المتصفح؛ ستبقى الاختيارات لهذه الصفحة فقط.':'Browser storage is unavailable; these choices will last only on this page.'}</p>}
    {savedItems.length > 0 && <div className="mt-5 rounded-lg bg-background/60 p-4">
      <h3 className="font-semibold">{ar?'قائمة قراءتك':'Your reading list'}</h3>
      <ul className="mt-2 flex flex-wrap gap-4">{savedItems.map(item => <li key={item.path}><a href={item.path} className="text-sm text-primary underline">{item.title}</a></li>)}</ul>
      <button type="button" className="mt-3 text-xs underline" onClick={() => persist([])}>{ar?'مسح المحفوظات والاهتمامات':'Clear saved reads and interests'}</button>
    </div>}
    <div className="mt-5 grid gap-4 sm:grid-cols-3" aria-live="polite">
      {ranked.slice(offset,offset+3).map(item => <a key={item.path} href={item.path} className="group overflow-hidden rounded-xl border border-border transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <MediaImage art={artwork(item.path)} alt={ar?'صورة توضيحية من GameCastle':'GameCastle editorial illustration'} ratio="16/9" sizes="(min-width:1280px) 380px, (min-width:640px) 30vw, 90vw" imgClassName="object-top transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" overlay={false} />
        <div className="p-5"><h3 className="font-semibold">{item.title}</h3><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
        <span className="mt-4 block text-sm text-primary">{ar?'تابع الاستكشاف ←':'Keep exploring →'}</span>
        </div>
      </a>)}
    </div>
    {ranked.length > 3 && <button type="button" className="mt-5 rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOffset(offset+3 >= ranked.length ? 0 : offset+3)}>{ar?'اقتراحات أخرى':'Show other suggestions'}</button>}
    {videoCandidates.length > 0 && <div className="mt-8 border-t border-border pt-6">
      <h3 className="font-display text-xl font-semibold">{ar?'عروض تشويقية تناسب اهتمامك':'Trailers picked for you'}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{ar?'اضغط للتشغيل. لا يُحمّل مشغّل الفيديو قبل اختيارك.':'Choose a trailer to play. Video players load only when you ask.'}</p>
      <div className="mt-4 grid gap-5 md:grid-cols-2">{videoCandidates.map(({item,id}) => <figure key={item.path} className="overflow-hidden rounded-xl border border-border">
        <div className="relative aspect-video bg-black">
          {playing===id ? <iframe className="absolute inset-0 h-full w-full border-0" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={item.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <>
            <MediaImage art={artwork(item.path)} alt={ar?'معاينة العرض التشويقي':'Trailer preview artwork'} ratio="16/9" sizes="(min-width:1280px) 570px, (min-width:768px) 45vw, 90vw" imgClassName="object-top" />
            <button type="button" aria-label={ar?`تشغيل عرض ${item.title}`:`Play trailer: ${item.title}`} onClick={()=>setPlaying(id)} className="absolute inset-0 grid place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"><Play className="h-7 w-7" aria-hidden="true" /></span>
            </button></>}
        </div>
        <figcaption className="flex items-center justify-between gap-4 p-4"><a href={item.path} className="font-semibold hover:text-primary">{item.title}</a>
          {playing===id && <button type="button" className="text-sm underline" onClick={()=>setPlaying(null)}>{ar?'إيقاف':'Stop'}</button>}
        </figcaption>
      </figure>)}</div>
    </div>}
  </section>;
}
