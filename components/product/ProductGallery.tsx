"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { JewelArt } from "@/components/art/JewelArt";
import { LazyJewel } from "@/components/three/LazyJewel";
import type { Product } from "@/lib/commerce/types";
import { RENDER_HEIGHT, RENDER_WIDTH, renderSrc } from "@/lib/renders";
import { Loupe } from "./Loupe";
import { useProductSelection } from "./ProductSelection";

type View = "rendu" | "3d" | "detail" | "planche";

const VIEWS: { view: View; key: "viewPhoto" | "view3d" | "viewDetail" | "viewPlanche" }[] = [
  { view: "rendu", key: "viewPhoto" },
  { view: "3d", key: "view3d" },
  { view: "detail", key: "viewDetail" },
  { view: "planche", key: "viewPlanche" },
];

/** Galerie : rendu sous loupe 4×, visionneuse 3D, détail de la pierre, planche d'atelier. */
export function ProductGallery({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const m = useTranslations("Materials");
  const locale = useLocale();
  const { metal } = useProductSelection();
  const [active, setActive] = useState<View>("rendu");
  const alt = t("renderAlt", {
    name: product.name,
    metal: m(`metals.${metal}`).toLocaleLowerCase(locale),
    summary: product.summary,
  });

  const stage =
    active === "3d" ? (
      <div className="bg-surface">
        <LazyJewel
          product={product}
          metal={metal}
          alt={alt}
          sizes="(min-width: 1024px) 58vw, 100vw"
          orbit
          requested
          className="aspect-[4/5] w-full"
        />
        <p className="px-4 pb-4 text-petit text-encre-douce">{t("viewer3dHint")}</p>
      </div>
    ) : (
      <Loupe label={t("loupe")} hint={t("loupeHint")}>
        {active === "rendu" ? (
          <Image
            src={renderSrc(product.slug, metal)}
            alt={alt}
            width={RENDER_WIDTH}
            height={RENDER_HEIGHT}
            sizes="(min-width: 1024px) 58vw, 100vw"
            quality={85}
            preload
            fetchPriority="high"
            className="block aspect-[4/5] w-full bg-surface object-contain"
          />
        ) : (
          <JewelArt
            product={product}
            view={active}
            metal={metal}
            locale={locale}
            uid={`g-${product.slug}`}
            className="block aspect-[4/5] w-full"
          />
        )}
      </Loupe>
    );

  return (
    <section aria-label={t("galleryLabel")}>
      {stage}
      <ul className="mt-gouttiere grid grid-cols-4 gap-3 sm:gap-gouttiere">
        {VIEWS.map(({ view, key }) => (
          <li key={view}>
            <button
              type="button"
              aria-pressed={active === view}
              onClick={() => setActive(view)}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-[4/5] overflow-hidden bg-surface opacity-70 transition-opacity duration-[var(--duree-courte)] ease-maison group-hover:opacity-100 group-aria-pressed:opacity-100">
                {view === "rendu" || view === "3d" ? (
                  <Image
                    src={renderSrc(product.slug, metal)}
                    alt=""
                    width={RENDER_WIDTH}
                    height={RENDER_HEIGHT}
                    sizes="12vw"
                    className="size-full object-contain"
                  />
                ) : (
                  <JewelArt
                    product={product}
                    view={view}
                    metal={metal}
                    locale={locale}
                    uid={`v-${product.slug}-${view}`}
                    className="size-full"
                  />
                )}
                {view === "3d" && (
                  <span
                    aria-hidden="true"
                    className="surtitre absolute right-2 bottom-2 bg-voile px-2 py-1 text-encre"
                  >
                    3D
                  </span>
                )}
              </span>
              <span className="surtitre mt-3 block text-[0.625rem] text-encre-douce group-aria-pressed:text-encre sm:text-surtitre">
                {t(key)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
