import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const TITLE = "Privacy Policy — Cookies, Ads & Your Data Rights";
const DESC =
  "How GameCastle Anime collects, uses and protects your data: cookie categories, Google AdSense and third-party ad network disclosures, consent, retention, and your GDPR/CCPA rights.";
const URL = absoluteUrl("/privacy-policy");
const UPDATED = "July 2026";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: `${TITLE} · GameCastle Anime` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Privacy Policy" }])),
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Privacy Policy" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-foreground/85">
        <p>
          This policy explains what information GameCastle Anime ("we", "us") collects when you visit this
          website, why we collect it, who we share it with, and the choices you have. It is maintained
          by the GameCastle Anime editorial team and describes our own practices; it is not a certification
          issued by any third party.
        </p>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">1. Who we are</h2>
          <p className="mt-3">
            GameCastle Anime is an independent anime publication. We are the data controller for this site.
            Privacy questions go through the{" "}
            <Link to="/contact" className="text-primary hover:underline">contact form</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">2. Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li><strong>Information you give us.</strong> The name, email address and message you submit through the contact form or newsletter sign-up.</li>
            <li><strong>Usage data.</strong> Pages viewed, referring page, approximate region, device type, browser and session duration, in aggregate.</li>
            <li><strong>Technical data.</strong> IP address and request headers, processed by our hosting and CDN provider to serve pages and mitigate abuse.</li>
            <li><strong>Preferences stored on your device.</strong> Language selection, spoiler-gate state and cookie consent choices.</li>
          </ul>
          <p className="mt-3">
            We do not knowingly collect data from children under 13, and we never ask for or store
            payment card details on this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">3. Legal bases for processing (GDPR)</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li><strong>Consent</strong> — analytics and advertising cookies, and newsletter emails.</li>
            <li><strong>Legitimate interests</strong> — keeping the site secure, preventing abuse, and understanding aggregate readership.</li>
            <li><strong>Legal obligation</strong> — responding to lawful requests and handling copyright notices.</li>
          </ul>
          <p className="mt-3">
            Where processing relies on consent, you can withdraw it at any time without affecting the
            lawfulness of processing carried out beforehand.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">4. Cookies and similar technologies</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-left">
                <tr>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Purpose</th>
                  <th className="p-3 font-semibold">Consent</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-border/60"><td className="p-3">Strictly necessary</td><td className="p-3">Page delivery, security, language and consent preferences</td><td className="p-3">Not required</td></tr>
                <tr className="border-t border-border/60"><td className="p-3">Analytics</td><td className="p-3">Aggregate audience measurement and article performance</td><td className="p-3">Optional</td></tr>
                <tr className="border-t border-border/60"><td className="p-3">Advertising</td><td className="p-3">Ad selection, frequency capping, measurement</td><td className="p-3">Optional</td></tr>
                <tr className="border-t border-border/60"><td className="p-3">Affiliate attribution</td><td className="p-3">Crediting a retailer purchase to us</td><td className="p-3">Optional</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Category-by-category detail and browser opt-out steps are in our{" "}
            <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">5. Advertising and Google AdSense</h2>
          <p className="mt-3">
            GameCastle Anime is funded by display advertising. We work with Google AdSense and its certified
            partners to fill the ad slots on this site.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the internet.</li>
            <li>You may opt out of personalised advertising by visiting Google's Ads Settings, or opt out of many other vendors at <span className="text-foreground">aboutads.info</span> and <span className="text-foreground">youronlinechoices.eu</span>.</li>
            <li>Readers in the EEA, UK and Switzerland are shown a consent notice before non-essential advertising cookies are set; declining means you see non-personalised ads instead.</li>
            <li>We do not pass your name, email address, or contact-form content to advertising partners.</li>
          </ul>
          <p className="mt-3">
            Some articles contain affiliate links to retailers. Following one may set a cookie that
            attributes a purchase to us; it never changes the price you pay. Disclosure rules are in our{" "}
            <Link to="/editorial-policy" className="text-primary hover:underline">editorial policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">6. Processors and third parties</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li><strong>Hosting and CDN</strong> — page delivery and attack mitigation.</li>
            <li><strong>Analytics provider</strong> — aggregate audience reporting.</li>
            <li><strong>Advertising vendors</strong> — ad selection, delivery and measurement.</li>
            <li><strong>Email delivery</strong> — sending the newsletter to subscribers.</li>
            <li><strong>Embedded video</strong> — video players load only after you click, so no player cookies are set beforehand.</li>
          </ul>
          <p className="mt-3">
            Some providers operate outside your country. Where data leaves the EEA or UK, transfers rely
            on Standard Contractual Clauses or an equivalent safeguard.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">7. Retention</h2>
          <p className="mt-3">
            Contact messages are kept for as long as needed to resolve the enquiry and to record
            corrections. Newsletter subscriptions are kept until you unsubscribe. Analytics data is kept
            in summarised, aggregate form. Cookie lifetimes are listed in the Cookie Policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">8. Your rights</h2>
          <p className="mt-3">
            Depending on where you live you may have the right to access, correct, export, restrict, or
            delete your personal data, to object to processing, and to withdraw cookie consent at any
            time. EU/UK readers may rely on the GDPR; California readers may rely on the CCPA/CPRA,
            including the right to opt out of the sale or sharing of personal information. We do not sell
            your personal information.
          </p>
          <p className="mt-3">
            To make a request, use the{" "}
            <Link to="/contact" className="text-primary hover:underline">contact form</Link>. We
            respond within 30 days. You may also complain to your local data protection authority.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">9. Security</h2>
          <p className="mt-3">
            The site is served over HTTPS and access to reader data is limited to team members who need
            it. No system is perfectly secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">10. Changes and related documents</h2>
          <p className="mt-3">
            Material changes are reflected in the date at the top of this page. See also our{" "}
            <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>,{" "}
            <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link> and{" "}
            <Link to="/dmca" className="text-primary hover:underline">DMCA &amp; Copyright Notice</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
