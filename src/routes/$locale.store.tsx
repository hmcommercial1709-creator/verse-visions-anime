import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/$locale/store')({
  component: StorePage,
});

interface Product {
  id: string | number;
  name: string;
  price: number;
  slug: string;
}

function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.brolexy.com/v1/products', {
      headers: {
        'X-Public-Key': 'a0979781a31a52d6ab2159d59e2a450f358f267aadaada0ec07429c7ac',
        'X-Secret-Key': 'e9faee5f9b4f41e7938a972d008fce126474b46510f88125a7d214ae86e',
        'Authorization': 'Basic bGFtYWQ1NDEzODk5LmFwaS51c2VyOlIxamg1S1loRlRRMVhhTWFWbjE=',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data: { products?: Product[] }) => {
        setProducts(data.products || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) => 
    p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
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

        {isLoading ? (
          <div style={styles.loading}>Loading digital keys & cards... ⚡</div>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.slice(0, 12).map((p) => (
              <div key={p.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{p.name}</h3>
                <div style={styles.price}>${(Number(p.price || 0) * 1.25).toFixed(2)} USD</div>
                <a href={`/product/${p.slug}`} style={styles.button}>Buy Now ⚡</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  body: { fontFamily: "'Inter', sans-serif", backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  hero: { textAlign: 'center' as const, marginBottom: '40px' },
  title: { fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' },
  subtitle: { color: '#94a3b8', marginBottom: '30px' },
  searchBox: { width: '100%', maxWidth: '500px', padding: '15px', borderRadius: '10px', backgroundColor: '#131b2e', border: '1px solid #1e293b', color: '#fff', fontSize: '1rem', outline: 'none' },
  loading: { textAlign: 'center' as const, color: '#94a3b8', fontSize: '1.2rem', padding: '50px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#131b2e', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', marginBottom: '15px', minHeight: '3em' },
  price: { fontSize: '1.4rem', color: '#4ade80', fontWeight: 'bold', marginBottom: '15px' },
  button: { display: 'block', textAlign: 'center' as const, padding: '12px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' },
};
