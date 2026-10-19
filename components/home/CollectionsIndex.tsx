import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { collectionItems } from "@/components/layout/nav-items";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";

/** Index éditorial des trois collections (les sections illustrées arrivent en phase 2). */
export async function CollectionsIndex() {
  const t = await getTranslations("Home");
  const nav = await getTranslations("Nav");
  const taglines = await getTranslations("Collections");

  return (
    <section aria-labelledby="collections" className="grille gap-y-10 pt-section">
      <Eyebrow className="col-span-12 lg:col-span-3">{t("collectionsEyebrow")}</Eyebrow>
      <h2 id="collections" data-reveal className="col-span-12 text-titre-2 lg:col-span-8">
        {t("collectionsTitle")}
      </h2>
      <ol className="col-span-12 mt-6 border-b border-filet lg:col-span-9 lg:col-start-4">
        {collectionItems.map((item, i) => (
          <li key={item.key} data-reveal style={{ "--reveal-delay": i * 120 } as CSSProperties}>
            <Link
              href={item.href}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-t border-filet py-8 sm:grid-cols-[4rem_1fr_1fr_auto] sm:py-10"
            >
              <span className="chiffres text-chapeau text-encre-douce">0{i + 1}</span>
              <span className="font-display text-titre-2 font-light transition-transform duration-[var(--duree)] ease-maison group-hover:translate-x-2">
                {nav(item.key)}
              </span>
              <span className="col-start-2 font-display text-chapeau text-encre-douce italic sm:col-start-3">
                {taglines(item.key as "aube" | "maree" | "obsidienne")}
              </span>
              <Icon
                name="arrow"
                className="col-start-3 row-start-1 self-center text-encre-douce transition-transform duration-[var(--duree)] ease-maison group-hover:translate-x-1 sm:col-start-4"
              />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
