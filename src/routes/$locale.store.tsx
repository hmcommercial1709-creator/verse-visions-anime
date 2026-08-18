import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';

export const Route = createFileRoute('/$locale/store')({
  loader: async () => {
    try {
      const response = await fetch('https://api.brolexy.com/v1/products', {
        headers: {
          'X-Public-Key': 'a0979781a31a52d6ab2154ed59e2a450f358f267aadaada0ec07429c7ac550b8',
          'X-Secret-Key': 'e9faee5f9b4f41e7938a972d008fce126474b46510f88125a7d214ae86e86d82',
          'Authorization': 'Basic ' + btoa('lamad5413899.api.user:R1nh5KYhFtQlXaMaVn1'),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.products || [];
    } catch { return []; }
  },
  component: StorePage,
});

function StorePage() {
  const products = Route.useLoaderData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* القسم الأول: المنتجات الرقمية (الأولوية القصوى للأرباح والأرشفة) */}
        <div style={styles.hero}>
          <h1 style={styles.title}>GameCastle Global Digital Superstore</h1>
          <p style={styles.subtitle}>Instant digital delivery. Wholesale pricing. 24/7 automated access.</p>
          <input 
            type="text" 
            placeholder="🔍 Search digital keys & subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBox}
          />
        </div>

        <div style={styles.grid}>
          {filteredProducts.slice(0, 12).map((p: any) => (
            <div key={p.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{p.name}</h3>
              <div style={styles.price}>${(p.price * 1.25).toFixed(2)} USD</div>
              <a href={`/en/product/${p.slug}`} style={styles.button}>Buy Now</a>
            </div>
          ))}
        </div>

        {/* القسم الثاني: مجسمات الأنمي (تسويق بالعمولة) */}
        <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #1e293b' }}>
          <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>Featured Anime Figures</h2>
          <div style={styles.grid}>
             {/* يمكنك إضافة روابط التسويق بالعمولة الخاصة بك هنا */}
             <div style={styles.card}>
                <h4 style={styles.cardTitle}>Gojo Satoru Premium Figure</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Amazon Affiliate Collection</p>
                <a href="#" style={styles.secondaryButton}>View on Amazon</a>
             </div>
             <div style={styles.card}>
                <h4 style={styles.cardTitle}>Nezuko Kamado Collectible</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Demon Slayer Series</p>
                <a href="#" style={styles.secondaryButton}>View on Amazon</a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: { fontFamily: "'Inter', sans-serif", backgroundColor: '#090d16', color: '#fff', padding: '50px 20px', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' },
  subtitle: { color: '#94a3b8', marginBottom: '30px' },
  searchBox: { width: '100%', maxWidth: '500px', padding: '15px', borderRadius: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#131b2e', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' },
  cardTitle: { fontSize: '1rem', marginBottom: '10px', minHeight: '3em' },
  price: { fontSize: '1.4rem', color: '#4ade80', fontWeight: 'bold', marginBottom: '15px' },
  button: { display: 'block', padding: '12px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '8px', textAlign: 'center', fontWeight: '700' },
  secondaryButton: { display: 'block', padding: '10px', background: '#1e293b', color: '#fff', textDecoration: 'none', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }
};
