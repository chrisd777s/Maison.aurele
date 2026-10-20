import type { MetadataRoute } from "next";
import { LEGAL_ROUTES } from "@/components/editorial/LegalDocument";
import { articleIndex } from "@/data/journal-index";
import { siteUrl } from "@/data/maison";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCollections, getProducts } from "@/lib/commerce";

type Href = Parameters<typeof getPathname>[0]["href"];
type Entry = { href: Href; priority: number; lastModified?: string };

/**
 * Plan du site : chaque page publique dans les deux langues, avec ses
 * équivalents (hreflang). L'Écrin, ses partages et la confirmation de commande
 * sont exclus (pages personnelles, non indexées).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, products] = await Promise.all([
    getCollections(routing.defaultLocale),
    getProducts(routing.defaultLocale),
  ]);

  const entries: Entry[] = [
    { href: "/", priority: 1 },
    ...collections.map((c) => ({
      href: { pathname: "/collections/[collection]", params: { collection: c.slug } } as const,
      priority: 0.9,
    })),
    ...products.map((p) => ({
      href: { pathname: "/creations/[slug]", params: { slug: p.slug } } as const,
      priority: 0.8,
    })),
    { href: "/atelier", priority: 0.7 },
    { href: "/rendez-vous", priority: 0.7 },
    { href: "/la-maison", priority: 0.6 },
    { href: "/savoir-faire", priority: 0.6 },
    { href: "/provenance", priority: 0.6 },
    ...products.map((p) => ({
      href: { pathname: "/provenance/[code]", params: { code: p.provenanceCode } } as const,
      priority: 0.4,
    })),
    { href: "/guide-des-tailles", priority: 0.5 },
    { href: "/journal", priority: 0.6 },
    ...articleIndex.map((a) => ({
      href: { pathname: "/journal/[slug]", params: { slug: a.slug } } as const,
      priority: 0.6,
      lastModified: a.date,
    })),
    ...Object.values(LEGAL_ROUTES).map((href) => ({ href, priority: 0.2 })),
  ];

  const url = (href: Href, locale: (typeof routing.locales)[number]) =>
    `${siteUrl}${getPathname({ href, locale })}`;

  return entries.flatMap(({ href, priority, lastModified }) =>
    routing.locales.map((locale) => ({
      url: url(href, locale),
      priority,
      ...(lastModified && { lastModified }),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, url(href, l)])),
      },
    })),
  );
}
