import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

function Legal({ title, path, body }: { title: string; path: string; body: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: title }]} />
      <h1 className="font-display text-5xl font-bold">{title}</h1>
      <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">{body}</div>
    </div>
  );
}

export const PrivacyRoute = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy Policy · AnimeVerse" },
    { name: "description", content: "How AnimeVerse collects, uses, and protects your data." },
    { property: "og:title", content: "Privacy Policy · AnimeVerse" },
    { property: "og:description", content: "Our privacy practices." },
  ], links: [{ rel: "canonical", href: "/privacy" }] }),
  component: () => <Legal title="Privacy Policy" path="/privacy" body={<>
    <p>This page describes how AnimeVerse ("we") collects and uses information when you visit our site.</p>
    <p><strong>Information we collect.</strong> We collect anonymous analytics (pages visited, referrer, device type) and, when you subscribe, your email address.</p>
    <p><strong>How we use it.</strong> Analytics inform editorial decisions. Emails are used only to deliver the newsletter you subscribed to.</p>
    <p><strong>Cookies.</strong> See our <a href="/cookies" className="text-primary">Cookie Policy</a>.</p>
    <p><strong>Your rights.</strong> You can request access, export, or deletion of your data at any time by emailing privacy@animeverse.example.</p>
  </>} />,
});
export const Route = PrivacyRoute;
