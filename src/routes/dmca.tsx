import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { AlertTriangle } from "lucide-react";

const TITLE = "DMCA & Copyright Notice — AnimeVerse Takedown Process";
const DESC =
  "How to submit a DMCA takedown notice or counter-notice to AnimeVerse, what our designated agent needs, and our policy on fair-use commentary and repeat infringement.";
const URL = "https://verse-visions-anime.lovable.app/dmca";
const UPDATED = "July 2026";

export const Route = createFileRoute("/dmca")({
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
  component: DmcaPage,
});

function DmcaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "DMCA & Copyright" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">DMCA &amp; Copyright Notice</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <div className="mt-6 flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-foreground/85">
          AnimeVerse does not host, stream, upload, embed, or provide downloads of anime episodes, manga
          scans, or subtitle files. We publish original editorial writing. If you believe specific text or
          an image on this site infringes your copyright, the process below will get it reviewed quickly.
        </p>
      </div>

      <div className="mt-8 space-y-8 leading-relaxed text-foreground/85">
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">1. Our position on fair use</h2>
          <p className="mt-3">
            Series titles, character names, and limited reference to franchise material appear on this site
            for identification, criticism, review, and news reporting. All such marks and works remain the
            property of their rights holders. We are not affiliated with, sponsored by, or endorsed by any
            studio, publisher, or streaming platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">2. Submitting a takedown notice</h2>
          <p className="mt-3">
            Send your notice to our designated copyright agent at{" "}
            <a href="mailto:dmca@animeverse.example" className="text-primary hover:underline">dmca@animeverse.example</a>{" "}
            with the subject line "DMCA Takedown Request". A valid notice under 17 U.S.C. §512(c)(3) must include:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>Identification of the copyrighted work you claim has been infringed.</li>
            <li>The exact URL(s) on AnimeVerse of the material you want removed, and a description of it.</li>
            <li>Your name, mailing address, telephone number, and email address.</li>
            <li>A statement that you have a good-faith belief the use is not authorised by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in the notice is accurate and that, under penalty of perjury, you are the owner or authorised to act on the owner's behalf.</li>
            <li>Your physical or electronic signature.</li>
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">
            Notices missing these elements may be invalid and can delay review.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">3. What happens next</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>We acknowledge complete notices within two working days.</li>
            <li>We review the claim and, where appropriate, remove or disable access to the material.</li>
            <li>We notify the writer responsible for the content and record the action internally.</li>
            <li>Where we believe the use is lawful commentary, we will explain our reasoning in writing rather than remove it silently.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">4. Counter-notification</h2>
          <p className="mt-3">
            If your material was removed and you believe that was a mistake or misidentification, send a
            counter-notice to the same address including: identification of the removed material and its
            former URL; a statement under penalty of perjury that you have a good-faith belief it was
            removed in error; your name, address, and phone number; consent to the jurisdiction of a
            competent court; and your signature.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">5. Misuse and repeat infringement</h2>
          <p className="mt-3">
            Knowingly filing a false notice may expose you to liability for damages under §512(f). We
            terminate contributor access for anyone who repeatedly submits infringing material to us.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">6. Designated agent</h2>
          <div className="mt-3 rounded-xl border border-border/60 bg-card/40 p-5 text-sm">
            <div className="font-semibold text-foreground">Copyright Agent, AnimeVerse Editorial</div>
            <div className="mt-1 text-muted-foreground">Email: <a href="mailto:dmca@animeverse.example" className="text-primary hover:underline">dmca@animeverse.example</a></div>
            <div className="text-muted-foreground">Postal address available on request via the <Link to="/contact" className="text-primary hover:underline">contact form</Link>.</div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-foreground">7. Related documents</h2>
          <p className="mt-3">
            See our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>,{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
            <Link to="/editorial-policy" className="text-primary hover:underline">Editorial Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
