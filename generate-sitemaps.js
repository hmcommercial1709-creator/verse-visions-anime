import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://gamecastle.store';

// إنشاء ملف الخريطة الأول (من 1 إلى 40 ألف)
let xml1 = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (let i = 1; i <= 40000; i++) {
  xml1 += `  <url><loc>${BASE_URL}/gaming-hub/code-${i}</loc></url>\n`;
}
xml1 += '</urlset>';
fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-codes-1.xml'), xml1);

// إنشاء ملف الخريطة الثاني (من 40001 إلى 80 ألف)
let xml2 = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (let i = 40001; i <= 80000; i++) {
  xml2 += `  <url><loc>${BASE_URL}/gaming-hub/code-${i}</loc></url>\n`;
}
xml2 += '</urlset>';
fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-codes-2.xml'), xml2);

console.log('Static Sitemaps generated successfully!');
