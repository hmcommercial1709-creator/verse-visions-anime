import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/$locale/product/$slug')({
  head: () => ({
    meta: [
      { title: "Official Global Store: Digital Game Keys & Gift Cards | GameCastle" },
      { name: 'description', content: 'Instant global B2B digital delivery for game keys, Steam wallets, and premium streaming subscriptions at wholesale prices.' },
      { property: 'og:title', content: 'GameCastle Global Store - Instant Digital Delivery' },
      { property: 'og:description', content: 'Access instant activation codes for top gaming platforms worldwide with secure checkout.' },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: UltimateGlobalStore,
});

const products = [
  { id: 1, name: "Steam Wallet 50$ Gift Card", price: "49.99", category: "Gift Cards", slug: "steam-wallet-50", image: "https://gamecastle.store/assets/steam-50.jpg" },
  { id: 2, name: "Netflix Premium 1 Month Subscription", price: "15.99", category: "Subscriptions", slug: "netflix-1-month", image: "https://gamecastle.store/assets/netflix.jpg" },
  { id: 3, name: "PlayStation Plus 1 Year Membership", price: "59.99", category: "Subscriptions", slug: "ps-plus-1-year", image: "https://gamecastle.store/assets/psplus.jpg" },
  { id: 4, name: "Xbox Game Pass Ultimate 3 Months", price: "29.99", category: "Subscriptions", slug: "xbox-game-pass", image: "https://gamecastle.store/assets/xbox.jpg" },
  { id: 5, name: "Spotify Family Plan 1 Month", price: "12.99", category: "Subscriptions", slug: "spotify-family", image: "https://gamecastle.store/assets/spotify.jpg" },
  { id: 6, name: "Google Play Gift Card 25$", price: "24.99", category: "Gift Cards", slug: "google-play-25", image: "https://gamecastle.store/assets/googleplay.jpg" },
];

function UltimateGlobalStore() {
  const globalSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "image": p.image,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": p.price,
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <div style={styles.body}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }} />

      <div style={styles.container}>
        <div style={styles.heroSection}>
          <h1 style={styles.title}>Global Gaming & Digital Subscription Hub</h1>
          <p style={styles.subtitle}>Direct automated infrastructure delivering keys and gift cards worldwide in seconds.</p>
        </div>

        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <div style={styles.catBadge}>{product.category}</div>
              <h3 style={styles.cardTitle}>{product.name}</h3>
              <div style={styles.priceTag}>${product.price} USD</div>
              <div style={styles.deliveryBadge}>⚡ Instant B2B Delivery</div>
              <a href={`https://gamecastle.store/en/product/${product.slug}`} style={styles.ctaButton}>
                Secure Checkout
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: '#090d16', color: '#f1f5f9', padding: '50px 20px', minHeight: '100vh' },
  container: { maxWidth: '1280px', margin: '0 auto' },
  heroSection: { textAlign: 'center' as const, marginBottom: '60px' },
  title: { fontSize: '2.8rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.025em', marginBottom: '15px' },
  subtitle: { color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#131b2e', border: '1px solid #1e293b', padding: '30px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)', transition: 'transform 0.2s ease' },
  catBadge: { fontSize: '0.7rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '12px' },
  cardTitle: { fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', marginBottom: '15px', lineHeight: '1.4' },
  priceTag: { fontSize: '1.8rem', fontWeight: '900', color: '#4ade80', marginBottom: '10px' },
  deliveryBadge: { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '6px' },
  ctaButton: { display: 'block', textAlign: 'center' as const, backgroundColor: '#2563eb', color: '#ffffff', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)' }
};
