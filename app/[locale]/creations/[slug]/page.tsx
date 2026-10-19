import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { GemSpecs } from "@/components/product/GemSpecs";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductSelectionProvider } from "@/components/product/ProductSelection";
import { JsonLd } from "@/components/seo/JsonLd";
import { products } from "@/data/products";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCollection, getProduct, getProducts } from "@/lib/commerce";
import { alternatesFor } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = PageProps<"/[locale]/creations/[slug]">;

async function load(props: Props) {
  const { slug } = await props.params;
  const locale = (await rootLocale()) as Locale;
  const product = await getProduct(slug, locale);
  if (!product) notFound();
  const collection = await getCollection(product.collection, locale);
  if (!collection) notFound();
  return { product, collection, locale };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { product, locale } = await load(props);
  const t = await getTranslations("Product");
  return {
    title: t("metaTitle", { name: product.name, summary: product.summary }),
    description: product.description,
    alternates: alternatesFor(
      { pathname: "/creations/[slug]", params: { slug: product.slug } },
      locale,
    ),
  };
}

export default async function ProductPage(props: Props) {
  const { product, collection, locale } = await load(props);
  const t = await getTranslations("Product");
  const m = await getTranslations("Materials");
  const related = (await getProducts(locale, product.collection))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);
  const collectionHref = {
    pathname: "/collections/[collection]",
    params: { collection: collection.slug },
  } as const;
  const productHref = { pathname: "/creations/[slug]", params: { slug: product.slug } } as const;
  const [firstSentence, ...rest] = product.description.split(/(?<=[.!?])\s+/);

  return (
    <div data-ambiance={collection.slug}>
      <JsonLd data={productJsonLd(product, locale, m(`metals.${product.metals[0]!.id}`))} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: t("home"), href: "/" },
            { name: collection.name, href: collectionHref },
            { name: product.name, href: productHref },
          ],
          locale,
        )}
      />

      <nav aria-label={t("breadcrumb")} className="grille pt-8 lg:pt-10">
        <ol className="surtitre col-span-12 flex flex-wrap items-center gap-x-3 gap-y-1 text-encre-douce">
          <li>
            <Link href="/" className="lien-fin">
              {t("home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={collectionHref} className="lien-fin">
              {collection.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-encre">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductSelectionProvider
        defaultMetal={product.metals[0]!.id}
        defaultSize={product.sizes?.default}
      >
        <div className="grille gap-y-12 pt-8 lg:pt-12">
          <div className="col-span-12 lg:col-span-7">
            <div className="lg:sticky lg:top-[calc(var(--entete)+2rem)]">
              <ProductGallery product={product} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="surtitre text-encre-douce">
              {m(`categories.${product.category}`)} ·{" "}
              {t("reference", { reference: product.reference })}
            </p>
            <h1 className="mt-5 text-titre-2">{product.name}</h1>
            <p className="mt-4 font-display text-chapeau text-encre-douce italic">
              {product.summary}
            </p>
            <div className="mt-8">
              <ProductPurchase product={product} />
            </div>
            <p className="mt-10 text-petit text-encre-douce">{t("promise")}</p>
          </div>
        </div>
      </ProductSelectionProvider>

      <section aria-labelledby="piece" className="grille gap-y-10 pt-section">
        <h2 id="piece" className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3">
          {t("storyTitle")}
        </h2>
        <div className="col-span-12 lg:col-span-7" data-reveal>
          <p className="font-display text-titre-3 font-light">{firstSentence}</p>
          <p className="mt-8 max-w-[60ch] text-encre-douce lg:ml-[16.66%]">{rest.join(" ")}</p>
        </div>
      </section>

      <section aria-labelledby="specs" className="grille gap-y-10 pt-section">
        <h2 id="specs" className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3">
          {t("specsTitle")}
        </h2>
        <div className="col-span-12 lg:col-span-9">
          <GemSpecs product={product} />
        </div>
      </section>

      <section aria-labelledby="provenance" className="grille gap-y-8 pt-section">
        <h2
          id="provenance"
          className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3"
        >
          {t("provenanceTitle")}
        </h2>
        <div className="col-span-12 border-y border-filet py-10 lg:col-span-9" data-reveal>
          <ol className="grid gap-8 sm:grid-cols-3">
            {[
              { label: t("journeyMine"), value: product.stones[0]?.origin },
              { label: t("journeyCut"), value: t("journeyCutValue") },
              { label: t("journeyAtelier"), value: t("journeyAtelierValue") },
            ].map((step, i) => (
              <li key={step.label}>
                <span className="surtitre flex items-center gap-3 text-encre-douce">
                  <span className="chiffres text-chapeau normal-case">0{i + 1}</span>
                  {step.label}
                </span>
                <span className="mt-2 block font-display text-chapeau">{step.value}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[52ch] text-petit text-encre-douce">{t("provenanceText")}</p>
            <Link
              href={{ pathname: "/provenance/[code]", params: { code: product.provenanceCode } }}
              className="surtitre lien-fin shrink-0"
            >
              {t("provenanceLink")} · {product.provenanceCode}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related" className="grille gap-y-10 pt-section">
          <h2 id="related" className="col-span-12 text-titre-2">
            {t("related")}
          </h2>
          {related.map((p) => (
            <div key={p.slug} className="col-span-12 sm:col-span-4" data-reveal>
              <ProductCard product={p} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
