import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/$locale/articles/$slug")({
  loader: async () => {
    // جلب القصص والمقالات من Supabase مع جلب كميات كبيرة
    const { data, error } = await supabase
      .from('anime_content_drafts')
      .select('slug, title, title_ar, description, description_ar, image, image_url')
      .limit(100);

    if (error || !data || data.length === 0) {
      const { data: fallbackData } = await supabase
        .from('anime_nexus_matrix')
        .select('slug, title, title_ar, description, description_ar')
        .limit(100);
      return fallbackData || [];
    }

    return data;
  },
  component: function ArticlesIndexPage() {
    const articles = Route.useLoaderData();
    const { locale } = Route.useParams();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredArticles = articles.filter((item: any) => {
      const title = item.title_ar || item.title || "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">
            PROGRAMMATIC LORE & STORIES MATRIX ⚡
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            أرشيف القصص والمسودات الحصرية
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            تصفح آلاف القصص، التحليلات، والمسودات البرمجية المولدة تلقائياً لنيل أفضل تغطية بحثية.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <input 
            type="text"
            placeholder="ابحث في الأرشيف الضخم..."
            value5={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-card/60 border border-primary/30 focus:border-primary focus:outline-none text-sm backdrop-blur-xl shadow-2xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article: any, index: number) => {
            const title = article.title_ar || article.title || "عنوان غير متوفر";
            const desc = article.description_ar || article.description || "لا يوجد وصف مختصر متاح حالياً...";
            const slug = article.slug;
            const img = article.image || article.image_url;

            return (
              <Link 
                key={index} 
                to="/$locale/articles/$slug" 
                params={{ locale, slug }}
                className="group p-6 rounded-3xl bg-card/40 border border-border/60 hover:border-primary/60 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:scale-[1.02]"
              >
                <div>
                  {img && (
                    <div className="mb-4 aspect-video overflow-hidden rounded-2xl bg-secondary/40">
                      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <h3 className="text-lg font-black mb-2 text-foreground group-hover:text-primary transition line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>
                <div className="text-xs font-bold text-primary flex items-center gap-1 mt-auto">
                  اقرأ القصة كاملة ⚡
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  },
});
