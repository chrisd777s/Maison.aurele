import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { JewelArt } from "@/components/art/JewelArt";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { RENDER_HEIGHT, RENDER_WIDTH, renderSrc } from "@/lib/renders";

/** Carte de pièce : la vue de détail se révèle au survol, sous la vue de face. */
export async function ProductCard({
  product,
  aspect = "aspect-[4/5]",
  headingLevel = "h3",
}: {
  product: Product;
  aspect?: string;
  headingLevel?: "h2" | "h3";
}) {
  const locale = await getLocale();
  const t = await getTranslations("Product");
  const m = await getTranslations("Materials");
  const Heading = headingLevel;
  return (
    <Link
      href={{ pathname: "/creations/[slug]", params: { slug: product.slug } }}
      className="group @container block"
    >
      <div className={`relative overflow-hidden ${aspect}`}>
        <Image
          src={renderSrc(product.slug, product.metals[0]!.id)}
          alt={t("renderAlt", {
            name: product.name,
            metal: m(`metals.${product.metals[0]!.id}`).toLocaleLowerCase(locale),
            summary: product.summary,
          })}
          width={RENDER_WIDTH}
          height={RENDER_HEIGHT}
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 size-full bg-surface object-contain transition-transform duration-[var(--duree-longue)] ease-maison group-hover:scale-[1.03]"
        />
        <JewelArt
          product={product}
          view="detail"
          locale={locale}
          uid={`cd-${product.slug}`}
          className="absolute inset-0 size-full opacity-0 transition-opacity duration-[var(--duree)] ease-maison group-hover:opacity-100"
        />
      </div>
      <div className="mt-5 flex flex-col gap-1 @xs:flex-row @xs:items-baseline @xs:justify-between @xs:gap-4">
        <Heading className="font-display text-titre-3 leading-tight font-light">
          {product.name}
        </Heading>
        <p className="chiffres shrink-0 text-chapeau">{formatPrice(product.priceCad, locale)}</p>
      </div>
      <p className="mt-1 text-petit text-encre-douce">{product.summary}</p>
    </Link>
  );
}
