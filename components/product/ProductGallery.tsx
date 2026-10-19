"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { JewelArt, type ArtView } from "@/components/art/JewelArt";
import type { Product } from "@/lib/commerce/types";
import { Loupe } from "./Loupe";
import { useProductSelection } from "./ProductSelection";

const VIEWS: { view: ArtView; key: "viewFace" | "viewDetail" | "viewPlanche" }[] = [
  { view: "face", key: "viewFace" },
  { view: "detail", key: "viewDetail" },
  { view: "planche", key: "viewPlanche" },
];

/** Galerie de la fiche : vue principale sous loupe, vignettes, métal suivi en direct. */
export function ProductGallery({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const { metal } = useProductSelection();
  const [active, setActive] = useState<ArtView>("face");

  return (
    <section aria-label={t("galleryLabel")}>
      <Loupe label={t("loupe")} hint={t("loupeHint")}>
        <JewelArt
          product={product}
          view={active}
          metal={metal}
          locale={locale}
          uid={`g-${product.slug}`}
          className="block aspect-[4/5] w-full"
        />
      </Loupe>
      <ul className="mt-gouttiere grid grid-cols-3 gap-gouttiere">
        {VIEWS.map(({ view, key }) => (
          <li key={view}>
            <button
              type="button"
              aria-pressed={active === view}
              onClick={() => setActive(view)}
              className="group block w-full text-left"
            >
              <JewelArt
                product={product}
                view={view}
                metal={metal}
                locale={locale}
                uid={`v-${product.slug}-${view}`}
                className="block aspect-[4/5] w-full opacity-70 transition-opacity duration-[var(--duree-courte)] ease-maison group-hover:opacity-100 group-aria-pressed:opacity-100"
              />
              <span className="surtitre mt-3 block text-encre-douce group-aria-pressed:text-encre">
                {t(key)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
