// src/components/StoreWidget.tsx
import React from 'react';

interface StoreWidgetProps {
  limit?: number;
}

export function StoreWidget({ limit = 4 }: StoreWidgetProps) {
  // منتجات أو بطاقات افتراضية تحاكي مخزون GameCastle لتشجيع الزوار على الشراء الفوري
  const widgetProducts = [
    { id: '1', name: 'Steam Wallet 10$ (Global)', price: '11.25', slug: 'steam-wallet-10-global', category: 'Gaming Keys' },
    { id: '2', name: 'PlayStation Network 20$ (US)', price: '22.50', slug: 'playstation-network-20-us', category: 'Gift Cards' },
    { id: '3', name: 'Xbox Game Pass Ultimate 1 Month', price: '16.99', slug: 'xbox-game-pass-1-month', category: 'Subscriptions' },
    { id: '4', name: 'Netflix Premium 1 Month (Global)', price: '14.99', slug: 'netflix-premium-1-month', category: 'Streaming' },
  ];

  const displayedProducts = widgetProducts.slice(0, limit);

  return (
    <div style={styles.widgetContainer}>
      <div style={styles.headerRow}>
        <span style={styles.badge}>🔥 GameCastle Store Deals</span>
        <h3 style={styles.title}>Recommended Gaming Keys & Subscriptions</h3>
      </div>
      
      <div style={styles.grid}>
        {displayedProducts.map((p) => (
          <div key={p.id} style={styles.card}>
            <span style={styles.categoryBadge}>{p.category}</span>
            <h4 style={styles.name}>{p.name}</h4>
            <div style={styles.priceRow}>
              <span style={styles.price}>${p.price}</span>
              <span style={styles.currency}>USD</span>
            </div>
            <a href={`/en/product/${p.slug}`} style={styles.button}>
              Secure Checkout
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  widgetContainer: { 
    margin: '40px 0', 
    padding: '25px', 
    backgroundColor: '#131b2e', 
    border: '1px solid #1e293b',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
  },
  headerRow: {
    marginBottom: '20px',
  },
  badge: { 
    fontSize: '0.75rem', 
    color: '#38bdf8', 
    fontWeight: '700', 
    textTransform: 'uppercase' as const, 
    display: 'block',
    marginBottom: '6px'
  },
  title: { 
    color: '#ffffff', 
    fontSize: '1.25rem',
    fontWeight: '800',
    margin: 0 
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
    gap: '20px' 
  },
  card: { 
    padding: '20px', 
    backgroundColor: '#090d16', 
    border: '1px solid #1e293b',
    borderRadius: '12px', 
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between'
  },
  categoryBadge: {
    fontSize: '0.65rem',
    color: '#60a5fa',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    marginBottom: '8px'
  },
  name: { 
    fontSize: '0.95rem', 
    fontWeight: '700',
    color: '#f1f5f9', 
    marginBottom: '15px',
    lineHeight: '1.3'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '15px'
  },
  price: { 
    fontSize: '1.4rem',
    fontWeight: '950', 
    color: '#4ade80' 
  },
  currency: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    fontWeight: '600'
  },
  button: { 
    display: 'block',
    textAlign: 'center' as const,
    fontSize: '0.85rem', 
    padding: '10px', 
    backgroundColor: '#2563eb', 
    color: '#fff', 
    textDecoration: 'none', 
    borderRadius: '8px',
    fontWeight: '700'
  }
};
