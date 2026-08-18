import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/')({
  component: HomePage,
});

function HomePage() {
  const { locale } = Route.useParams();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>GameCastle Digital Store</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Instant digital delivery, game gift cards, and top-ups.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
          <a href={`/${locale}/store`} style={{ background: '#2563eb', color: '#fff', padding: '12px 25px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' }}>Browse Full Store</a>
        </div>
      </div>
    </div>
  );
}
