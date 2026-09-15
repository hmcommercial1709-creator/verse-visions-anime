/**
 * 410 Gone, for the URLs that served machine-fabricated pages.
 *
 * Why 410 and not 404, noindex, or a redirect:
 *
 *  - 404 says "not here, maybe later" and Google keeps re-crawling it for
 *    months. With 81,250 URLs that is months of crawl budget spent
 *    re-confirming pages we deliberately removed.
 *  - 410 says "gone, permanently". Google drops these fastest, which is the
 *    whole point: the real pages cannot get crawl attention until these stop
 *    consuming it.
 *  - noindex would also work, but it requires the page to keep rendering, so
 *    the fabricated ratings and reviews would stay live and visible to
 *    readers while Google slowly stops indexing them.
 *  - A redirect would be worse than either. Sending 81,250 junk URLs at a
 *    real page tells Google those URLs and that page are equivalent, which
 *    is how you move a spam signal onto content that did not earn it.
 *
 * The body is small, honest and human-readable: someone who followed an old
 * link should be told what happened and where to go, not shown a blank 410.
 */

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>This page has been removed | GameCastle Anime</title>
<style>
  body{margin:0;background:#0b0f1a;color:#f8fafc;font:16px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  main{max-width:34rem;margin:0 auto;padding:4rem 1.25rem}
  h1{font-size:1.6rem;margin:0 0 1rem}
  p{color:#94a3b8;margin:0 0 1rem}
  a{color:#22d3ee}
  ul{padding-left:1.1rem;color:#94a3b8}
</style>
</head>
<body>
<main>
  <h1>This page has been removed</h1>
  <p>
    It was one of a large set of automatically generated pages that carried no
    real information. We removed them rather than leave them up.
  </p>
  <p>Here is what we actually publish:</p>
  <ul>
    <li><a href="/anime">Anime guides, watch orders and reviews</a></li>
    <li><a href="/catalog/games">The games catalog</a></li>
    <li><a href="/gamer-card">Build your taste card</a></li>
    <li><a href="/">Home</a></li>
  </ul>
</main>
</body>
</html>`;

export function goneResponse(): Response {
  return new Response(HTML, {
    status: 410,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Cached, because a crawler working through tens of thousands of these
      // should not hit the origin for every one. Short enough that reversing
      // this decision does not require waiting out a long TTL.
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
