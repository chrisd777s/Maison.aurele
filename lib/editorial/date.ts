import type { Locale } from "@/i18n/routing";

/** Date éditoriale (AAAA-MM-JJ) : « 15 septembre 2026 » / « September 15, 2026 ». */
export function formatEditorialDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}
