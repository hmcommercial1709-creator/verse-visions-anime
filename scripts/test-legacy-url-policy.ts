import assert from "node:assert/strict";
import { legacyUrlResponse } from "../src/lib/legacy-url-policy.ts";

for (const query of ["p=34", "p=56", "p=47", "p=50", "page_id=265", "page_id=283", "page_id=277", "page_id=29", "page_id=20", "page_id=234", "page_id=3", "feed=comments-rss2"]) {
  assert.equal(legacyUrlResponse(new Request(`https://gamecastle.store/?${query}`))?.status, 404, query);
}
assert.equal(legacyUrlResponse(new Request("https://gamecastle.store/?feed=rss2"))?.headers.get("location"), "/rss.xml");
for (const path of ["/", "/?utm_source=chatgpt.com", "/game-top-up?qa=images", "/article/example?p=34"]) {
  assert.equal(legacyUrlResponse(new Request(`https://gamecastle.store${path}`)), undefined, path);
}
assert.equal(legacyUrlResponse(new Request("https://gamecastle.store/?p=34", {method:"POST"})), undefined);
console.log("Legacy URL policy tests passed");
