import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from '@/integrations/supabase/client';

type CodeItem = {
  slug: string;
  title: string;
  target_language: string;
  target_market: string;
  aggregate_rating: string | null;
  reviews_count: number | null;
  sample_review: string | null;
  updated_at: string | null;
};

export const Route = createFileRoute("/$locale/codes/$slug")({
  loader: async ({ params }): Promise<CodeItem> => {
    const { slug } = params;

    const { data, error } = await supabase
      .from('game_nexus_matrix')
      .select('slug, title, target_language, target_market, aggregate_rating, reviews_count, sample_review, updated_at')
      .eq('slug', slug)
      .single();

    if (error || !data) throw notFound();
    return data;
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | GameCastle` },
          {
            name: "description",
            content: `Activation guide for ${loaderData.title} in the ${loaderData.target_market} market (${loaderData.target_language}).`,
          },
        ]
      : [],
  }),
  component: function ProgrammaticCodePage() {
    const codeItem = Route.useLoaderData();
    const rating = Number(codeItem.aggregate_rating);

    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 max-w-3xl mx-auto">
        <div className="mb-4 text-xs font-mono text-accent uppercase tracking-widest">
          GAMING CODES &amp; GIFT CARDS
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          {codeItem.title}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6 text-sm">
          <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1">
            Market: {codeItem.target_market}
          </span>
          <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1">
            Language: {codeItem.target_language}
          </span>
          {Number.isFinite(rating) && rating > 0 && (
            <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1">
              ⭐ {rating.toFixed(1)}
              {codeItem.reviews_count ? ` (${codeItem.reviews_count} reviews)` : ""}
            </span>
          )}
        </div>

        {codeItem.sample_review && (
          <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed">
            {codeItem.sample_review}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Follow your platform's redemption instructions and confirm your account is eligible for{" "}
          {codeItem.target_market} before activating.
        </p>
      </div>
    );
  },
});
