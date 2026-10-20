import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/maison";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API, Écrins partagés, confirmation de commande, studio technique.
      disallow: [
        "/api/",
        "/fr/ecrin/partage/",
        "/en/ecrin/shared/",
        "/fr/commande/",
        "/en/order/",
        "/studio-affiches",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
