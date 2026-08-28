import os
import random
import requests
from bs4 import BeautifulSoup

TELEGRAM_BOT_TOKEN = "8283282696:AAG8FaQzGs-cn0JuvSKEw6PO_aYkElKsxfc"
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
        
        posts = []
        for item in soup.find_all(['h2', 'h3']):
            link_tag = item.find('a')
            if link_tag and link_tag.get('href'):
                title = item.text.strip()
                link = link_tag['href']
                if not link.startswith('http'):
                    link = WEBSITE_URL + link
                posts.append((title, link))
        
        if posts:
            return random.choice(posts)
    except Exception as e:
        print(f"Error fetching site: {e}")
    
    return "Ultimate Gaming & Anime Hub - Instant Access", WEBSITE_URL

def send_to_telegram(title, link):
    keyword_tag = random.choice(POWER_KEYWORDS)
    
    message = (
        f"*{keyword_tag}*\n\n"
        f"📌 *{title}* \n\n"
        f"Discover the ultimate destination for massive discounts, top-tier anime visuals, and exclusive gaming rewards. Don't miss out!\n\n"
        f"🔗 [👉 اضغط هنا للدخول وتصفح الموقع حصرياً]({link})\n\n"
        f"#Gaming #Anime #FreeCodes #Gamivo #GameCastle #OnePiece #SoloLeveling #Trending"
    )
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }
    
    response = requests.post(url, json=payload)
    print("Telegram response:", response.text)

if __name__ == "__main__":
    title, link = fetch_latest_content()
    if title and link:
        send_to_telegram(title, link)
        print("Published high-SEO content successfully to Telegram!")
    else:
        print("No content found.")
