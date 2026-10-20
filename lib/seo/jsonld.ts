import { maison, siteUrl } from "@/data/maison";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/commerce/types";
import { renderSrc } from "@/lib/renders";

type Href = Parameters<typeof getPathname>[0]["href"];
const url = (href: Href, locale: Locale) => `${siteUrl}${getPathname({ href, locale })}`;

export const organizationRef = {
  "@type": "Organization",
  name: maison.name,
  url: siteUrl,
} as const;

export function breadcrumbJsonLd(items: { name: string; href: Href }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: url(item.href, locale),
    })),
  };
}

export function productJsonLd(product: Product, locale: Locale, material: string) {
  const href = { pathname: "/creations/[slug]", params: { slug: product.slug } } as const;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.reference,
    image: product.metals.map((m) => `${siteUrl}${renderSrc(product.slug, m.id)}`),
    material,
    brand: { "@type": "Brand", name: maison.name },
    url: url(href, locale),
    offers: {
      "@type": "Offer",
      price: product.priceCad,
      priceCurrency: "CAD",
      availability: product.leadTime.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/MadeToOrder",
      url: url(href, locale),
      seller: organizationRef,
    },
  };
}

/** La Maison : atelier-boutique de Montréal et salon privé de Paris. */
export function jewelryStoreJsonLd(locale: Locale) {
  const store = (place: (typeof maison.places)[keyof typeof maison.places], id: string) => ({
    "@type": "JewelryStore",
    "@id": `${siteUrl}/#${id}`,
    name: `${maison.name} — ${place.city}`,
    email: maison.email,
    url: url("/rendez-vous", locale),
    address: {
      "@type": "PostalAddress",
      streetAddress: place.street,
      addressLocality: place.city,
      addressRegion: place.region,
      addressCountry: place.country,
    },
  });
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organisation`,
    name: maison.name,
    url: siteUrl,
    foundingDate: String(maison.founded),
    image: `${siteUrl}/og/${locale}/maison/index`,
    founder: { "@type": "Person", name: "Hélène Aurèle" },
    email: maison.email,
    slogan: locale === "fr" ? "La lumière, captive." : "Light, held captive.",
    subOrganization: [
      store(maison.places.montreal, "montreal"),
      store(maison.places.paris, "paris"),
    ],
  };
}
