import { maison, siteUrl } from "@/data/maison";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/commerce/types";

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
