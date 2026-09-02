// Factual dossiers, not fabricated reviews or five keyword variants of one synopsis.
export const GENERATOR_VERSION = 2;
export function cleanText(value) {
  return String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
export function httpsUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; }
  catch { return null; }
}
export function titleOf(anime) {
  return cleanText(anime.title?.english || anime.title?.romaji || anime.title?.native);
}
export function assessAnime(anime) {
  const synopsis = cleanText(anime.description);
  const characters = [...new Map((anime.characters?.edges ?? []).filter(e => e.node?.id && e.node?.name?.full)
    .map(e => [e.node.id, { id: e.node.id, name: cleanText(e.node.name.full), role: e.role }])).values()];
  const relations = (anime.relations?.edges ?? []).filter(e => e.node?.type === 'ANIME' && e.node?.isAdult === false)
    .map(e => ({ id: e.node.id, title: titleOf(e.node), relationship: e.relationType, year: e.node.seasonYear,
      source_url: `https://anilist.co/anime/${e.node.id}` }));
  const links = (anime.externalLinks ?? []).filter(l => ['OFFICIAL', 'STREAMING'].includes(l.type) && httpsUrl(l.url))
    .map(l => ({ site: cleanText(l.site), type: l.type, url: httpsUrl(l.url), language: l.language ?? null }));
  const studios = (anime.studios?.nodes ?? []).filter(s => s.isAnimationStudio).map(s => cleanText(s.name));
  const facts = { format: anime.format, status: anime.status, release_year: anime.seasonYear,
    season: anime.season, episodes: anime.episodes, episode_minutes: anime.duration,
    genres: anime.genres ?? [], animation_studios: studios };
  const factCount = Object.values(facts).filter(v => Array.isArray(v) ? v.length : v != null && v !== '').length;
  const reasons = [];
  if (!Number.isSafeInteger(anime.id) || anime.id <= 0) reasons.push('missing_source_id');
  if (!titleOf(anime)) reasons.push('missing_title');
  if (anime.isAdult !== false) reasons.push('adult_status_unverified');
  if (synopsis.split(/\s+/).filter(Boolean).length < 80) reasons.push('insufficient_synopsis');
  if (/anime guide covering story, episodes, characters/i.test(synopsis)) reasons.push('placeholder_synopsis');
  if (factCount < 6) reasons.push('insufficient_production_facts');
  if (characters.length < 3) reasons.push('insufficient_character_data');
  if (!links.length) reasons.push('missing_official_or_licensed_link');
  const source = { name: 'AniList', url: `https://anilist.co/anime/${anime.id}` };
  const content = { generator_version: GENERATOR_VERSION, title: titleOf(anime), locale: 'en',
    synopsis: { text: synopsis, attribution: source, editorial_original: false },
    facts, characters, franchise_relations: relations, official_links: links,
    alternative_titles: [...new Set([anime.title?.romaji, anime.title?.native, ...(anime.synonyms ?? [])].map(cleanText).filter(Boolean))],
    source,
    editorial: { status: 'required', original_analysis: null, reviewer: null,
      checks: ['Verify facts and regional availability', 'Write original reader-focused analysis', 'Review source usage and attribution', 'Verify internal links and intent uniqueness'] },
    // Relations are not a verified viewing order; aggregate scores are not our review.
    notices: ['Franchise relationships are source labels, not a recommended watch order.',
      'Streaming availability may vary by region. No episodes or viewing rights are hosted here.'] };
  return { content, reasons, factCount, readyForReview: reasons.length === 0 };
}
export async function synopsisHash(description) {
  const text = cleanText(description).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export function publicationLinks(anime, published) {
  const norm = value => cleanText(value).normalize('NFKC').toLowerCase();
  const names = new Set([anime.title?.english, anime.title?.romaji, anime.title?.native, ...(anime.synonyms ?? [])].filter(Boolean).map(norm));
  const existing = published.find(page => names.has(norm(page.title)));
  const genres = new Set((anime.genres ?? []).map(norm));
  const links = published.filter(page => page !== existing)
    .map(page => ({...page, score:page.topics.filter(topic => genres.has(norm(topic))).length}))
    .filter(page => page.score > 0).sort((a,b) => b.score-a.score).slice(0,6)
    .map(({path,title}) => ({path,title}));
  return {canonical:existing?.path, links};
}
