import { createClient } from "@supabase/supabase-js";

const SITE_ORIGIN = "https://gamecastle.store";
const DAILY_LIMIT = 1000;
const CONCURRENCY = 10;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const today = new Date();
const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
const end = new Date(start.getTime() + 86400000);

function pathFor(row) {
  if (!row.slug) return null;
  if (row.entity_type === "anime") return `/catalog/anime/${row.slug}`;
  if (row.entity_type === "game") return `/catalog/games/${row.slug}`;
  if (row.entity_type === "manga") return `/catalog/manga/${row.slug}`;
  return null;
}

function absolute(path) { return new URL(path, SITE_ORIGIN).href; }

function canonicalFrom(html) {
  const m = html.match(/<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i)
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*canonical[^"']*["'][^>]*>/i);
  return m?.[1] ?? null;
}

function hasNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
    || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
}

function countInternalLinks(html) {
  const matches = html.match(/href=["'](https:\/\/gamecastle\.store)?(\/[^"'#? ]*)/gi) ?? [];
  return new Set(matches.map((x) => x.replace(/^.*href=["']/i, "").replace(/^https:\/\/gamecastle\.store/i, "").split(/["'#?]/)[0])).size;
}

function hasBrokenPageMarkers(html) {
  return /(?:failed\s+to\s+load|application\s+error|something\s+went\s+wrong|internal\s+server\s+error)/i.test(html);
}

async function check(path) {
  const url = absolute(path);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "GameCastle-IndexGate/2.0", accept: "text/html,application/xhtml+xml" },
      signal: controller.signal,
    });
    const html = response.ok ? await response.text() : "";
    const canonical = canonicalFrom(html);
    const noindex = html ? hasNoindex(html) : true;
    const links = html ? countInternalLinks(html) : 0;
    const canonicalOk = canonical ? absolute(canonical) === url : false;
    const hasTitle = /<title>[^<]{3,}<\/title>/i.test(html);
    const hasH1 = /<h1\b[^>]*>[^<]{2,}/i.test(html);
    const brokenMarkers = html ? hasBrokenPageMarkers(html) : true;
    const pass = response.status === 200
      && html.length >= 1200
      && !noindex
      && canonicalOk
      && links >= 3
      && hasTitle
      && hasH1
      && !brokenMarkers;
    return {
      path,
      status: pass ? "approved" : "quarantined",
      http_status: response.status,
      canonical_url: canonical ? absolute(canonical) : null,
      robots_allowed: !noindex,
      indexable: !noindex && canonicalOk,
      internal_link_count: links,
      content_bytes: Buffer.byteLength(html),
      reason: pass ? null : `failed: http=${response.status}, content=${html.length}, canonical=${canonicalOk}, noindex=${noindex}, links=${links}, title=${hasTitle}, h1=${hasH1}, broken=${brokenMarkers}`,
    };
  } catch (error) {
    return { path, status: "quarantined", http_status: null, canonical_url: null, robots_allowed: false, indexable: false, internal_link_count: 0, content_bytes: 0, reason: `fetch error: ${error instanceof Error ? error.message : String(error)}` };
  } finally { clearTimeout(timer); }
}

const { data: rows, error } = await supabase
  .from("entities")
  .select("entity_type,slug,created_at")
  .eq("status", "active")
  .gte("created_at", start.toISOString())
  .lt("created_at", end.toISOString())
  .order("created_at", { ascending: false })
  .limit(DAILY_LIMIT);
if (error) throw error;

const candidates = (rows ?? []).map((row) => ({ ...row, path: pathFor(row) })).filter((row) => row.path);
const results = [];
for (let i = 0; i < candidates.length; i += CONCURRENCY) {
  const batch = candidates.slice(i, i + CONCURRENCY);
  const checked = await Promise.all(batch.map(async (candidate) => ({
    ...(await check(candidate.path)),
    source_created_at: candidate.created_at,
    updated_at: new Date().toISOString(),
  })));
  results.push(...checked);
}

if (results.length) {
  const { error: upsertError } = await supabase.from("daily_indexing_gate").upsert(results, { onConflict: "path" });
  if (upsertError) throw upsertError;
}

const approved = results.filter((r) => r.status === "approved").length;
const quarantined = results.length - approved;
console.log(JSON.stringify({ candidates: results.length, approved, quarantined, concurrency: CONCURRENCY }, null, 2));
