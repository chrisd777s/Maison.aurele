import type { Locale } from "@/i18n/routing";

/**
 * Devises d'affichage. Tout est facturé en dollars canadiens ; USD et EUR sont
 * indicatifs, à taux fixes datés (mis à jour à la main, voir README).
 */
export const CURRENCIES = ["CAD", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const RATES: Record<Currency, number> = { CAD: 1, USD: 0.72, EUR: 0.66 };
/** Date des taux affichée en note (AAAA-MM-JJ). */
export const RATES_DATE = "2026-10-01";

export const isCurrency = (value: unknown): value is Currency =>
  typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);

const intlLocale = (locale: Locale | string) => (locale === "fr" ? "fr-CA" : "en-CA");

/**
 * Montant en devise d'affichage. Les conversions sont arrondies à la dizaine :
 * un prix indicatif ne doit pas afficher une précision qu'il n'a pas.
 */
export function formatMoney(amountCad: number, currency: Currency, locale: Locale | string) {
  const value =
    currency === "CAD" ? amountCad : Math.round((amountCad * RATES[currency]) / 10) * 10;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
