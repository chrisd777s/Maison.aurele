import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/data/maison";

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
