import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute("/$locale/articles/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;
    
    // جلب القصة أو المقال من جدول المسودات أو الأنمي في Supabase
    let { data, error } = await supabase
      .from('anime_content_drafts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const { data: fallbackData } = await supabase
        .from('anime_nexus_matrix')
        .select('*')
        .or(`slug.eq.${slug},slug_ar.eq.${slug}`)
        .limit(1)
        .single();
      
      if (!fallbackData) throw notFound();
      return fallbackData;
    }

    return data;
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  component: function ArticleRoute() {
    const article = Route.useLoaderData();
    const displayTitle = article.title_ar || article.title;
    const displayDescription = article.description_ar || article.description;
    const displayImage = article.image || article.image_url;

    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 max-w-4xl mx-auto">
        <div className="mb-4 text-xs font-mono text-primary uppercase tracking-widest">
          PROGRAMMATIC STORY & LORE ⚡
        </div>
        
        {displayImage && (
          <div className="mb-8 aspect-video overflow-hidden rounded-3xl bg-secondary/50 border border-border/60 shadow-2xl">
            <img src={displayImage} alt={displayTitle} className="h-full w-full object-cover" />
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          {displayTitle}
        </h1>

        {displayDescription && (
          <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed">
            {displayDescription}
          </p>
        )}

        {article.content && (
          <div className="prose prose-invert max-w-none mt-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>
    );
  },
});
