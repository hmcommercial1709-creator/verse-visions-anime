import fs from "node:fs";
import path from "node:path";

// The sitemap is dynamic at /sitemap.xml. Remove any legacy physical XML
// files from public so they cannot shadow the route or remain discoverable.
const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  for (const file of fs.readdirSync(publicDir)) {
    if (/^sitemap(?:-.*)?\.xml$/i.test(file)) {
      fs.rmSync(path.join(publicDir, file), { force: true });
      console.log(`Removed legacy sitemap asset: public/${file}`);
    }
  }
}

console.log("Single dynamic sitemap is served at /sitemap.xml");
