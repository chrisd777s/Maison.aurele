import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import type {
  Collection,
  CollectionRecord,
  CommerceProvider,
  Product,
  ProductRecord,
} from "../types";

export function localizeProduct(record: ProductRecord, locale: Locale): Product {
  return {
    ...record,
    name: record.name[locale],
    summary: record.summary[locale],
    description: record.description[locale],
    stones: record.stones.map((stone) => ({
      ...stone,
      origin: stone.origin[locale],
      treatment: stone.treatment?.[locale],
      hue: stone.hue?.[locale],
    })),
  };
}

export function localizeCollection(record: CollectionRecord, locale: Locale): Collection {
  return {
    ...record,
    name: record.name[locale],
    tagline: record.tagline[locale],
    stonesLine: record.stonesLine[locale],
    inspiration: record.inspiration[locale],
  };
}

/** Catalogue local : fonctionne sans aucun compte externe. */
export const localProvider: CommerceProvider = {
  name: "local",
  async getCollections(locale) {
    return [...collections]
      .sort((a, b) => a.order - b.order)
      .map((c) => localizeCollection(c, locale));
  },
  async getCollection(slug, locale) {
    const record = collections.find((c) => c.slug === slug);
    return record ? localizeCollection(record, locale) : null;
  },
  async getProducts(locale, filter) {
    return products
      .filter((p) => !filter?.collection || p.collection === filter.collection)
      .map((p) => localizeProduct(p, locale));
  },
  async getProduct(slug, locale) {
    const record = products.find((p) => p.slug === slug);
    return record ? localizeProduct(record, locale) : null;
  },
};
