import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/product/$slug')({
  head: ({ params }) => {
    const productName = params.slug.replace(/-/g, ' ');
    const title = `${productName} — GameCastle Store`;
    const description = `Buy ${productName} from GameCastle with instant digital delivery and secure checkout.`;

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const product = {
    name: "Digital Game Key & Gift Card",
    price: "9.99",
    category: "Gaming Store",
    platform: "Global / Instant Delivery",
    sku: "BROLEXY-PROD-01"
  };

  const uniqueDescription = `Get your official ${product.name} instantly on GameCastle. Powered by secure B2B digital delivery, enjoy ${product.platform} activation with 24/7 support and unbeatable wholesale pricing.`;

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>Home / Store / {product.category}</div>
        
        <h1 style={styles.title}>{product.name}</h1>
        <p style={styles.subtitle}>{uniqueDescription}</p>

        <div style={styles.priceCard}>
          <div style={styles.priceLabel}>Wholesale Price</div>
          <div style={styles.price}>${product.price} USD</div>
          <div style={styles.deliveryBadge}>⚡ Instant Automatic Delivery</div>
          <a href="https://gamecastle.store" style={styles.ctaButton}>
            Buy Now & Get Code Instantly
          </a>
        </div>

        <section style={styles.featuresSection}>
          <h2>Why GameCastle is #1 for Gamers:</h2>
          <ul style={styles.list}>
            <li>✔️ <strong>Direct Sourced:</strong> Authentic digital keys supplied straight through high-grade B2B infrastructure.</li>
            <li>✔️ <strong>Instant Access:</strong> Automated system delivers your activation code seconds after payment verification.</li>
            <li>✔️ <strong>Secure & Trusted:</strong> Fully encrypted checkout and global payment compatibility.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

const styles = {
  body: { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: '#0f172a', color: '#f8fafc', margin: 0, padding: '20px', minHeight: '100vh' },
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
  list: { paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8' }
};
