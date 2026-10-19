import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale: override }) => {
  // La langue vient du segment racine `[locale]` ; une langue explicite
  // (ex. getTranslations({ locale })) a priorité.
  const requested = override ?? (await rootLocale());
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "America/Toronto",
  };
});
