import fs from 'fs';
import { longformArticles } from '../src/data/articles-longform.ts';

const siteUrl = 'https://gamecastle.store';

function generateRss() {
  const items = longformArticles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/article/${article.slug}</link>
      <guid>${siteUrl}/article/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
    </item>
  `).join('');

  const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Anime Nexus RSS Feed</title>
      <link>${siteUrl}</link>
      <description>Latest updates and longform anime articles</description>
      <language>en</language>
      ${items}
    </channel>
  </rss>`;

  fs.writeFileSync('public/rss.xml', rssContent);
  console.log('RSS feed generated successfully in public/rss.xml');
}

generateRss();
