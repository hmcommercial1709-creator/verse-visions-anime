import React from 'react';
import { useLoaderData } from '@tanstack/react-router';
import Head from 'next/head'; // أو مكتبة إدارة الرأس حسب إطار العمل لديك

// محاكاة جلب بيانات منتجات Brolexy الديناميكية وتوليد محتوى فريد لمنع التكرار
export default function ProductDynamicPage() {
  // بيانات تجريبية يتم ربطها لاحقاً بـ API Brolexy الفعلي
  const product = {
    name: "Steam Wallet Card / Digital Game Key",
    price: "10.00",
    category: "Gaming Gift Cards & Keys",
    platform: "Steam / Global",
    delivery: "Instant Automatic Delivery",
    sku: "BROLEXY-DIGITAL-01"
  };

  // توليد نصوص فريدة ديناميكياً لكل منتج لمنع عقوبات محركات البحث على المحتوى المكرر
  const uniqueDescription = `Get your official ${product.name} instantly on GameCastle. Powered by secure B2B digital delivery, enjoy ${product.platform} activation with 24/7 support and unbeatable wholesale pricing.`;

  return (
    <div style={styles.body}>
      {/* قسم تحسين محركات البحث SEO الاحترافي */}
      <head>
        <title>Buy {product.name} Cheap - Instant Digital Delivery | GameCastle</title>
        <meta name="description" content={uniqueDescription} />
        <meta name="keywords" content={`buy ${product.name}, ${product.name} cheap, digital game code, gamecastle store, instant key`} />
        
        {/* Open Graph لزيادة الانتشار على منصات التواصل */}
        <meta property="og:title" content={`Buy ${product.name} - Instant Delivery`} />
        <meta property="og:description" content={uniqueDescription} />
        <meta property="og:type" content="product" />
        
        {/* Schema Markup الخارقة لظهور النجوم والأسعار في Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": uniqueDescription,
            "sku": product.sku,
            "brand": {
              "@type": "Brand",
              "name": "GameCastle"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": product.price,
              "availability": "https://schema.org/InStock",
              "url": "https://gamecastle.store"
            }
          })}
        </script>
      </head>

      {/* هيكل الصفحة الفائق السرعة والتصميم */}
      <main style={styles.container}>
        <div style={styles.breadcrumb}>Home / Store / {product.category}</div>
        
        <h1 style={styles.title}>{product.name}</h1>
        <p style={styles.subtitle}>{uniqueDescription}</p>

        <div style={styles.priceCard}>
          <div style={styles.priceLabel}>Wholesale Price</div>
          <div style={styles.price}>${product.price} USD</div>
          <div style={styles.deliveryBadge}>⚡ {product.delivery}</div>
          <a href="https://gamecastle.store" style={styles.ctaButton}>
            Buy Now & Get Code Instantly
          </a>
        </div>

        <section style={styles.featuresSection}>
          <h2>Why GameCastle is #1 for Gamers:</h2>
          <ul style={styles.list}>
            <li>✔️ <strong>Direct Sourced:</strong> Authentic digital keys supplied straight through high-grade B2B infrastructure.</li>
            <li>✔️ <strong>Instant Access:</strong> Automated system delivers your activation code seconds after payment verification.</li>
            <li>✔️ <strong>Secure & Trusted:</strong> Fully encrypted checkout and global payment compatibility (USDT/SEPA/Crypto).</li>
          </ul>
        </section>

        <section style={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          <div style={styles.faqItem}>
            <strong>How do I receive my {product.name}?</strong>
            <p>The code is generated automatically via our API integration and dispatched to your email or screen immediately.</p>
          </div>
          <div style={styles.faqItem}>
            <strong>Is region locking applied?</strong>
            <p>All specifications and region compatibility are clearly listed. Most products support global activation.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

// تصميمات CSS مدمجة فائقة السرعة وخفيفة لضمان تصدر أسرع في محركات البحث
const styles = {
  body: { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: '#0f172a', color: '#f8fafc', margin: 0, padding: '20px' },
  container: { maxWidth: '800px', margin: '40px auto', backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' },
  breadcrumb: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px' },
  title: { fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' },
  subtitle: { color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' },
  priceCard: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '30px', borderRadius: '12px', textAlign: 'center' as const, marginBottom: '30px' },
  priceLabel: { color: '#93c5fd', fontSize: '0.9rem', textTransform: 'uppercase' as const, letterSpacing: '1px' },
  price: { fontSize: '3rem', fontWeight: '900', color: '#ffffff', margin: '10px 0' },
  deliveryBadge: { background: '#22c55e', color: '#ffffff', display: 'inline-block', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '20px' },
  ctaButton: { display: 'block', backgroundColor: '#ffffff', color: '#1d4ed8', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  featuresSection: { marginTop: '40px', borderTop: '1px solid #334155', paddingTop: '20px' },
  list: { paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8' },
  faqSection: { marginTop: '30px', borderTop: '1px solid #334155', paddingTop: '20px' },
  faqItem: { marginBottom: '15px' }
};
