import type { CollectionSlug, MetalId, Product, SizeKind } from "@/lib/commerce/types";

/**
 * Fiche réduite d'une pièce, transmise au navigateur pour le panier et l'Écrin
 * (quelques centaines d'octets par pièce, au lieu du catalogue complet).
 */
export type CatalogueEntry = {
  slug: string;
  name: string;
  summary: string;
  collection: CollectionSlug;
  priceCad: number;
  metals: { id: MetalId; priceDelta: number }[];
  sizes?: { kind: SizeKind; values: string[]; default: string };
};

export function toCatalogueEntry(product: Product): CatalogueEntry {
  return {
    slug: product.slug,
    name: product.name,
    summary: product.summary,
    collection: product.collection,
    priceCad: product.priceCad,
    metals: product.metals.map(({ id, priceDelta }) => ({ id, priceDelta })),
    sizes: product.sizes,
  };
}
