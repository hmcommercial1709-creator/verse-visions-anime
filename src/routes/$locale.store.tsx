import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';

export const Route = createFileRoute('/$locale/store')({
  component: StorePage,
});

function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.brolexy.com/v1/products', {
      headers: {
        'X-Public-Key': 'a0979781a31a52d6ab2159d59e2a450f358f267aadaada0ec07429c7ac',
        'X-Secret-Key': 'e9faee5f9b4f41e7938a972d008fce126474b46510f88125a7d214ae86e',
        'Authorization': 'Basic bGFtYWQ1NDEzODk5LmFwaS51c2VyOlIxamg1S1loRlRRMVhhTWFWbjE=',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p: any) => 
    p && p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>GameCastle Global Digital Superstore</h1>
          <p style={styles.subtitle}>Instant digital delivery. Wholesale pricing. 24/7 automated delivery.</p>
          <input
            type="text"
            placeholder="🔍 Search digital keys & subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBox}
          />
        </div>

        {loading ? (
          <div style={styles.loading}>Loading digital keys & cards... ⚡</div>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.slice(0, 12).map((p: any) => (
              <div key={p.id || Math.random()} style={styles.card}>
                <h3 style={styles.cardTitle}>{p.name}</h3>
                <div style={styles.price}>${(Number(p.price || 0) * 1.25).toFixed(2)} USD</div>
                <a href={`/product/${p.slug || ''}`} style={styles.button}>Buy Now ⚡</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  body: { fontFamily: "'Inter', sans-serif", backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', padding: '40px 20px' } as React.CSSProperties,
  container: { maxWidth: '1200px', margin: '0 auto' } as React.CSSProperties,
  hero: { textAlign: 'center', marginBottom: '40px' } as React.CSSProperties,
  title: { fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' } as React.CSSProperties,
  subtitle: { color: '#94a3b8', marginBottom: '30px' } as React.CSSProperties,
  searchBox: { width: '100%', maxWidth: '500px', padding: '15px', borderRadius: '10px', backgroundColor: '#131b2e', border: '1px solid #1e293b', color: '#fff', fontSize: '1rem', outline: 'none' } as React.CSSProperties,
  loading: { textAlign: 'center' as const, color: '#94a3b8', fontSize: '1.2rem', padding: '50px' } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' } as React.CSSProperties,
  card: { backgroundColor: '#131b2e', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } as React.CSSProperties,
  cardTitle: { fontSize: '1rem', fontWeight: '700', marginBottom: '15px', minHeight: '3em' } as React.CSSProperties,
  price: { fontSize: '1.4rem', color: '#4ade80', fontWeight: 'bold', marginBottom: '15px' } as React.CSSProperties,
  button: { display: 'block', textAlign: 'center' as const, padding: '12px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' } as React.CSSProperties,
};
