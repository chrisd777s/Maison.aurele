import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { KeepSelection } from "@/components/ecrin/KeepSelection";
import { ClientMessages } from "@/components/i18n/ClientMessages";
import { Price } from "@/components/shop/Price";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProducts } from "@/lib/commerce";
import { decodeEcrin } from "@/lib/ecrin/token";
import { RENDER_HEIGHT, RENDER_WIDTH, renderSrc } from "@/lib/renders";

// Jeton connu seulement à la requête : page rendue à la demande (personnelle, non indexée),
// ce qui permet aussi à l'en-tête de connaître le chemin courant.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Ecrin");
  return {
    title: t("sharedMetaTitle"),
    description: t("sharedLede"),
    // Lien personnel : jamais indexé, jamais transmis comme référent.
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

async function SharedSelection({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("Ecrin");
  const m = await getTranslations("Materials");
  const products = await getProducts(locale);
  const shared = decodeEcrin(token, new Set(products.map((p) => p.slug)));
  if (!shared) notFound();

  const pieces = shared.items.flatMap(({ slug, metal }) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return [];
    // Métal inconnu pour cette pièce : on retombe sur son métal principal.
    const option = product.metals.find((x) => x.id === metal) ?? product.metals[0]!;
    return [{ product, metal: option.id, price: product.priceCad + option.priceDelta }];
  });

  return (
    <ClientMessages namespaces={["Ecrin"]}>
      <ul className="grille gap-y-16" data-prix={shared.hidePrices ? "masques" : "visibles"}>
        {pieces.map(({ product, metal, price }, i) => (
          <li
            key={product.slug}
            className={`col-span-12 sm:col-span-6 lg:col-span-4 ${i % 3 === 1 ? "lg:mt-24" : ""}`}
            data-testid="piece-partagee"
          >
            <Link
              href={{ pathname: "/creations/[slug]", params: { slug: product.slug } }}
              className="group block"
            >
              <div className="bg-surface">
                <Image
                  src={renderSrc(product.slug, metal)}
                  alt={t("sharedAlt", { name: product.name, metal: m(`metals.${metal}`) })}
                  width={RENDER_WIDTH}
                  height={RENDER_HEIGHT}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="aspect-[4/5] w-full object-contain transition-transform duration-[var(--duree)] ease-maison group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-titre-3 leading-tight font-light group-hover:text-accent-encre">
                  {product.name}
                </h2>
                {!shared.hidePrices && (
                  <Price cad={price} className="chiffres shrink-0 text-chapeau" />
                )}
              </div>
              <p className="mt-1 text-petit text-encre-douce">
                {m(`metalsShort.${metal}`)} · {product.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grille mt-section">
        <div className="col-span-12 flex flex-col items-start gap-8 border-t border-filet pt-12 md:col-span-8 md:col-start-3 md:items-center md:text-center">
          <p className="font-display text-titre-2 font-light italic">{t("sharedClosing")}</p>
          <div className="flex flex-wrap gap-4 md:justify-center">
            <ButtonLink href="/rendez-vous">{t("sharedAppointment")}</ButtonLink>
            <KeepSelection
              items={pieces.map(({ product, metal }) => ({ slug: product.slug, metal }))}
            />
          </div>
        </div>
      </div>
    </ClientMessages>
  );
}

export default async function SharedEcrinPage({
  params,
}: PageProps<"/[locale]/ecrin/partage/[token]">) {
  const t = await getTranslations("Ecrin");
  return (
    <>
      <header className="grille gap-y-8 pt-14 pb-14 lg:pt-20 lg:pb-20">
        <Eyebrow className="col-span-12">{t("sharedEyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-7">{t("sharedTitle")}</h1>
        <p className="col-span-12 self-end text-encre-douce sm:col-span-9 lg:col-span-4 lg:col-start-9">
          {t("sharedLede")}
        </p>
      </header>
      <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
        <SharedSelection params={params} />
      </Suspense>
    </>
  );
}
