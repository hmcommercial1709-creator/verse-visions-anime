import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

const TITLE = "Terms of Service — Using AnimeVerse";
const DESC =
  "The terms governing your use of AnimeVerse: acceptable use, intellectual property and fair-use commentary, user submissions, affiliate and advertising disclosure, and liability limits.";
const URL = "https://verse-visions-anime.lovable.app/terms";
const UPDATED = "July 2026";

export const Route = createFileRoute("/terms")({
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
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Terms of Service" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-foreground/85">
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">1. Acceptance</h2>
          <p className="mt-3">
            By accessing AnimeVerse you agree to these terms. If you do not agree, please stop using the
            site. These terms apply to every page, including anime hubs, episode guides, character
            profiles, and articles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">2. What AnimeVerse is</h2>
          <p className="mt-3">
            AnimeVerse is an editorial publication. We publish reviews, analysis, recaps, watch orders,
            and news commentary. We do <strong>not</strong> host, stream, embed, upload, or provide
            downloads of anime episodes, manga chapters, subtitle files, or any other copyrighted media.
            Where we mention where a series is available, that is informational only.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">3. Intellectual property</h2>
          <p className="mt-3">
            Article text, rankings, structure, and original graphics on this site belong to AnimeVerse and
            may not be republished in full without written permission. You may quote a short excerpt with
            clear attribution and a link back.
          </p>
          <p className="mt-3">
            All anime titles, characters, logos, and franchise imagery referenced on this site are the
            property of their respective rights holders. They appear here for identification and
            commentary as part of criticism and reporting. AnimeVerse claims no ownership of, and is not
            affiliated with or endorsed by, any studio, publisher, or streaming service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">4. Acceptable use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Do not scrape, mirror, or bulk-copy the site or use it to train models without permission.</li>
            <li>Do not attempt to breach, overload, or probe our infrastructure.</li>
            <li>Do not misrepresent our content, or present it as your own or as an official source.</li>
            <li>Do not use the site to distribute unlawful, harassing, or infringing material.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">5. Submissions</h2>
          <p className="mt-3">
            If you send us a tip, pitch, or correction, you confirm it is yours to send and you grant us
            permission to use it in our reporting. We may edit submissions for length and clarity. We do
            not treat submissions as confidential unless you ask and we agree in writing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">6. Advertising and affiliate disclosure</h2>
          <p className="mt-3">
            This site is funded by display advertising and a small number of affiliate partnerships. Some
            outbound retail links may earn us a commission at no extra cost to you. Sponsored content is
            labelled as such, and commercial relationships never determine a review score. See our{" "}
            <Link to="/editorial-policy" className="text-primary hover:underline">editorial policy</Link> and{" "}
            <Link to="/privacy" className="text-primary hover:underline">privacy policy</Link> for detail.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">7. Opinions, spoilers, and accuracy</h2>
          <p className="mt-3">
            Reviews and rankings are the opinion of the credited writer. We fact-check against primary
            sources and correct errors when they are reported, but we make no warranty that all content
            is complete or current. Plot discussion may contain spoilers; we mark major ones, but
            spoiler-sensitive readers should proceed with care.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">8. Third-party links</h2>
          <p className="mt-3">
            We link to external sites we do not control. We are not responsible for their content,
            policies, or availability.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">9. Availability and changes</h2>
          <p className="mt-3">
            The site is provided "as is" and "as available". We may change, move, or retire pages,
            features, or this document at any time. Material changes to these terms are reflected in the
            date above.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">10. Limitation of liability</h2>
          <p className="mt-3">
            To the fullest extent permitted by law, AnimeVerse is not liable for indirect or consequential
            loss arising from your use of the site or reliance on its content. Nothing here limits rights
            that cannot be limited by law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">11. Copyright complaints</h2>
          <p className="mt-3">
            Rights holders should follow the process on our{" "}
            <Link to="/dmca" className="text-primary hover:underline">DMCA &amp; Copyright Notice</Link> page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">12. Contact</h2>
          <p className="mt-3">
            Questions about these terms: <a href="mailto:legal@animeverse.example" className="text-primary hover:underline">legal@animeverse.example</a> or the{" "}
            <Link to="/contact" className="text-primary hover:underline">contact form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
