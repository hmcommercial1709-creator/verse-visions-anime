import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$-locale/articles/$slug')({
  component: ArticlePage,
})

function ArticlePage() {
  const { slug } = Route.useParams()
  const articleTitle = slug.replace(/-/g, ' ').toUpperCase()

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-amber-400 mb-6">{articleTitle}</h1>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl leading-relaxed space-y-4 text-slate-300">
          <p className="text-lg font-semibold text-white">الدليل الشامل والمحدث لعام 2026 لتفاصيل ومعلومات {articleTitle}.</p>
          <p>هذا المقال يتم توليد محتواه برمجياً لخدمة آلاف الكلمات المفتاحية وجذب الزوار المستهدفين من محركات البحث مباشرة.</p>
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-yellow-300 font-mono text-sm">
            نصائح هامة، استراتيجيات، وتحليلات عميقة تجدها حصرياً عبر منصتنا.
          </div>
        </div>
      </article>
    </div>
  )
}
