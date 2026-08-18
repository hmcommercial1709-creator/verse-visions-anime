import { createFileRoute, Navigate, notFound } from '@tanstack/react-router';
import { isLocaleCode } from "@/lib/i18n";

export const Route = createFileRoute('/$locale/')({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale)) throw notFound();
  },
  component: () => {
    const { locale } = Route.useParams();
    return <Navigate to={`/${locale}/store`} />;
  },
});
