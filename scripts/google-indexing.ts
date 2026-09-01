// Compatibility entry point. Google retired unauthenticated sitemap pings.
// https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
// robots.txt advertises the index; verify its health instead of reporting fake submissions.
import './check-sitemaps.mjs';
