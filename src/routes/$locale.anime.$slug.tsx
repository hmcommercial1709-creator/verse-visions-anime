import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/anime/$slug')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('entities')
      .select(`
        id,
        entity_type,
        slug,
        name,
        description,
        image_url,
        metadata,
        source_url
      `)
      .eq('entity_type', 'anime')
      .eq('slug', params.slug)
      .eq('status', 'active')
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to load anime: ${error.message}`)
    }

    return {
      anime: data,
    }
  },

  component: AnimeMegaPage,
})

function AnimeMegaPage() {
  const { anime } = Route.useLoaderData()

  if (!anime) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">
            الأنمي غير موجود
          </h1>

          <p className="text-slate-400">
            لم يتم العثور على هذا الأنمي في قاعدة البيانات.
          </p>
        </div>
      </main>
    )
  }

  const metadata =
    (anime.metadata ?? {}) as Record<string, unknown>

  const genres = Array.isArray(metadata.genres)
    ? metadata.genres.map(String)
    : []

  const episodes =
    typeof metadata.episodes === 'number'
      ? metadata.episodes
      : null

  const score =
    typeof metadata.average_score === 'number'
      ? metadata.average_score
      : null

  const year =
    typeof metadata.season_year === 'number'
      ? metadata.season_year
      : null

  const status =
    typeof metadata.status === 'string'
      ? metadata.status
      : null

  const studioList = Array.isArray(metadata.studios)
    ? metadata.studios
    : []

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            
            {anime.image_url ? (
              <img
                src={anime.image_url}
                alt={anime.name}
                className="w-full max-w-[280px] rounded-2xl border border-slate-800 shadow-2xl"
              />
            ) : (
              <div className="aspect-[2/3] w-full max-w-[280px] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                No Image
              </div>
            )}

            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300 border border-indigo-500/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                {anime.name}
              </h1>

              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
                {anime.description ||
                  `دليل شامل عن ${anime.name} يتضمن المعلومات الأساسية والحلقات والتصنيف والاستوديو.`}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {year !== null && (
                  <InfoCard
                    label="السنة"
                    value={String(year)}
                  />
                )}

                {episodes !== null && (
                  <InfoCard
                    label="الحلقات"
                    value={String(episodes)}
                  />
                )}

                {score !== null && (
                  <InfoCard
                    label="التقييم"
                    value={`${score}/100`}
                  />
                )}

                {status && (
                  <InfoCard
                    label="الحالة"
                    value={status}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-8">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
              <h2 className="text-2xl font-bold mb-5">
                {anime.name} — الدليل الشامل
              </h2>

              <p className="leading-8 text-slate-300">
                {anime.description ||
                  `اكتشف كل المعلومات المتوفرة عن ${anime.name}، بما في ذلك القصة والحلقات والتصنيف والاستوديو والتفاصيل الأساسية.`}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
              <h2 className="text-2xl font-bold mb-5">
                معلومات الأنمي
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  label="النوع"
                  value="Anime"
                />

                {year !== null && (
                  <InfoRow
                    label="سنة الإصدار"
                    value={String(year)}
                  />
                )}

                {episodes !== null && (
                  <InfoRow
                    label="عدد الحلقات"
                    value={String(episodes)}
                  />
                )}

                {score !== null && (
                  <InfoRow
                    label="التقييم"
                    value={`${score}/100`}
                  />
                )}

                {status && (
                  <InfoRow
                    label="الحالة"
                    value={status}
                  />
                )}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-bold mb-5">
                الاستوديو
              </h2>

              {studioList.length > 0 ? (
                <div className="space-y-3">
                  {studioList.map((studio, index) => {
                    const studioName =
                      typeof studio === 'object' &&
                      studio !== null &&
                      'name' in studio
                        ? String(
                            (studio as { name?: unknown }).name ??
                              '',
                          )
                        : String(studio)

                    return (
                      <div
                        key={`${studioName}-${index}`}
                        className="rounded-xl bg-slate-950 p-4 text-slate-200"
                      >
                        {studioName}
                      </div>
                    )
                  })}
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
                className="block rounded-xl bg-indigo-600 px-5 py-4 text-center font-bold transition hover:bg-indigo-500"
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
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="text-sm text-slate-500">
        {label}
      </div>

      <div className="mt-1 font-bold text-white">
        {value}
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="text-sm text-slate-500">
        {label}
      </div>

      <div className="mt-1 font-semibold text-slate-200">
        {value}
      </div>
    </div>
  )
}
