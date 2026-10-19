import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { collections } from "@/data/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCollection, getCollections, getProducts } from "@/lib/commerce";
import { alternatesFor } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

type Props = PageProps<"/[locale]/collections/[collection]">;

async function load(props: Props) {
  const { collection: slug } = await props.params;
  const locale = (await rootLocale()) as Locale;
  const collection = await getCollection(slug, locale);
  if (!collection) notFound();
  return { collection, locale };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { collection, locale } = await load(props);
  const t = await getTranslations("Collection");
  return {
    title: `${collection.name} — ${collection.tagline}`,
    description: t("metaDescription", {
      tagline: collection.tagline,
      stones: collection.stonesLine,
      name: collection.name,
    }),
    alternates: alternatesFor(
      { pathname: "/collections/[collection]", params: { collection: collection.slug } },
      locale,
    ),
  };
}

/* Mise en page éditoriale asymétrique, pièce par pièce (grand écran). */
const layout = [
  "col-span-12 lg:col-span-7",
  "col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-[38%]",
  "col-span-6 lg:col-span-4 lg:col-start-2",
  "col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-7 lg:mt-[24%]",
  "col-span-12 lg:col-span-6 lg:col-start-3",
];

export default async function CollectionPage(props: Props) {
  const { collection, locale } = await load(props);
  const t = await getTranslations("Collection");
  const nav = await getTranslations("Product");
  const [pieces, all] = await Promise.all([
    getProducts(locale, collection.slug),
    getCollections(locale),
  ]);
  const next = all[(all.findIndex((c) => c.slug === collection.slug) + 1) % all.length]!;
  const href = {
    pathname: "/collections/[collection]",
    params: { collection: collection.slug },
  } as const;

  return (
    <div data-ambiance={collection.slug}>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: nav("home"), href: "/" },
            { name: collection.name, href },
          ],
          locale,
        )}
      />

      <header className="grille gap-y-10 pt-14 pb-section lg:pt-24">
        <Eyebrow className="col-span-12">
          {t("eyebrow", { number: String(collection.order).padStart(2, "0") })} ·{" "}
          {collection.stonesLine}
        </Eyebrow>
        <div className="col-span-12 lg:col-span-6">
          <h1 className="text-[clamp(4rem,2rem+10vw,11rem)] leading-[0.9] font-light tracking-[-0.02em]">
            <span className="block">{collection.name}</span>
          </h1>
          <p className="mt-6 font-display text-titre-3 text-encre-douce italic">
            {collection.tagline}
          </p>
        </div>
        <div
          className="col-span-12 space-y-6 self-end sm:col-span-9 lg:col-span-4 lg:col-start-8"
          data-reveal
        >
          {collection.inspiration.map((paragraph, i) => (
            <p key={i} className={i === 0 ? "text-chapeau font-light" : "text-encre-douce"}>
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      <section aria-labelledby="pieces" className="grille gap-y-16 lg:gap-y-24">
        <div className="col-span-12 flex items-baseline justify-between border-t border-filet pt-6">
          <h2 id="pieces" className="surtitre font-sans text-encre-douce">
            {t("piecesTitle")}
          </h2>
          <p className="surtitre text-encre-douce">{t("piecesCount", { count: pieces.length })}</p>
        </div>
        {pieces.map((product, i) => (
          <div
            key={product.slug}
            className={layout[i % layout.length]}
            data-reveal
            style={{ "--reveal-delay": (i % 2) * 140 } as CSSProperties}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </section>

      <nav aria-label={t("next")} className="grille pt-section">
        <Link
          href={{ pathname: "/collections/[collection]", params: { collection: next.slug } }}
          className="group col-span-12 flex flex-col gap-4 border-t border-filet pt-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <span>
            <span className="surtitre block text-encre-douce">{t("next")}</span>
            <span className="mt-3 block font-display text-titre-1 font-light">{next.name}</span>
          </span>
          <span className="flex items-center gap-4 font-display text-chapeau text-encre-douce italic">
            {next.tagline}
            <Icon
              name="arrow"
              className="transition-transform duration-[var(--duree)] ease-maison group-hover:translate-x-2"
            />
          </span>
        </Link>
      </nav>
    </div>
  );
}
