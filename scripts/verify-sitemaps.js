import fs from 'fs';
import path from 'path';

const pubDir = path.join(process.cwd(), '.output', 'public');
const indexPath = path.join(pubDir, 'sitemap-index.xml');

if (fs.existsSync(indexPath)) {
    console.log('✅ sitemap-index.xml exists in output root.');
    const content = fs.readFileSync(indexPath, 'utf8');
    const sitemaps = content.match(/<loc>(.*?)<\/loc>/g) || [];
    console.log('📊 Total chunked sitemaps linked:', sitemaps.length);
    
    let missing = 0;
    sitemaps.forEach(loc => {
        const url = loc.replace(/<\/?loc>/g, '');
        const fileName = url.split('/').pop();
        const filePath = path.join(pubDir, fileName);
        if (!fs.existsSync(filePath)) {
            console.log('❌ Missing file:', fileName);
            missing++;
        }
    });
    
    if (missing === 0) {
        console.log('🎉 All sitemap chunks are verified, correctly linked, and ready for Googlebot!');
    } else {
        console.log('⚠️ Found some missing physical files.');
    }
} else {
    console.log('❌ sitemap-index.xml is missing!');
}
