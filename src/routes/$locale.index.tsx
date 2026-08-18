import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';

export const Route = createFileRoute('/$locale/')({
  component: StoreHomePage,
});

function StoreHomePage() {
  const { locale } = Route.useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://api.brolexy.com/v1/products', {
      headers: {
        'X-Public-Key': 'a0979781a31a52d6ab2154ed59e2a450f358f267aadaada0ec07429c7ac550b8',
        'X-Secret-Key': 'e9faee5f9b4f41e7938a972d008fce126474b46510f88125a7d214ae86e86d82',
        'Authorization': 'Basic ' + btoa('lamad5413899.api.user:R1nh5KYhFtQlXaMaVn1'),
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
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#090d16', color: '#fff', padding: '50px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>GameCastle Digital Store</h1>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Instant digital delivery, gift cards, and game top-ups.</p>
          <input 
            type="text" 
            placeholder="🔍 Search digital keys & gift cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', maxWidth: '500px', padding: '15px', borderRadius: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff' }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '50px', fontSize: '1.2rem' }}>Loading digital cards & top-ups...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredProducts.slice(0, 24).map((p: any) => (
              <div key={p.id} style={{ backgroundColor: '#131b2e', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', minHeight: '3em' }}>{p.name}</h3>
                <div style={{ fontSize: '1.4rem', color: '#4ade80', fontWeight: 'bold', marginBottom: '15px' }}>${(p.price * 1.25).toFixed(2)} USD</div>
                <a href={`/${locale}/product/${p.slug}`} style={{ display: 'block', padding: '12px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '8px', textAlign: 'center', fontWeight: '700' }}>Buy Now</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
