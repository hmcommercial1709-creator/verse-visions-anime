import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/anime/$slug')({
  component: AnimeMegaPage,
})

function AnimeMegaPage() {
  const { slug } = Route.useParams()
  const charName = slug.replace(/-/g, ' ').toUpperCase()

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-extrabold text-indigo-400 mb-6">{charName} - الدليل الشامل</h1>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <p className="text-slate-300">هنا ستظهر كافة المعلومات، القوى، وتاريخ الشخصية الذي سيتم جلبه من قاعدة بيانات الأنمي الخاصة بك لتوليد آلاف الصفحات فورياً.</p>
        <button className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg font-bold">تصفح أقوى اللحظات</button>
      </div>
    </div>
  )
}
