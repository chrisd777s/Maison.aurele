import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { maison, siteUrl } from "@/data/maison";

type Href = Parameters<typeof getPathname>[0]["href"];

/** URL canonique + hreflang (fr, en, x-default) pour une page. */
export function alternatesFor(href: Href, locale: Locale): Metadata["alternates"] {
  const url = (l: Locale) => `${siteUrl}${getPathname({ href, locale: l })}`;
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
      "x-default": url(routing.defaultLocale),
    },
  };
}

/** Champs Open Graph communs ; une page qui définit `openGraph` doit les reprendre. */
export function openGraphBase(locale: Locale) {
  return {
    siteName: maison.name,
    locale: locale === "fr" ? "fr_CA" : "en_CA",
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => `${l}_CA`),
    type: "website",
  } satisfies Metadata["openGraph"];
}
