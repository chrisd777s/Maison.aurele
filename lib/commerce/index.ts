import { cacheLife } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { localProvider } from "./local/provider";
import { shopifyProvider } from "./shopify/provider";
import type { CollectionSlug, CommerceProvider } from "./types";

/** Fournisseur actif : local par défaut, Shopify si `COMMERCE_PROVIDER=shopify`. */
export function commerce(): CommerceProvider {
  return process.env.COMMERCE_PROVIDER === "shopify" ? shopifyProvider : localProvider;
}

/* Accès mis en cache (Cache Components) : les pages restent statiques. */

export async function getCollections(locale: Locale) {
  "use cache";
  cacheLife("hours");
  return commerce().getCollections(locale);
}

export async function getCollection(slug: string, locale: Locale) {
  "use cache";
  cacheLife("hours");
  return commerce().getCollection(slug, locale);
}

export async function getProducts(locale: Locale, collection?: CollectionSlug) {
  "use cache";
  cacheLife("hours");
  return commerce().getProducts(locale, collection ? { collection } : undefined);
}

export async function getProduct(slug: string, locale: Locale) {
  "use cache";
  cacheLife("hours");
  return commerce().getProduct(slug, locale);
}
