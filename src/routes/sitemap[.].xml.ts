import { defineEventHandler, setHeader } from 'h3';
import { sitemapIndexXml } from '@/lib/sitemap';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=3600');
  return sitemapIndexXml();
});
