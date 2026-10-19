import { getLocale, getTranslations } from "next-intl/server";
import { JewelArt } from "@/components/art/JewelArt";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Locale } from "@/i18n/routing";
import { getCollections, getProducts } from "@/lib/commerce";

/** Les trois collections en chapitres éditoriaux, image et texte en alternance. */
export async function CollectionChapters() {
  const t = await getTranslations("Home");
  const c = await getTranslations("Collection");
  const locale = (await getLocale()) as Locale;
  const collections = await getCollections(locale);
  const chapters = await Promise.all(
    collections.map(async (collection) => ({
      collection,
      cover: (await getProducts(locale, collection.slug))[0],
    })),
  );

  return (
    <section aria-labelledby="collections" className="pt-section">
      <div className="grille gap-y-10">
        <Eyebrow className="col-span-12 lg:col-span-3">{t("collectionsEyebrow")}</Eyebrow>
        <h2 id="collections" data-reveal className="col-span-12 text-titre-2 lg:col-span-8">
          {t("collectionsTitle")}
        </h2>
      </div>

      {chapters.map(({ collection, cover }, i) => {
        const flip = i % 2 === 1;
        return (
          <article
            key={collection.slug}
            aria-labelledby={`chapitre-${collection.slug}`}
            className="grille items-center gap-y-10 pt-section"
          >
            {cover && (
              <div
                data-reveal
                className={`col-span-12 lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}
              >
                <JewelArt
                  product={cover}
                  locale={locale}
                  uid={`ch-${collection.slug}`}
                  className="block aspect-[4/5] w-full sm:aspect-[5/4]"
                />
              </div>
            )}
            <div
              data-reveal
              className={`col-span-12 sm:col-span-9 lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}
            >
              <p className="surtitre text-encre-douce">
                {c("eyebrow", { number: String(collection.order).padStart(2, "0") })}
              </p>
              <h3 id={`chapitre-${collection.slug}`} className="mt-6 text-titre-1">
                {collection.name}
              </h3>
              <p className="mt-4 font-display text-chapeau text-encre-douce italic">
                {collection.tagline}
              </p>
              <p className="mt-8 text-encre-douce">{collection.inspiration[0]}</p>
              <p className="surtitre mt-8 text-encre-douce">{collection.stonesLine}</p>
              <ButtonLink
                href={{
                  pathname: "/collections/[collection]",
                  params: { collection: collection.slug },
                }}
                variant="trait"
                className="mt-10"
              >
                {t("chapterCta")}
              </ButtonLink>
            </div>
          </article>
        );
      })}
    </section>
  );
}
