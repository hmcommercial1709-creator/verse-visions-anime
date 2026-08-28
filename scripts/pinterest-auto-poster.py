import xml.etree.ElementTree as ET
import urllib.request
import json
import os

SITEMAP_URL = "https://gamecastle.store/sitemap.xml"
OUTPUT_FILE = "latest_links.json"

def fetch_latest_links():
    try:
        print("Fetching sitemap...")
        req = urllib.request.Request(
            SITEMAP_URL, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response:
            xml_content = response.read()

        root = ET.fromstring(xml_content)
        namespaces = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = []
        
        for elem in root.findall('ns:url', namespaces):
            loc = elem.find('ns:loc', namespaces)
            if loc is not None and loc.text:
                urls.append(loc.text)

        latest_urls = urls[-50:] if len(urls) > 50 else urls
        
        data = [{"url": u, "title": u.split('/')[-1].replace('-', ' ').title()} for u in latest_urls]
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            
        print(f"Successfully processed {len(data)} links.")
    except Exception as e:
        print(f"Error fetching sitemap: {e}")

if __name__ == "__main__":
    fetch_latest_links()
