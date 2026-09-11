import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute("/$locale/codes/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;
    
    // جلب بيانات الأكواد والبطاقات من جدول الألعاب والماتركس في Supabase
    let { data, error } = await supabase
      .from('game_nexus_matrix')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const { data: fallbackData } = await supabase
        .from('game_nexus_matrix')
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
  component: function ProgrammaticCodePage() {
    const codeItem = Route.useLoaderData();
    const displayTitle = codeItem.title_ar || codeItem.title || codeItem.name;
    const displayDescription = codeItem.description_ar || codeItem.description;

    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 max-w-4xl mx-auto">
        <div className="mb-4 text-xs font-mono text-accent uppercase tracking-widest">
          GAMING CODES & GIFT CARDS MATRIX ⚡
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          {displayTitle}
        </h1>

        {displayDescription && (
          <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed">
            {displayDescription}
          </p>
        )}

        {codeItem.content && (
          <div className="prose prose-invert max-w-none mt-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: codeItem.content }} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 bg-card/60 border border-primary/20 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div>
            <h3 className="text-lg font-bold mb-3 text-accent">Code/Node Manifest</h3>
            <pre className="bg-background/80 p-4 rounded-2xl text-xs text-emerald-400 overflow-x-auto border border-border">
              {JSON.stringify(codeItem.neural_node_data || codeItem, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">Matrix Attributes</h3>
            <pre className="bg-background/80 p-4 rounded-2xl text-xs text-purple-400 overflow-x-auto border border-border">
              {JSON.stringify(codeItem.matrix_metrics || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
});
