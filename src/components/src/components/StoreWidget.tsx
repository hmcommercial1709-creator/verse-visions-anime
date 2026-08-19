import React from 'react';

interface StoreWidgetProps {
  limit?: number;
}

export function StoreWidget({ limit = 4 }: StoreWidgetProps) {
  const widgetProducts = [
    { id: '1', name: 'Steam Wallet 10$ (Global)', price: '11.25', slug: 'steam-wallet-10-global', category: 'Gaming Keys' },
    { id: '2', name: 'PlayStation Network 20$ (US)', price: '22.50', slug: 'playstation-network-20-us', category: 'Gift Cards' },
    { id: '3', name: 'Xbox Game Pass Ultimate 1 Month', price: '16.99', slug: 'xbox-game-pass-ultimate-1-month', category: 'Subscriptions' },
    { id: '4', name: 'Netflix Premium 1 Month (Global)', price: '14.99', slug: 'netflix-premium-1-month', category: 'Streaming' },
  ];

  const displayedProducts = widgetProducts.slice(0, limit);

  return (
    <div className="p-4 bg-card rounded-xl border border-border">
      <h3 className="text-lg font-bold mb-4 text-foreground">متجر GameCastle السريع</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedProducts.map((product) => (
          <div key={product.id} className="p-4 border border-border rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-xs text-muted-foreground">{product.category}</span>
              <h4 className="font-semibold text-foreground">{product.name}</h4>
              <p className="text-primary font-bold mt-2">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
