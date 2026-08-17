import { createFileRoute } from '@tanstack/react-router';

// ملاحظة: يجب أن تكون المصفوفات هي نفسها الموجودة في صفحة trending
const platforms = ["steam", "roblox", "pubg", "playstation", "xbox", "valorant", "fortnite"];
const regions = ["global", "usa", "eu", "mena", "asia"];
const intents = ["buy-instant", "crypto-discount", "official-code"];

export const Route = createFileRoute('/sitemap/xml')({
  loader: () => {
    const urls = platforms.flatMap(p => 
      regions.flatMap(r => 
        intents.map(i => `https://gamecastle.store/${p}-${r}-${i}`)
      )
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://gamecastle.store/</loc></url>
  ${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}
</urlset>`;

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' }
    });
  },
});
