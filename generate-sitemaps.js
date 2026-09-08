import fs from "node:fs";
import path from "node:path";

for (const file of ["sitemap-codes-1.xml", "sitemap-codes-2.xml"]) {
	fs.rmSync(path.join(process.cwd(), "public", file), { force: true });
}

console.log("Database-backed code sitemaps are served dynamically by the application.");
