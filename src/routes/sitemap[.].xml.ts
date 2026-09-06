import { sitemapIndexXml, xmlResponse } from '@/lib/sitemap';

export async function GET() {
  return xmlResponse(sitemapIndexXml());
}
