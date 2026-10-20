"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Link, usePathname } from "@/i18n/navigation";
import { RATES_DATE } from "@/lib/currency";
import { showModalLocked } from "@/lib/dom/scroll-lock";
import { renderSrc } from "@/lib/renders";
import {
  DELIVERIES,
  DEPOSIT_RATE,
  DEPOSIT_THRESHOLD,
  GIFT_CARD_MAX,
  MAX_QUANTITY,
  lineId,
  priceOrder,
  type CartLine,
} from "@/lib/shop/order";
import { useCartDrawer, useShop } from "@/lib/shop/store";
import { formatPrice } from "@/lib/format";
import { CurrencySwitch } from "./CurrencySwitch";
import { Price } from "./Price";
import { useCatalogue } from "./ShopProvider";

type Status = "idle" | "loading" | "stale" | "error";

/**
 * Panier en tiroir (`<dialog>` modal : focus piégé, Échap, page inerte).
 * Options cadeau, mode de remise, acompte pour les pièces d'exception, paiement.
 */
export function CartDrawer() {
  const t = useTranslations("Cart");
  const m = useTranslations("Materials");
  const locale = useLocale();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const cardId = useId();
  const [status, setStatus] = useState<Status>("idle");

  const catalogue = useCatalogue();
  const shop = useShop();
  const { open, setOpen } = useCartDrawer();
  const order = priceOrder(shop.lines, catalogue);
  const count = shop.lines.reduce((n, l) => n + l.quantity, 0);

  // L'état du magasin pilote l'ouverture (bouton d'en-tête, « Ajouter au panier »).
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) showModalLocked(el);
    if (!open && el.open) el.close();
  }, [open]);

  // Une navigation (lien vers une pièce) referme le tiroir.
  useEffect(() => setOpen(false), [pathname, setOpen]);

  async function checkout() {
    setStatus("loading");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          lines: shop.lines,
          gift: shop.gift,
          delivery: shop.delivery,
          returnPath: window.location.pathname,
        }),
      });
      const json = (await response.json()) as { url?: string; invalid?: CartLine[] };
      if (response.status === 409) {
        json.invalid?.forEach((line) => shop.removeLine(lineId(line)));
        setStatus("stale");
        return;
      }
      if (!response.ok || !json.url) throw new Error(String(response.status));
      window.location.assign(json.url);
    } catch {
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={dialog}
      className="tiroir"
      aria-labelledby={titleId}
      onClose={() => setOpen(false)}
      // Clic sur le voile (hors du panneau) : fermeture.
      onClick={(event) => event.target === event.currentTarget && setOpen(false)}
      data-testid="panier"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-entete shrink-0 items-center justify-between border-b border-filet px-6">
          <h2 id={titleId} className="font-display text-titre-3 font-light">
            {t("title")}
            {count > 0 && <span className="chiffres ml-2 text-encre-douce">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="-mr-2 inline-flex size-11 items-center justify-center"
            aria-label={t("close")}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {shop.hydrated && order.lines.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-display text-titre-3 font-light italic">{t("empty")}</p>
              <p className="mx-auto mt-4 max-w-[30ch] text-petit text-encre-douce">
                {t("emptyHint")}
              </p>
              <Link
                href={{ pathname: "/collections/[collection]", params: { collection: "aube" } }}
                className="surtitre lien-fin mt-8 inline-block"
              >
                {t("discover")}
              </Link>
            </div>
          )}

          {order.lines.length > 0 && (
            <>
              <ul className="divide-y divide-filet">
                {order.lines.map((line) => {
                  const id = lineId(line);
                  return (
                    <li key={id} className="flex gap-4 py-6" data-testid="ligne-panier">
                      <Image
                        src={renderSrc(line.slug, line.metal)}
                        alt=""
                        width={80}
                        height={100}
                        sizes="80px"
                        className="h-[100px] w-20 shrink-0 bg-surface object-contain"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-baseline justify-between gap-3">
                          <Link
                            href={{ pathname: "/creations/[slug]", params: { slug: line.slug } }}
                            className="font-display text-chapeau leading-tight hover:text-accent-encre"
                          >
                            {line.entry.name}
                          </Link>
                          <Price cad={line.total} className="chiffres shrink-0 text-petit" />
                        </div>
                        <p className="mt-1 text-petit text-encre-douce">
                          {m(`metalsShort.${line.metal}`)}
                          {line.size &&
                            ` · ${
                              line.entry.sizes?.kind === "bague"
                                ? t("ringSize", {
                                    size: line.size.replace(".", locale === "fr" ? "," : "."),
                                  })
                                : t("length", { size: line.size })
                            }`}
                        </p>
                        {line.deposit && (
                          <p className="mt-1 text-petit text-accent-encre">
                            {t("depositLine", { rate: DEPOSIT_RATE * 100 })}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div
                            className="flex items-center border border-filet"
                            role="group"
                            aria-label={t("quantityFor", { name: line.entry.name })}
                          >
                            <button
                              type="button"
                              onClick={() => shop.setQuantity(id, line.quantity - 1)}
                              disabled={line.quantity <= 1}
                              aria-label={t("decrease")}
                              className="inline-flex size-9 items-center justify-center disabled:text-filet"
                            >
                              <Icon name="moins" width={14} height={14} />
                            </button>
                            <span
                              className="chiffres w-6 text-center text-petit"
                              aria-live="polite"
                            >
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => shop.setQuantity(id, line.quantity + 1)}
                              disabled={line.quantity >= MAX_QUANTITY}
                              aria-label={t("increase")}
                              className="inline-flex size-9 items-center justify-center disabled:text-filet"
                            >
                              <Icon name="plus" width={14} height={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => shop.removeLine(id)}
                            className="lien-fin min-h-9 text-petit text-encre-douce"
                            aria-label={t("removeNamed", { name: line.entry.name })}
                          >
                            {t("remove")}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Attentions */}
              <fieldset className="border-t border-filet pt-6">
                <legend className="surtitre text-encre-douce">{t("giftTitle")}</legend>
                <label className="mt-4 flex cursor-pointer items-start gap-3 text-petit">
                  <input
                    type="checkbox"
                    checked={shop.gift.wrap}
                    onChange={(e) => shop.setGift({ wrap: e.target.checked })}
                    className="mt-1 size-4 accent-[var(--encre)]"
                  />
                  <span>
                    {t("giftWrap")}
                    <span className="block text-encre-douce">{t("giftWrapHint")}</span>
                  </span>
                </label>
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor={cardId} className="text-petit">
                      {t("giftCard")}
                    </label>
                    <span className="chiffres text-petit text-encre-douce" aria-hidden="true">
                      {shop.gift.card.length}/{GIFT_CARD_MAX}
                    </span>
                  </div>
                  <textarea
                    id={cardId}
                    rows={3}
                    maxLength={GIFT_CARD_MAX}
                    value={shop.gift.card}
                    onChange={(e) => shop.setGift({ card: e.target.value })}
                    placeholder={t("giftCardPlaceholder")}
                    className="mt-2 w-full resize-none border border-filet bg-transparent px-3 py-2 font-display text-chapeau italic placeholder:text-encre-douce"
                  />
                  <p className="mt-1 text-petit text-encre-douce">{t("giftCardHint")}</p>
                </div>
              </fieldset>

              <fieldset className="mt-8 border-t border-filet pt-6">
                <legend className="surtitre text-encre-douce">{t("deliveryTitle")}</legend>
                <div className="mt-4 space-y-2">
                  {DELIVERIES.map((delivery) => (
                    <label
                      key={delivery}
                      className="flex cursor-pointer items-start gap-3 border border-filet p-3 text-petit has-checked:border-encre has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-encre"
                    >
                      <input
                        type="radio"
                        name="remise"
                        value={delivery}
                        checked={shop.delivery === delivery}
                        onChange={() => shop.setDelivery(delivery)}
                        className="mt-1 size-4 accent-[var(--encre)]"
                      />
                      <span>
                        {t(`deliveries.${delivery}.name`)}
                        <span className="block text-encre-douce">
                          {t(`deliveries.${delivery}.hint`)}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}
        </div>

        {order.lines.length > 0 && (
          <div className="shrink-0 border-t border-filet bg-surface px-6 pt-5 pb-6">
            <dl className="space-y-1.5 text-petit">
              <div className="flex justify-between">
                <dt className="text-encre-douce">{t("subtotal")}</dt>
                <dd>
                  <Price cad={order.subtotal} className="chiffres" />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-encre-douce">{t("deliveryCost")}</dt>
                <dd>{t("offered")}</dd>
              </div>
              {order.balance > 0 && (
                <div className="flex justify-between">
                  <dt className="text-encre-douce">{t("balance")}</dt>
                  <dd>
                    <Price cad={order.balance} className="chiffres" />
                  </dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-filet pt-3">
                <dt className="surtitre">{order.balance > 0 ? t("dueNow") : t("total")}</dt>
                <dd className="chiffres text-titre-3 font-light" data-testid="total-panier">
                  <Price cad={order.dueNow} />
                </dd>
              </div>
            </dl>
            {order.balance > 0 && (
              <p className="mt-2 text-petit text-encre-douce">
                {t("depositNote", {
                  threshold: formatPrice(DEPOSIT_THRESHOLD, locale),
                  rate: DEPOSIT_RATE * 100,
                })}
              </p>
            )}
            <p className="mt-2 text-petit text-encre-douce">
              {shop.currency === "CAD"
                ? t("taxes")
                : t("currencyNote", {
                    date: new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
                      dateStyle: "long",
                      timeZone: "UTC",
                    }).format(new Date(`${RATES_DATE}T12:00:00Z`)),
                  })}
            </p>

            <button
              type="button"
              onClick={checkout}
              disabled={status === "loading"}
              className="surtitre mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-encre px-8 text-fond transition-colors duration-[var(--duree-courte)] ease-maison hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))] disabled:opacity-70"
              data-testid="payer"
            >
              {status === "loading" ? t("redirecting") : t("checkout")}
            </button>
            <p role="status" className="mt-3 min-h-5 text-petit text-accent-encre">
              {status === "stale" ? t("stale") : status === "error" ? t("error") : ""}
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4">
              <p className="text-petit text-encre-douce">{t("secure")}</p>
              <CurrencySwitch className="-mr-2" />
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
