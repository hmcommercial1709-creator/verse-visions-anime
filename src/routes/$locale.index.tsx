import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/')({
  component: LocaleHomePage,
});

function LocaleHomePage() {
  const params = Route.useParams() as { locale?: string };
  const locale = params.locale || 'en';

  return (
    <div style={{ backgroundColor: '#090d16', color: '#ffffff', minHeight: '100vh', padding: '60px 20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>GameCastle Digital Store</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '30px' }}>Instant digital delivery, game gift cards, and top-ups.</p>
        <a 
          href={`/${locale}/store`} 
          style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '14px 30px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}
        >
          Browse Store Now 🎮
        </a>
      </div>
    </div>
  );
}
