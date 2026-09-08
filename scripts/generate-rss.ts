import fs from 'fs';
import { longformArticles } from '../src/data/articles-longform.ts';
import { animes } from '../src/data/animes.ts';

const siteUrl = 'https://gamecastle.store';

function generateRss() {
  const articleItems = longformArticles.map(article => ({
    title: article.title,
    path: `/article/${article.slug}`,
    description: article.excerpt,
    date: new Date(article.date),
  }));
  const animeItems = animes.map(anime => ({
    title: anime.title,
    path: `/anime/${anime.slug}`,
    description: anime.synopsis,
    date: new Date(`${anime.year}-01-01T00:00:00Z`),
  }));
  const items = [...articleItems, ...animeItems]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 50)
    .map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${siteUrl}${item.path}</link>
      <guid>${siteUrl}${item.path}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description><![CDATA[${item.description}]]></description>
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

  fs.writeFileSync('public/rss.xml', rssContent.replace(/[ \t]+\n/g, '\n').trim() + '\n');
  console.log('RSS feed generated successfully in public/rss.xml');
}

generateRss();
