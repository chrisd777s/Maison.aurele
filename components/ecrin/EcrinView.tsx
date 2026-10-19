"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Price } from "@/components/shop/Price";
import { useCatalogue } from "@/components/shop/ShopProvider";
import { Icon } from "@/components/ui/Icon";
import { getPathname, Link } from "@/i18n/navigation";
import { encodeEcrin } from "@/lib/ecrin/token";
import { RENDER_HEIGHT, RENDER_WIDTH, renderSrc } from "@/lib/renders";
import { useShop } from "@/lib/shop/store";

/** L'Écrin : pièces mises de côté, ajout au panier, lien de partage discret. */
export function EcrinView() {
  const t = useTranslations("Ecrin");
  const m = useTranslations("Materials");
  const locale = useLocale();
  const catalogue = useCatalogue();
  const { hydrated, ecrin, removeEcrin, addLine } = useShop();
  const [hidePrices, setHidePrices] = useState(false);
  const [copied, setCopied] = useState(false);

  const items = ecrin.flatMap((item) => {
    const entry = catalogue.find((e) => e.slug === item.slug);
    return entry ? [{ ...item, entry }] : [];
  });

  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (!items.length)
    return (
      <div className="grille">
        <div className="col-span-12 border-t border-filet py-20 text-center md:col-span-8 md:col-start-3">
          <Icon name="ecrin" width={36} height={36} className="mx-auto text-accent-encre" />
          <p className="mt-6 font-display text-titre-2 font-light italic">{t("empty")}</p>
          <p className="mx-auto mt-4 max-w-[44ch] text-encre-douce">{t("emptyHint")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <Link
              href={{ pathname: "/collections/[collection]", params: { collection: "aube" } }}
              className="surtitre lien-fin"
            >
              {t("discover")}
            </Link>
            <Link href="/atelier" className="surtitre lien-fin">
              {t("compose")}
            </Link>
          </div>
        </div>
      </div>
    );

  const token = encodeEcrin({ items: ecrin, hidePrices });
  const sharePath = getPathname({
    href: { pathname: "/ecrin/partage/[token]", params: { token } },
    locale,
  });

  async function share() {
    const url = `${window.location.origin}${sharePath}`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: t("shareTitle"), url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
    } catch {
      // Partage annulé : rien à signaler.
    }
  }

  return (
    <div className="grille gap-y-14">
      <ul className="col-span-12 grid grid-cols-1 gap-x-gouttiere gap-y-14 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
        {items.map(({ slug, metal, entry }) => (
          <li key={slug} className="flex flex-col" data-testid="piece-ecrin">
            <Link
              href={{ pathname: "/creations/[slug]", params: { slug } }}
              className="group block bg-surface"
            >
              <Image
                src={renderSrc(slug, metal)}
                alt=""
                width={RENDER_WIDTH}
                height={RENDER_HEIGHT}
                sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                className="aspect-[4/5] w-full object-contain transition-transform duration-[var(--duree)] ease-maison group-hover:scale-[1.02]"
              />
              <span className="sr-only">{entry.name}</span>
            </Link>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-titre-3 leading-tight font-light">{entry.name}</h2>
              <Price
                cad={entry.priceCad + (entry.metals.find((x) => x.id === metal)?.priceDelta ?? 0)}
                className="chiffres shrink-0 text-chapeau"
              />
            </div>
            <p className="mt-1 text-petit text-encre-douce">
              {m(`metalsShort.${metal}`)} · {entry.summary}
            </p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
              {entry.sizes ? (
                <Link
                  href={{ pathname: "/creations/[slug]", params: { slug } }}
                  className="surtitre lien-fin"
                >
                  {t("chooseSize")}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => addLine({ slug, metal })}
                  className="surtitre lien-fin min-h-11"
                >
                  {t("addToCart")}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeEcrin(slug)}
                className="lien-fin min-h-11 text-petit text-encre-douce"
                aria-label={t("removeNamed", { name: entry.name })}
              >
                {t("remove")}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Partage discret */}
      <aside className="col-span-12 lg:col-span-4" aria-labelledby="partage-titre">
        <div className="border border-filet bg-surface p-6 lg:sticky lg:top-[calc(var(--entete)+2rem)] lg:p-8">
          <h2 id="partage-titre" className="font-display text-titre-3 font-light">
            {t("shareHeading")}
          </h2>
          <p className="mt-3 text-petit text-encre-douce">{t("shareText")}</p>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-petit">
            <input
              type="checkbox"
              checked={hidePrices}
              onChange={(e) => {
                setHidePrices(e.target.checked);
                setCopied(false);
              }}
              className="mt-1 size-4 accent-[var(--encre)]"
            />
            <span>
              {t("hidePrices")}
              <span className="block text-encre-douce">{t("hidePricesHint")}</span>
            </span>
          </label>
          <button
            type="button"
            onClick={share}
            className="surtitre mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-encre px-6 text-fond transition-colors duration-[var(--duree-courte)] ease-maison hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))]"
          >
            <Icon name="partage" width={16} height={16} />
            {t("copyLink")}
          </button>
          <Link
            href={{ pathname: "/ecrin/partage/[token]", params: { token } }}
            className="lien-fin mt-4 inline-block text-petit text-encre-douce"
            data-testid="apercu-partage"
          >
            {t("preview")}
          </Link>
          <p role="status" className="mt-3 min-h-5 text-petit text-accent-encre">
            {copied ? t("copied") : ""}
          </p>
          <p className="mt-2 text-petit text-encre-douce">{t("privacy")}</p>
        </div>
      </aside>
    </div>
  );
}
