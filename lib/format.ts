import type { Locale } from "@/i18n/routing";

const intlLocale = (locale: Locale | string) => (locale === "fr" ? "fr-CA" : "en-CA");

/** Prix en dollars canadiens, sans décimales : « 14 800 $ » / « $14,800 ». */
export function formatPrice(amountCad: number, locale: Locale | string) {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amountCad);
}

export function formatNumber(value: number, locale: Locale | string, digits = 2) {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: digits }).format(value);
}
