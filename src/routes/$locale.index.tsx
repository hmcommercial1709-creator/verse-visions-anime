import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/')({
  component: () => {
    const { locale } = Route.useParams();
    return <Navigate to={`/${locale}/store`} />;
  },
});
