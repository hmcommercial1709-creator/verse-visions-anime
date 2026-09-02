import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink } from "lucide-react";
import { findFreeVideoFiles } from "@/lib/free-video-downloads";

export function FreeVideoDownloads({ title, autoSearch = false }: { title: string; autoSearch?: boolean }) {
  const [requested, setRequested] = useState(autoSearch);
  const query = useQuery({
    queryKey: ["free-video-files", title],
    queryFn: ({ signal }) => findFreeVideoFiles(title, signal),
    enabled: requested,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
  return <div className="mt-5 border-t border-slate-700 pt-4">
    <button type="button" disabled={query.isFetching} onClick={() => { if (!requested) setRequested(true); else void query.refetch(); }} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/60 px-4 py-2 text-base text-cyan-300 disabled:opacity-60"><Download size={18} />{query.isFetching ? "Finding free downloads…" : query.isError ? "Retry download search" : "Find free downloads"}</button>
    {requested && <div aria-live="polite" className="mt-3 text-base text-slate-300">
      {query.isError && <p>The source could not be reached. Retry the search in a moment.</p>}
      {query.isSuccess && query.data.length === 0 && <p>No matching openly licensed video was found in this source for “{title}”. This does not mean a free full episode is available elsewhere.</p>}
      {query.isSuccess && query.data.length > 0 && <><p>Downloadable files from open-media sources. These are title matches, not a verified episode list.</p><ul className="mt-3 space-y-4">{query.data.map((file) => <li key={file.url} className="rounded-lg border border-slate-700 p-4">
        <p className="break-words font-semibold text-white">{file.title}</p>
        <p className="mt-2 text-sm">{file.provider} · {file.license} · {file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "Size unavailable"}</p>
        {file.rightsSource && <a href={file.rightsSource} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm underline">Public-domain status and original source</a>}
        <p className="mt-1 break-words text-sm">Credit: {file.author}</p>
        <div className="mt-3 flex flex-wrap gap-4"><a href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-black"><Download size={18} /> Open video file</a><a href={file.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline">Source, license & credits <ExternalLink size={16} /></a></div>
      </li>)}</ul><p className="mt-3 text-sm">To download, open the video file and choose “Save video as” or the player’s download option. Follow the license and attribution details on the source page.</p></>}
    </div>}
  </div>;
}

export function FreeDownloadSearch() {
  const id = useId();
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  return <section id="free-downloads" className="mb-8 rounded-2xl border border-cyan-300/25 bg-[#101721] p-5 sm:p-6">
    <h2 className="font-display text-2xl font-bold">Free video downloads</h2>
    <p className="mt-2 text-base text-slate-300">Search for public-domain and openly licensed videos by title. Many modern anime series have no free full-episode download here.</p>
    <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); if (input.trim().length >= 2) setTitle(input.trim()); }}>
      <div className="min-w-0 flex-1"><label htmlFor={id} className="mb-2 block text-sm text-slate-300">Film or video title</label><input id={id} value={input} onChange={(event) => setInput(event.target.value)} required minLength={2} maxLength={160} placeholder="e.g. Namakura Gatana" className="w-full rounded-lg border border-slate-600 bg-black/30 px-4 py-3 text-base text-white" /></div>
      <button type="submit" className="rounded-lg bg-cyan-300 px-5 py-3 text-base font-bold text-black">Find downloads</button>
    </form>
    <button type="button" onClick={() => { setInput("Namakura Gatana"); setTitle("Namakura Gatana"); }} className="mt-3 text-sm text-cyan-300 underline">Try a classic anime film: Namakura Gatana (1917)</button>
    {title && <FreeVideoDownloads key={title} title={title} autoSearch />}
  </section>;
}
