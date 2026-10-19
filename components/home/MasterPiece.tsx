import { getLocale, getTranslations } from "next-intl/server";
import { JewelArt } from "@/components/art/JewelArt";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Locale } from "@/i18n/routing";
import { getProducts } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";

/** La pièce d'exception, présentée dans la pénombre quel que soit le mode. */
export async function MasterPiece() {
  const t = await getTranslations("Home");
  const locale = (await getLocale()) as Locale;
  const piece = (await getProducts(locale)).find((p) => p.featured);
  if (!piece) return null;

  return (
    <section aria-labelledby="exception" className="scene-nuit mt-section py-section">
      <div className="grille items-center gap-y-12">
        <div
          className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-2"
          data-reveal
        >
          <JewelArt
            product={piece}
            view="detail"
            locale={locale}
            uid="exception"
            className="block aspect-square w-full"
          />
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-8" data-reveal>
          <Eyebrow>{t("exceptionEyebrow")}</Eyebrow>
          <h2 id="exception" className="mt-8 text-titre-2">
            {piece.name}
          </h2>
          <p className="mt-4 font-display text-chapeau text-encre-douce italic">{piece.summary}</p>
          <p className="mt-8 text-encre-douce">{piece.description}</p>
          <p className="chiffres mt-8 text-titre-3 font-light">
            {formatPrice(piece.priceCad, locale)}
          </p>
          <ButtonLink
            href={{ pathname: "/creations/[slug]", params: { slug: piece.slug } }}
            variant="trait"
            className="mt-10"
          >
            {t("exceptionCta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
