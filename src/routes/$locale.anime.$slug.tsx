import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/anime/$slug')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'anime')
      .eq('slug', params.slug)
      .eq('status', 'active')
      .maybeSingle()

    if (error) {
      console.error('Anime loading error:', error)
      return {
        anime: null,
        error: error.message,
      }
    }

    return {
      anime: data,
      error: null,
    }
  },

  component: AnimeMegaPage,
})

function AnimeMegaPage() {
  const { anime, error } = Route.useLoaderData()

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-2xl rounded-2xl border border-red-900 bg-red-950/30 p-8">
          <h1 className="mb-4 text-3xl font-bold text-red-400">
            حدث خطأ أثناء تحميل الأنمي
          </h1>

          <p className="text-slate-300">
            {error}
          </p>
        </div>
      </main>
    )
  }

  if (!anime) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            الأنمي غير موجود
          </h1>

          <p className="mt-3 text-slate-400">
            لم يتم العثور على هذا الأنمي في قاعدة البيانات.
          </p>
        </div>
      </main>
    )
  }

  const metadata =
    anime.metadata &&
    typeof anime.metadata === 'object'
      ? anime.metadata as Record<string, unknown>
      : {}

  const genres = Array.isArray(metadata.genres)
    ? metadata.genres.map(String)
    : []

  const episodes =
    metadata.episodes !== null &&
    metadata.episodes !== undefined
      ? String(metadata.episodes)
      : 'غير محدد'

  const score =
    metadata.average_score !== null &&
    metadata.average_score !== undefined
      ? `${metadata.average_score}/100`
      : 'غير محدد'

  const year =
    metadata.season_year !== null &&
    metadata.season_year !== undefined
      ? String(metadata.season_year)
      : 'غير محدد'

  const animeStatus =
    metadata.status !== null &&
    metadata.status !== undefined
      ? String(metadata.status)
      : 'غير محدد'

  const studios = Array.isArray(metadata.studios)
    ? metadata.studios
    : []

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[280px_1fr]">
            <div>
              {anime.image_url ? (
                <img
                  src={anime.image_url}
                  alt={anime.name}
                  className="w-full rounded-2xl border border-slate-800 shadow-2xl"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
                  لا توجد صورة
                </div>
              )}
            </div>

            <div>
              {genres.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                {anime.name}
              </h1>

              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
                {anime.description ||
                  `دليل شامل عن ${anime.name} يتضمن المعلومات المتوفرة من قاعدة بيانات الأنمي.`}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <InfoCard
                  title="الحلقات"
                  value={episodes}
                />

                <InfoCard
                  title="التقييم"
                  value={score}
                />

                <InfoCard
                  title="السنة"
                  value={year}
                />

                <InfoCard
                  title="الحالة"
                  value={animeStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="mb-5 text-3xl font-bold">
                {anime.name} - الدليل الشامل
              </h2>

              <p className="leading-8 text-slate-300">
                {anime.description ||
                  `اكتشف جميع المعلومات المتوفرة عن ${anime.name}.`}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="mb-6 text-2xl font-bold">
                معلومات الأنمي
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  title="النوع"
                  value="Anime"
                />

                <InfoRow
                  title="عدد الحلقات"
                  value={episodes}
                />

                <InfoRow
                  title="التقييم"
                  value={score}
                />

                <InfoRow
                  title="سنة الإصدار"
                  value={year}
                />

                <InfoRow
                  title="الحالة"
                  value={animeStatus}
                />
              </div>
            </article>
          </div>

          <aside>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-5 text-xl font-bold">
                الاستوديو
              </h2>

              {studios.length > 0 ? (
                <div className="space-y-3">
                  {studios.map((studio, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-slate-950 p-4 text-slate-300"
                    >
                      {typeof studio === 'object' &&
                      studio !== null &&
                      'name' in studio
                        ? String(
                            (studio as { name?: unknown }).name ?? '',
                          )
                        : String(studio)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">
                  لا توجد معلومات عن الاستوديو.
                </p>
              )}
            </div>

            {anime.source_url && (
              <a
                href={anime.source_url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 block rounded-xl bg-indigo-600 px-5 py-4 text-center font-bold transition hover:bg-indigo-500"
              >
                المصدر الأصلي
              </a>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

function InfoCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className="mt-1 font-bold text-white">
        {value}
      </div>
    </div>
  )
}

function InfoRow({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className="mt-1 font-semibold text-slate-200">
        {value}
      </div>
    </div>
  )
}
