export type DiscoveryItem = { path: string; title: string; description: string; topics: string[]; locale: 'en' | 'ar' };
export const SAVED_LIMIT = 24;
export function parseSaved(value: string | null, allowed: Set<string>): string[] {
  try {
    const data: unknown = JSON.parse(value || '[]');
    return Array.isArray(data) ? [...new Set(data.filter((p): p is string => typeof p === 'string' && allowed.has(p)))].slice(0, SAVED_LIMIT) : [];
  } catch { return []; }
}
export function rankDiscovery(items: DiscoveryItem[], current: string, saved: string[], locale: 'en' | 'ar') {
  const weights = new Map<string, number>();
  for (const item of items) {
    const weight = item.path === current ? 4 : saved.includes(item.path) ? 2 : 0;
    for (const topic of item.topics) weights.set(topic, (weights.get(topic) || 0) + weight);
  }
  return items.filter(item => item.locale === locale && item.path !== current && !saved.includes(item.path))
    .map((item, order) => ({ item, order, score: item.topics.reduce((sum, topic) => sum + (weights.get(topic) || 0), 0) }))
    .sort((a, b) => b.score - a.score || a.order - b.order).map(entry => entry.item);
}
