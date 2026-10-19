import { collections } from "@/data/collections";
import { products } from "@/data/products";

/**
 * Slugs existants, lus par le proxy pour renvoyer un vrai 404 avant tout rendu
 * (avec le rendu partiel, un `notFound()` tardif partirait en 200).
 * Avec Shopify, générer ces listes au build à partir du catalogue distant.
 */
export const knownCollections = new Set<string>(collections.map((c) => c.slug));
export const knownProducts = new Set<string>(products.map((p) => p.slug));
