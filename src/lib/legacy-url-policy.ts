/** Unmapped WordPress URLs must not silently render the unrelated homepage. */
export function legacyUrlResponse(request: Request): Response | undefined {
  if (request.method !== "GET" && request.method !== "HEAD") return;
  const url = new URL(request.url);
  if (url.pathname !== "/") return;

  const retiredPost = ["p", "page_id"].some((key) =>
    /^\d+$/.test(url.searchParams.get(key) ?? ""),
  );
  const feed = url.searchParams.get("feed");
  if (!retiredPost && feed === "rss2") {
    return new Response(null, {
      status: 301,
      headers: { location: "/rss.xml" },
    });
  }
  if (!retiredPost && feed !== "comments-rss2") return;

  return new Response(request.method === "HEAD" ? null :
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found · GameCastle</title></head><body><main><h1>Page not found</h1><p>This legacy URL does not have a matching page on this site.</p><p><a href="/browse">Browse anime</a> · <a href="/blog">Read our guides</a></p></main></body></html>', {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
  });
}
