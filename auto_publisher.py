import os
import random
import requests
from bs4 import BeautifulSoup

TELEGRAM_BOT_TOKEN = "8283282696:AAG8faQzGs-cn0JuvSKEw6PO_aYkElKsxfc"
TELEGRAM_CHAT_ID = "@gamecastle_channel"
WEBSITE_URL = "https://gamecastle.store"

POWER_KEYWORDS = [
    "🔥 Free Game Codes & Gift Cards 2026",
    "⚡ Best Anime Wallpapers HD & 4K",
    "🚀 Top Gaming Currency & Discounts",
    "💎 Exclusive Gamivo Deals & Cheap Keys",
    "🌟 Solo Leveling & One Piece Epic Art"
]

def fetch_latest_content():
    try:
        response = requests.get(WEBSITE_URL)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # البحث عن المقالات والصور البارزة داخل الموقع لجلبها تلقائياً
        for item in soup.find_all(['h2', 'h3']):
            link_tag = item.find('a')
            if link_tag and link_tag.get('href'):
                title = item.text.strip()
                link = link_tag['href']
                if not link.startswith('http'):
                    link = WEBSITE_URL + link
                
                # محاولة استخراج صورة حقيقية من نفس المقال أو الصفحة
                img_url = None
                parent = item.find_parent(['article', 'div', 'section'])
                if parent:
                    img_tag = parent.find('img')
                    if img_tag and img_tag.get('src'):
                        img_url = img_tag['src']
                
                if not img_url:
                    # صورة افتراضية فخمة جداً وعالية الجودة في حال لم يجد صورة بالمقال
                    img_url = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
                elif not img_url.startswith('http'):
                    img_url = WEBSITE_URL + img_url
                    
                return title, link, img_url
                
    except Exception as e:
        print(f"Error fetching site: {e}")
    
    # محتوى احتياطي فخم للغاية مع صورة عالية الجودة
    return "Ultimate Gaming & Anime Hub - Instant Access", WEBSITE_URL, "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop"

def send_to_telegram(title, link, img_url):
    keyword_tag = random.choice(POWER_KEYWORDS)
    
    # صياغة النص الإحترافي فوق الصورة مباشرة
    caption = (
        f"*{keyword_tag}*\n\n"
        f"📌 *{title}* \n\n"
        f"Discover the ultimate destination for massive discounts, top-tier anime visuals, and exclusive gaming rewards. Don't miss out!\n\n"
        f"🔗 [👉 اضغط هنا للدخول وتصفح الموقع حصرياً]({link})\n\n"
        f"#Gaming #Anime #FreeCodes #Gamivo #GameCastle #OnePiece #SoloLeveling #Trending"
    )
    
    # إرسال الصورة مباشرة كـ Photo مع النص (Caption) لتظهر بشكل مذهل واحترافي
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "photo": img_url,
        "caption": caption,
        "parse_mode": "Markdown"
    }
    
    response = requests.post(url, json=payload)
    print("Telegram response:", response.text)

if __name__ == "__main__":
    title, link, img_url = fetch_latest_content()
    if title and link:
        send_to_telegram(title, link, img_url)
        print("Published high-SEO photo content successfully to Telegram!")
    else:
        print("No content found.")
