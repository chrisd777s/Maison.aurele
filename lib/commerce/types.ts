import type { Locale } from "@/i18n/routing";

/** Texte rédigé dans les deux langues. */
export type Localized<T = string> = Record<Locale, T>;

export type CollectionSlug = "aube" | "maree" | "obsidienne";
export type Category = "bague" | "boucles" | "collier" | "pendentif" | "bracelet";
export type MetalId = "or-blanc" | "or-jaune" | "or-rose" | "platine" | "or-noir";
export type StoneKind = "diamant" | "diamant-noir" | "saphir" | "perle-akoya" | "onyx";
export type StoneShape = "rond" | "ovale" | "emeraude" | "poire" | "coussin" | "perle" | "cabochon";

/** Pierre d'une pièce. Les 4C ne concernent que les diamants blancs. */
export type Stone = {
  kind: StoneKind;
  shape: StoneShape;
  count: number;
  /** Poids total en carats pour l'ensemble des pierres de cette ligne. */
  carats?: number;
  /** Diamètre en mm (perles). */
  sizeMm?: number;
  /** Grade de couleur des diamants blancs (D, E, F…). */
  color?: string;
  /** Teinte des pierres de couleur (saphirs). */
  hue?: Localized;
  clarity?: string;
  cut?: "Excellente" | "Très bonne";
  treatment?: Localized;
  origin: Localized;
  role: "centrale" | "accent";
};

export type MetalOption = {
  id: MetalId;
  /** Écart de prix en dollars canadiens par rapport au prix de base. */
  priceDelta: number;
};

export type SizeKind = "bague" | "longueur-collier" | "tour-de-poignet";

export type Visual = {
  /** Composition de l'illustration (et, en phase 3, du modèle 3D). */
  form:
    | "solitaire"
    | "trilogie"
    | "halo"
    | "toi-et-moi"
    | "epaulee"
    | "chevaliere"
    | "pendentif"
    | "boucles-pendantes"
    | "puces"
    | "riviere"
    | "rang-de-perles"
    | "manchette";
};

/** Pièce telle qu'elle est stockée (données locales, deux langues). */
export type ProductRecord = {
  slug: string;
  reference: string;
  collection: CollectionSlug;
  category: Category;
  name: Localized;
  /** Accroche technique d'une ligne (ex. « Solitaire 1,02 ct, D/VVS1 »). */
  summary: Localized;
  description: Localized;
  priceCad: number;
  metals: MetalOption[];
  sizes?: { kind: SizeKind; values: string[]; default: string };
  stones: Stone[];
  metalWeightG: number;
  certificate?: string;
  leadTime: { inStock: boolean; weeksMin: number; weeksMax: number };
  provenanceCode: string;
  visual: Visual;
  featured?: boolean;
};

export type CollectionRecord = {
  slug: CollectionSlug;
  order: number;
  name: Localized;
  tagline: Localized;
  stonesLine: Localized;
  inspiration: Localized<string[]>;
  signatureMetal: MetalId;
};

/* ── Vues localisées renvoyées par un CommerceProvider ───────── */

type Localize<T, K extends keyof T> = Omit<T, K> & { [P in K]: string };

export type ProductStone = Localize<Omit<Stone, "treatment" | "hue">, "origin"> & {
  treatment?: string;
  hue?: string;
};

export type Product = Localize<
  Omit<ProductRecord, "stones">,
  "name" | "summary" | "description"
> & {
  stones: ProductStone[];
};

export type Collection = Localize<
  Omit<CollectionRecord, "inspiration">,
  "name" | "tagline" | "stonesLine"
> & {
  inspiration: string[];
};

/**
 * Couche commerce. L'implémentation locale lit `data/*.ts` ; l'adaptateur Shopify
 * lit la Storefront API. Le choix se fait par `COMMERCE_PROVIDER`.
 */
export interface CommerceProvider {
  readonly name: "local" | "shopify";
  getCollections(locale: Locale): Promise<Collection[]>;
  getCollection(slug: string, locale: Locale): Promise<Collection | null>;
  getProducts(locale: Locale, filter?: { collection?: CollectionSlug }): Promise<Product[]>;
  getProduct(slug: string, locale: Locale): Promise<Product | null>;
}
