import { getTranslations } from "next-intl/server";
import { articleIndex } from "@/data/journal-index";
import { siteUrl } from "@/data/maison";
import { routing, type Locale } from "@/i18n/routing";
import { getCollection, getCollections, getProduct, getProducts } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import type { MetalId } from "@/lib/commerce/types";
import { OG_SIZE, ogCard, renderDataUri } from "./card";

/**
 * Images de partage : servies par `app/og/[locale]/[kind]/[id]` (générées au
 * build) et déclarées dans les métadonnées de chaque page avec un texte
 * alternatif traduit.
 */
export const SHARE_KINDS = ["maison", "collection", "piece", "provenance", "journal"] as const;
export type ShareKind = (typeof SHARE_KINDS)[number];

type Card = {
  alt: string;
  card: Parameters<typeof ogCard>[0];
  render?: { slug: string; metal: MetalId };
};

async function describe(locale: Locale, kind: ShareKind, id: string): Promise<Card | null> {
  const t = await getTranslations({ locale, namespace: "Share" });
  const footer = t("places");
  switch (kind) {
    case "maison":
      return {
        alt: t("siteAlt"),
        card: {
          eyebrow: t("siteEyebrow"),
          title: t("siteTitle"),
          subtitle: t("siteSubtitle"),
          footer,
        },
        render: { slug: "aube-premiere", metal: "platine" },
      };
    case "collection": {
      const collection = await getCollection(id, locale);
      if (!collection) return null;
      const [lead] = await getProducts(locale, collection.slug);
      return {
        alt: t("collectionAlt", { name: collection.name, tagline: collection.tagline }),
        card: {
          eyebrow: t("collectionEyebrow"),
          title: collection.name,
          subtitle: collection.tagline,
          footer,
        },
        render: lead && { slug: lead.slug, metal: lead.metals[0]!.id },
      };
    }
    case "piece":
    case "provenance": {
      const product =
        kind === "piece"
          ? await getProduct(id, locale)
          : (await getProducts(locale)).find((p) => p.provenanceCode === id);
      if (!product) return null;
      const collection = await getCollection(product.collection, locale);
      return {
        alt:
          kind === "piece"
            ? t("pieceAlt", { name: product.name, collection: collection?.name ?? "" })
            : t("provenanceAlt", { code: product.provenanceCode, name: product.name }),
        card: {
          eyebrow:
            kind === "piece"
              ? `${t("collectionEyebrow")} ${collection?.name ?? ""}`
              : t("provenanceEyebrow", { code: product.provenanceCode }),
          title: product.name,
          subtitle: product.summary,
          footer: kind === "piece" ? formatPrice(product.priceCad, locale) : footer,
        },
        render: { slug: product.slug, metal: product.metals[0]!.id },
      };
    }
    case "journal": {
      const article = articleIndex.find((a) => a.slug === id);
      if (!article) return null;
      return {
        alt: t("journalAlt", { title: article.title[locale] }),
        card: {
          eyebrow: `Journal · ${article.rubric[locale]}`,
          title: article.title[locale],
          subtitle: article.dek[locale],
          footer,
        },
      };
    }
  }
}

/** Entrée `openGraph.images` d'une page (URL absolue, dimensions, alt traduit). */
export async function shareImage(locale: Locale, kind: ShareKind, id = "index") {
  const described = await describe(locale, kind, id);
  return {
    url: `${siteUrl}/og/${locale}/${kind}/${id}`,
    ...OG_SIZE,
    type: "image/png",
    alt: described?.alt ?? "",
  };
}

/** L'image elle-même (null si l'identifiant est inconnu). */
export async function renderShareImage(locale: Locale, kind: ShareKind, id: string) {
  const described = await describe(locale, kind, id);
  if (!described) return null;
  const { render } = described;
  const image = render ? await renderDataUri(render.slug, render.metal) : undefined;
  return ogCard({ ...described.card, image });
}

/** Toutes les images à générer au build. */
export async function allShareImages() {
  const [collections, products] = await Promise.all([
    getCollections(routing.defaultLocale),
    getProducts(routing.defaultLocale),
  ]);
  const ids: [ShareKind, string][] = [
    ["maison", "index"],
    ...collections.map((c): [ShareKind, string] => ["collection", c.slug]),
    ...products.map((p): [ShareKind, string] => ["piece", p.slug]),
    ...products.map((p): [ShareKind, string] => ["provenance", p.provenanceCode]),
    ...articleIndex.map((a): [ShareKind, string] => ["journal", a.slug]),
  ];
  return routing.locales.flatMap((locale) => ids.map(([kind, id]) => ({ locale, kind, id })));
}
