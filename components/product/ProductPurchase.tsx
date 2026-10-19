"use client";

import { useId, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Price } from "@/components/shop/Price";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import type { MetalId, Product } from "@/lib/commerce/types";
import { DEPOSIT_RATE, DEPOSIT_THRESHOLD } from "@/lib/shop/order";
import { useShop } from "@/lib/shop/store";
import { useProductSelection } from "./ProductSelection";

const swatch: Record<MetalId, string> = {
  "or-blanc": "var(--or-blanc)",
  "or-jaune": "var(--or-jaune)",
  "or-rose": "var(--or-rose)",
  platine: "var(--platine)",
  "or-noir": "var(--or-noir)",
};

/** Choix du métal et de la taille, prix recalculé, délai et accès au salon privé. */
export function ProductPurchase({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const m = useTranslations("Materials");
  const locale = useLocale();
  const { metal, setMetal, size, setSize } = useProductSelection();
  const sizeId = useId();
  const delta = product.metals.find((x) => x.id === metal)?.priceDelta ?? 0;
  const price = product.priceCad + delta;
  const addLine = useShop((s) => s.addLine);
  const toggleEcrin = useShop((s) => s.toggleEcrin);
  const inEcrin = useShop((s) => s.ecrin.some((i) => i.slug === product.slug));
  const sizeLabel =
    product.sizes?.kind === "bague"
      ? t("sizeRing")
      : product.sizes?.kind === "longueur-collier"
        ? t("sizeNecklace")
        : t("sizeWrist");

  return (
    <div>
      <p className="chiffres text-titre-3 font-light" aria-live="polite">
        <Price cad={price} />
      </p>
      {price >= DEPOSIT_THRESHOLD && (
        <p className="mt-2 text-petit text-encre-douce">
          {t("depositHint", { rate: DEPOSIT_RATE * 100 })}
        </p>
      )}

      {product.metals.length > 1 ? (
        <fieldset className="mt-10">
          <legend className="surtitre text-encre-douce">
            {t("metal")} · <span className="text-encre">{m(`metals.${metal}`)}</span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.metals.map((option) => (
              <label
                key={option.id}
                className="group relative inline-flex min-h-11 cursor-pointer items-center gap-3 border border-filet py-2 pr-4 pl-2 transition-colors duration-[var(--duree-courte)] ease-maison has-checked:border-encre has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-accent-encre"
              >
                <input
                  type="radio"
                  name={`metal-${product.slug}`}
                  value={option.id}
                  checked={metal === option.id}
                  onChange={() => setMetal(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className="pastille size-7 rounded-full"
                  style={{ "--pastille": swatch[option.id] } as CSSProperties}
                />
                <span className="text-petit">{m(`metalsShort.${option.id}`)}</span>
                {option.priceDelta > 0 && (
                  <span className="chiffres text-petit text-encre-douce">
                    +<Price cad={option.priceDelta} />
                  </span>
                )}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="mt-10 text-petit">
          <span className="surtitre text-encre-douce">{t("metal")} · </span>
          {m(`metals.${metal}`)}
        </p>
      )}

      {product.sizes && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={sizeId} className="surtitre text-encre-douce">
              {sizeLabel}
            </label>
            {product.sizes.kind === "bague" && (
              <Link href="/guide-des-tailles" className="lien-fin text-petit">
                {t("sizeGuide")}
              </Link>
            )}
          </div>
          <div className="relative mt-3">
            <select
              id={sizeId}
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="chiffres min-h-12 w-full appearance-none border border-filet bg-transparent px-4 text-chapeau text-encre"
            >
              {product.sizes.values.map((value) => (
                <option key={value} value={value}>
                  {product.sizes?.kind === "bague"
                    ? value.replace(".", locale === "fr" ? "," : ".")
                    : t("centimetres", { value })}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-encre-douce"
            >
              ⌄
            </span>
          </div>
        </div>
      )}

      <p className="mt-8 flex items-start gap-3 text-petit text-encre-douce">
        <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent" />
        {product.leadTime.inStock
          ? t("leadInStock")
          : t("leadMade", { min: product.leadTime.weeksMin, max: product.leadTime.weeksMax })}
      </p>

      <div className="mt-10 space-y-3 border-t border-filet pt-8">
        <button
          type="button"
          onClick={() => addLine({ slug: product.slug, metal, size })}
          className="surtitre inline-flex min-h-12 w-full items-center justify-center gap-3 bg-encre px-8 text-fond transition-colors duration-[var(--duree-courte)] ease-maison hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))]"
        >
          <Icon name="sac" width={18} height={18} />
          {t("addToCart")}
        </button>
        <button
          type="button"
          onClick={() => toggleEcrin({ slug: product.slug, metal })}
          aria-pressed={inEcrin}
          className="surtitre inline-flex min-h-12 w-full items-center justify-center gap-3 border border-encre/70 px-8 text-encre transition-colors duration-[var(--duree-courte)] ease-maison hover:border-encre"
        >
          <Icon
            name="ecrin"
            width={18}
            height={18}
            className={inEcrin ? "fill-[color-mix(in_oklab,var(--accent)_45%,transparent)]" : ""}
          />
          {inEcrin ? t("inEcrin") : t("addToEcrin")}
        </button>
      </div>

      <div className="mt-8">
        <ButtonLink
          href={{ pathname: "/rendez-vous", query: { piece: product.slug } }}
          variant="texte"
        >
          {t("privateView")}
          <Icon name="arrow" width={14} height={14} />
        </ButtonLink>
        <p className="mt-2 text-petit text-encre-douce">{t("privateViewHint")}</p>
      </div>
    </div>
  );
}
