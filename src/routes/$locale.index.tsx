import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/$locale/')({
  component: HomeRedirect,
});

function HomeRedirect() {
  const { locale } = Route.useParams();
  
  useEffect(() => {
    window.location.replace(`/${locale}/store`);
  }, [locale]);

  return (
    <div style={{ backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <h2>Loading GameCastle Store...</h2>
    </div>
  );
}
