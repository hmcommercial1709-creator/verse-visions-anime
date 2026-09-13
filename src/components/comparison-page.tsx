import { Link } from "@tanstack/react-router";
import { CatalogRewards } from "@/components/catalog-rewards";
import type { CatalogType } from "@/lib/catalog/matrix";
import type { ComparisonData } from "@/lib/catalog/comparison";

/**
 * A head-to-head page.
 *
 * The table is the content: two stored records placed side by side with the
 * rows that exist on both. Nothing is asserted about which is "better" beyond
 * marking which side a given number favours, because that is all the data
 * supports — an opinion would be us inventing one.
 */
export function ComparisonPage({ type, data }: { type: CatalogType; data: ComparisonData }) {
  const detailRoute = type === "game" ? "/catalog/games/$slug" : "/catalog/anime/$slug";
  const parentPath = type === "game" ? "/catalog/games" : "/anime";
  const heading = `${data.a.name} vs ${data.b.name}`;

  const Side = ({ side }: { side: ComparisonData["a"] }) => (
    <Link
      to={detailRoute as "/catalog/anime/$slug"}
      params={{ slug: side.slug }}
      className="group flex flex-col items-center rounded-2xl border border-border/60 bg-card/40 p-4 text-center hover:border-primary/60"
    >
      {side.image && (
        <img
          src={side.image}
          alt={side.name}
          width={150}
          height={210}
          className="w-32 rounded-xl object-cover"
        />
      )}
      <h2 className="mt-3 text-sm font-bold group-hover:text-primary">{side.name}</h2>
    </Link>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        <span className="mx-1">/</span>
        <Link to={parentPath as "/anime"} className="hover:text-foreground">
          {type === "game" ? "Games" : "Anime"}
        </Link>{" "}
        <span className="mx-1">/</span> {heading}
      </nav>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">{heading}</h1>
      <p className="mt-3 text-muted-foreground">
        {data.shared.length > 0
          ? `Both are ${data.shared.join(" and ")} ${type === "game" ? "games" : "titles"}, compared on the ${data.rows.length} figures the catalog stores for each.`
          : `Compared on the ${data.rows.length} figures the catalog stores for each.`}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Side side={data.a} />
        <Side side={data.b} />
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{heading} — stored figures compared</caption>
          <thead>
            <tr className="border-b border-border/60 text-left">
              <th scope="col" className="py-2 pr-4 font-semibold">
                Measure
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {data.a.name}
              </th>
              <th scope="col" className="py-2 font-semibold">
                {data.b.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.label} className="border-b border-border/40">
                <th scope="row" className="py-2.5 pr-4 text-left font-normal text-muted-foreground">
                  {row.label}
                </th>
                <td className={`py-2.5 pr-4 ${row.winner === "a" ? "font-bold text-primary" : ""}`}>
                  {row.a ?? "—"}
                </td>
                <td className={`py-2.5 ${row.winner === "b" ? "font-bold text-primary" : ""}`}>
                  {row.b ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CatalogRewards />
    </div>
  );
}
