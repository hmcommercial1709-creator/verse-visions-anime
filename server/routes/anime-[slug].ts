import { defineEventHandler, getRouterParam, setHeader } from 'h3';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug') || '';
    setHeader(event, 'content-type', 'text/html; charset=utf-8');
    return `<!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>${slug.replace(/-/g, ' ')} | GameCastle</title>
    </head>
    <body style="background:#0b0f19; color:#fff; font-family:sans-serif; text-align:center; padding:50px;">
        <h1>${slug.replace(/-/g, ' ')}</h1>
        <p>جاري تحميل محتوى الأنمي والقصة مباشرة من قاعدة البيانات...</p>
        <a href="/" style="color:#f43f5e;">الرئيسية</a>
    </body></html>`;
});
