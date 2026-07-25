import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

const TITLE = "Privacy Policy — How AnimeVerse Handles Your Data";
const DESC =
  "AnimeVerse's privacy policy: what data we collect, how advertising and analytics cookies work, third-party partners, retention periods, and how to exercise your GDPR/CCPA rights.";
const URL = "https://verse-visions-anime.lovable.app/privacy";
const UPDATED = "July 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `${TITLE} · AnimeVerse` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Privacy Policy" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-foreground/85">
        <section>
          <p>
            This policy explains what information AnimeVerse ("we", "us") collects when you visit
            this website, why we collect it, who we share it with, and the choices you have. This
            page is maintained by the AnimeVerse team and describes our own practices; it is not a
            certification by any third party.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">1. Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li><strong>Information you give us.</strong> If you use our <Link to="/contact" className="text-primary hover:underline">contact form</Link> or subscribe to the newsletter, we receive the name, email address, and message you submit.</li>
            <li><strong>Usage data.</strong> Pages viewed, referring page, approximate region, device type, browser, and session duration, collected in aggregate.</li>
            <li><strong>Technical data.</strong> IP address and request headers, processed by our hosting provider to serve pages and to mitigate abuse.</li>
          </ul>
          <p className="mt-3">
            We do not knowingly collect data from children under 13, and we do not ask for or store
            payment card details on this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">2. How we use information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>To deliver and secure the website.</li>
            <li>To answer messages you send us and to publish corrections where relevant.</li>
            <li>To send the newsletter you explicitly subscribed to (every email includes an unsubscribe link).</li>
            <li>To understand which articles are useful so we can plan editorial coverage.</li>
            <li>To display advertising that funds the site.</li>
          </ul>
          <p className="mt-3">We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">3. Cookies and similar technologies</h2>
          <p className="mt-3">
            We use strictly necessary cookies to keep the site working, and optional analytics and
            advertising cookies. Full detail — including categories and how to withdraw consent — is
            in our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">4. Advertising partners</h2>
          <p className="mt-3">
            AnimeVerse is supported by display advertising. Third-party advertising vendors, which may
            include Google and its partners, may use cookies or device identifiers to serve ads based
            on your prior visits to this and other websites.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the internet.</li>
            <li>You can opt out of personalised advertising in Google's Ads Settings, and out of many other vendors at <span className="text-foreground">aboutads.info</span> or <span className="text-foreground">youronlinechoices.eu</span>.</li>
            <li>Where required by law, personalised advertising is only enabled after you consent.</li>
          </ul>
          <p className="mt-3">
            Some articles contain affiliate links to retailers. Following one may set a cookie that
            attributes a purchase to us; it never changes the price you pay. See our{" "}
            <Link to="/editorial-policy" className="text-primary hover:underline">editorial policy</Link> for disclosure rules.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">5. Third parties we rely on</h2>
          <p className="mt-3">We share the minimum data needed with service providers acting on our instructions:</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li><strong>Hosting and content delivery</strong> — to serve pages and protect against attacks.</li>
            <li><strong>Analytics</strong> — to produce aggregate audience reports.</li>
            <li><strong>Advertising vendors</strong> — to select and measure ads.</li>
            <li><strong>Email delivery</strong> — to send the newsletter to subscribers.</li>
          </ul>
          <p className="mt-3">
            We may also disclose information where we are legally required to, or to protect our
            rights and the safety of readers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">6. Retention</h2>
          <p className="mt-3">
            Contact messages are kept for as long as needed to resolve the enquiry and for our records
            of corrections. Newsletter subscriptions are kept until you unsubscribe. Aggregate
            analytics are retained in summarised form.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">7. Your rights</h2>
          <p className="mt-3">
            Depending on where you live, you may have the right to access, correct, export, or delete
            your personal data, to object to processing, and to withdraw consent for optional cookies
            at any time. Residents of the EU/UK may rely on the GDPR; residents of California may rely
            on the CCPA/CPRA, including the right not to have personal information sold or shared.
          </p>
          <p className="mt-3">
            To make a request, email <a href="mailto:privacy@animeverse.example" className="text-primary hover:underline">privacy@animeverse.example</a> or use the{" "}
            <Link to="/contact" className="text-primary hover:underline">contact form</Link>. We respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">8. Security</h2>
          <p className="mt-3">
            The site is served over HTTPS, and access to any reader data is limited to team members who
            need it. No system is perfectly secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">9. Changes to this policy</h2>
          <p className="mt-3">
            When we make material changes we update the date at the top of this page. Continued use of
            the site after a change means you accept the revised policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">10. Contact</h2>
          <p className="mt-3">
            Questions about privacy: <a href="mailto:privacy@animeverse.example" className="text-primary hover:underline">privacy@animeverse.example</a>. Copyright matters go
            to our <Link to="/dmca" className="text-primary hover:underline">DMCA page</Link>; terms of use are in our{" "}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
