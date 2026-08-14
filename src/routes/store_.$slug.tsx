import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import {
  StoreBuyButton,
  StoreProductGrid,
  StoreProductImage,
  StorePriceDisplay,
} from "@/components/store-product-card";
import {
  getStoreProduct,
  relatedStoreProducts,
  storeProductPrice,
  storeProductSku,
  storeRetailer,
} from "@/data/store-products";
import { storePriceLabel } from "@/data/store-pricing";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/store_/$slug")({
  loader: ({ params }) => {
    const product = getStoreProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found | GameCastle" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.shortTitle} | GameCastle`;
    const url = absoluteUrl(`/store/${product.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        {
          name: "robots",
          content:
            product.indexable === false
              ? "noindex, follow"
              : "index, follow, max-snippet:-1, max-image-preview:large",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(product.imageUrl.startsWith("http")
          ? [{ property: "og:image", content: product.imageUrl }]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: product.description },
        ...(product.imageUrl.startsWith("http")
          ? [{ name: "twitter:image", content: product.imageUrl }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": `${url}#product`,
            url,
            name: product.shortTitle,
            description: product.description,
            sku: storeProductSku(product),
            brand: {
              "@type": "Brand",
              name: storeRetailer(product),
            },
            image: [product.imageUrl],
            offers: {
              "@type": "Offer",
              price: storeProductPrice(product),
              priceCurrency: product.price.currency,
              availability:
                product.price.availability === "OutOfStock"
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
              url: product.affiliateUrl,
              seller: {
                "@type": "Organization",
                name: storeRetailer(product),
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemPage",
            "@id": `${url}#page`,
            url,
            name: product.shortTitle,
            headline: product.title,
            description: product.description,
            inLanguage: "en",
            ...(product.imageUrl.startsWith("http")
              ? {
                  primaryImageOfPage: {
                    "@type": "ImageObject",
                    url: product.imageUrl,
                  },
                }
              : {}),
            about: {
              "@type": "Thing",
              name: product.shortTitle,
              description: product.description,
              identifier: storeProductSku(product),
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { path: "/", name: "Home" },
              { path: "/store", name: "Store" },
              { name: product.shortTitle },
            ]),
          ),
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const retailer = storeRetailer(product);
  const sku = storeProductSku(product);
  const related = relatedStoreProducts(product, 4);
  const alsoLike = relatedStoreProducts(product, 8).slice(4);

  return (
    <article className="pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to GameCastle Store
        </Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="group overflow-hidden rounded-3xl border border-border/60 bg-white shadow-2xl shadow-black/20">
            <StoreProductImage
              product={product}
              eager
              className="aspect-square w-full"
            />
          </div>
          <div className="lg:py-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {product.collection}
            </div>
            <h1 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {product.purchaseNotice && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/35 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <p>
                  <strong>Check before purchase:</strong>{" "}
                  {product.purchaseNotice}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs font-semibold"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#ff9900]/30 bg-[#ff9900]/5 p-5">
              <div className="flex items-center gap-2 font-bold">
                <ShoppingBag className="h-5 w-5 text-[#ff9900]" /> Price &amp;
                availability
              </div>
              <StorePriceDisplay product={product} className="mt-3" />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Final checkout price, seller, delivery, taxes and regional
                availability are confirmed on {retailer} and may change.
              </p>
              <StoreBuyButton
                product={product}
                className="mt-5 w-full sm:w-auto"
              />
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p>
                Checkout, payment, delivery and applicable returns are handled
                by {retailer} and the selected seller. GameCastle may earn a
                commission from qualifying purchases.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Product overview
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              What to know before purchase
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
              {product.longDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="rounded-2xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-display text-xl font-bold">Product details</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <Detail label="Collection" value={product.collection} />
              <Detail
                label="Categories"
                value={product.categories.join(", ")}
              />
              <Detail
                label={retailer === "Amazon" ? "Amazon ASIN" : "Play-Asia item code"}
                value={sku}
              />
              <Detail label="Retailer" value={retailer} />
              <Detail label="Price" value={storePriceLabel(product.price)} />
            </dl>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              View {retailer} listing <ExternalLink className="h-4 w-4" />
            </a>
          </aside>
        </section>

        <section className="mt-16 border-t border-border/50 pt-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Related products
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold">
            More from this collection
          </h2>
          <div className="mt-7">
            <StoreProductGrid products={related} />
          </div>
        </section>

        {alsoLike.length > 0 && (
          <section className="mt-16 border-t border-border/50 pt-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Customers also like
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              Continue exploring GameCastle picks
            </h2>
            <div className="mt-7">
              <StoreProductGrid products={alsoLike} />
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-foreground">{value}</dd>
    </div>
  );
}
