import { defineRouting } from "next-intl/routing";

/**
 * Routage FR/EN. Les chemins internes (clés) suivent l'arborescence `app/[locale]` ;
 * les valeurs sont les URL publiques traduites.
 */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/collections/[collection]": "/collections/[collection]",
    "/creations/[slug]": { fr: "/creations/[slug]", en: "/pieces/[slug]" },
    "/atelier": "/atelier",
    "/provenance": "/provenance",
    "/provenance/[code]": "/provenance/[code]",
    "/la-maison": { fr: "/la-maison", en: "/the-maison" },
    "/savoir-faire": { fr: "/savoir-faire", en: "/craftsmanship" },
    "/rendez-vous": { fr: "/rendez-vous", en: "/private-appointment" },
    "/ecrin": "/ecrin",
    "/ecrin/partage/[token]": { fr: "/ecrin/partage/[token]", en: "/ecrin/shared/[token]" },
    "/guide-des-tailles": { fr: "/guide-des-tailles", en: "/ring-size-guide" },
    "/journal": "/journal",
    "/journal/[slug]": "/journal/[slug]",
    "/commande/merci": { fr: "/commande/merci", en: "/order/thank-you" },
    "/mentions-legales": { fr: "/mentions-legales", en: "/legal-notice" },
    "/confidentialite": { fr: "/confidentialite", en: "/privacy" },
    "/conditions-de-vente": { fr: "/conditions-de-vente", en: "/terms-of-sale" },
    "/retours": { fr: "/retours", en: "/returns" },
    "/garantie": { fr: "/garantie", en: "/lifetime-warranty" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
