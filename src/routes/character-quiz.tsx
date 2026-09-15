import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/ui-bits";
import { ShareBar } from "@/components/share-bar";
import { QUIZ, quizShareText, scoreQuiz } from "@/lib/character-quiz";

const TITLE = "Which Anime Character Are You? — Matched on Real Character Traits";
const DESC =
  "Six questions, then we match you against the personality traits our editors wrote for 42 anime characters — and show you exactly which traits matched, so you can check the result.";
const URL = "https://gamecastle.store/character-quiz";

export const Route = createFileRoute("/character-quiz")({
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
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: TITLE,
          url: URL,
          description: DESC,
          educationalLevel: "Beginner",
          about: { "@type": "Thing", name: "Anime characters" },
          publisher: {
            "@type": "Organization",
            name: "GameCastle Anime",
            url: "https://gamecastle.store/",
          },
        }),
      },
    ],
  }),
  component: CharacterQuizPage,
});

function CharacterQuizPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answered = Object.keys(answers).length;
  const result = useMemo(
    () => (answered === QUIZ.length ? scoreQuiz(answers) : null),
    [answers, answered],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Character Quiz" }]} />

      <h1 className="font-display text-4xl font-bold lg:text-5xl">
        Which anime character are you?
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Six questions. Your answers are tagged with personality traits, and we match those against
        the traits our editors wrote for 42 characters — then show you which ones matched, so the
        answer is something you can check rather than something you have to take our word for.
      </p>

      <div
        className="mt-8 h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={answered}
        aria-valuemin={0}
        aria-valuemax={QUIZ.length}
        aria-label="Questions answered"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${(answered / QUIZ.length) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {answered} of {QUIZ.length} answered
      </p>

      <ol className="mt-8 space-y-8">
        {QUIZ.map((question, index) => (
          <li key={question.id}>
            <h2 className="font-display text-lg font-bold">
              <span className="text-primary">{index + 1}.</span> {question.prompt}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {question.options.map((option) => {
                const picked = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={picked}
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [question.id]: option.id }))
                    }
                    className={`min-h-11 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      picked
                        ? "border-primary bg-primary/15 font-semibold text-primary"
                        : "border-border/60 bg-card/40 hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {answered === QUIZ.length && (
        <section className="mt-12">
          {result ? (
            <div
              className="rounded-2xl border p-6"
              style={{
                borderColor: `${result.character.accent}66`,
                background: `${result.character.accent}14`,
              }}
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Your closest match
              </p>
              <h2
                className="mt-2 font-display text-3xl font-bold"
                style={{ color: result.character.accent }}
              >
                {result.character.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.character.role} · {result.character.anime.replace(/-/g, " ")}
              </p>

              <p className="mt-4 text-sm">
                <strong>
                  Matched on {result.matched.length} of their {result.outOf} traits:
                </strong>{" "}
                {result.matched.join(", ")}
              </p>

              <p className="mt-4 leading-relaxed text-foreground/85">{result.character.bio}</p>

              {result.alternatives.length > 0 && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Close behind:{" "}
                  {result.alternatives
                    .map((alt) => `${alt.character.name} (${alt.matched})`)
                    .join(", ")}
                  . A quiz that hides the runners-up is hiding how close the call was.
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/character/$slug"
                  params={{ slug: result.character.slug }}
                  className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
                >
                  Read their full profile
                </Link>
                <button
                  type="button"
                  onClick={() => setAnswers({})}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 px-5 text-sm font-semibold hover:border-primary/60"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Start again
                </button>
              </div>

              <div className="mt-5">
                <ShareBar url={URL} text={quizShareText(result)} label="Share your result" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <h2 className="font-display text-xl font-bold">No match, honestly</h2>
              <p className="mt-2 text-muted-foreground">
                That combination of answers does not share a single trait with any character we have
                written up. Rather than hand you the closest name with nothing behind it, we would
                rather say so. Change an answer and it will find one.
              </p>
            </div>
          )}
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">How this is scored</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-foreground/85">
          <p>
            Every character page on this site carries a short list of personality traits written by
            our editors alongside the biography — &ldquo;Loyal&rdquo;, &ldquo;Blunt&rdquo;,
            &ldquo;Analytical&rdquo;, &ldquo;Reckless&rdquo;. Each answer above is tagged with
            traits taken from that same list. Your result is whichever character shares the most of
            them.
          </p>
          <p>
            Where two characters tie, the one with the shorter trait list wins: matching three of
            someone&apos;s four traits is a closer read than matching three of nine. And the card
            prints the traits it matched on, so you can open that character&apos;s page and check
            the claim.
          </p>
          <p>
            What it deliberately does not do is guarantee you a famous name. If your answers match
            nothing, it says nothing — which is rarer than you would think, but it is the only
            version of this quiz that is telling you something real.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">More to do here</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <li>
            <Link to="/gamer-card" className="text-primary hover:underline">
              Build your Taste Card
            </Link>
          </li>
          <li>
            <Link to="/characters" className="text-primary hover:underline">
              Every character we have written up
            </Link>
          </li>
          <li>
            <Link to="/anime" className="text-primary hover:underline">
              Browse the anime catalog
            </Link>
          </li>
          <li>
            <Link to="/my-list" className="text-primary hover:underline">
              Your watchlist
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
