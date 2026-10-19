import type { Locale } from "@/i18n/routing";
import type { CommerceProvider } from "../types";
import { mapCollection, mapProduct, type ShopifyCollection, type ShopifyProduct } from "./mapper";
import { COLLECTIONS_QUERY, PRODUCT_QUERY, PRODUCTS_QUERY } from "./queries";

const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

async function storefront<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token) {
    throw new Error("SHOPIFY_STORE_DOMAIN et SHOPIFY_STOREFRONT_TOKEN sont requis (voir README).");
  }
  const response = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Storefront API : HTTP ${response.status}`);
  const body = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length)
    throw new Error(`Storefront API : ${body.errors.map((e) => e.message).join(" ; ")}`);
  if (!body.data) throw new Error("Storefront API : réponse vide");
  return body.data;
}

const language = (locale: Locale) => locale.toUpperCase();

/** Adaptateur Shopify Storefront, activé par `COMMERCE_PROVIDER=shopify`. */
export const shopifyProvider: CommerceProvider = {
  name: "shopify",
  async getCollections(locale) {
    const data = await storefront<{ collections: { nodes: ShopifyCollection[] } }>(
      COLLECTIONS_QUERY,
      {
        language: language(locale),
      },
    );
    return data.collections.nodes
      .filter((c) => ["aube", "maree", "obsidienne"].includes(c.handle))
      .map(mapCollection)
      .sort((a, b) => a.order - b.order);
  },
  async getCollection(slug, locale) {
    return (await this.getCollections(locale)).find((c) => c.slug === slug) ?? null;
  },
  async getProducts(locale, filter) {
    const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(PRODUCTS_QUERY, {
      language: language(locale),
      query: filter?.collection ? `tag:collection-${filter.collection}` : null,
    });
    return data.products.nodes.map(mapProduct);
  },
  async getProduct(slug, locale) {
    const data = await storefront<{ product: ShopifyProduct | null }>(PRODUCT_QUERY, {
      language: language(locale),
      handle: slug,
    });
    return data.product ? mapProduct(data.product) : null;
  },
};
