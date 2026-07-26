/** Editorial comparison table — scrolls horizontally on mobile, zero CLS. */
export function ComparisonTable({
  columns,
  rows,
  caption,
}: {
  columns: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/40">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-primary/10">
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="border-b border-border/60 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="odd:bg-background/40">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`border-b border-border/40 px-4 py-3 align-top ${
                      i === 0 ? "font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
