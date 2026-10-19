import type {
  Category,
  Collection,
  CollectionSlug,
  MetalId,
  Product,
  SizeKind,
  Visual,
} from "../types";

/* Formes minimales des réponses Storefront utilisées ici. */
type Metafield = { key: string; value: string } | null;
export type ShopifyProduct = {
  handle: string;
  title: string;
  description: string;
  options: { name: string; optionValues: { name: string }[] }[];
  variants: {
    nodes: {
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
      availableForSale: boolean;
    }[];
  };
  metafields: Metafield[];
};
export type ShopifyCollection = { handle: string; title: string; metafields: Metafield[] };

const METAL_OPTION = /^(m[ée]tal|metal)$/i;
const SIZE_OPTION = /^(taille|size|longueur|length|tour de poignet|wrist)$/i;

const METAL_ALIASES: Record<string, MetalId> = {
  "or blanc": "or-blanc",
  "white gold": "or-blanc",
  "or jaune": "or-jaune",
  "yellow gold": "or-jaune",
  "or rose": "or-rose",
  "rose gold": "or-rose",
  platine: "platine",
  platinum: "platine",
  "or rhodie noir": "or-noir",
  "black rhodium gold": "or-noir",
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function toMetalId(label: string): MetalId {
  const id = METAL_ALIASES[normalize(label)];
  if (!id) throw new Error(`Métal Shopify inconnu : « ${label} »`);
  return id;
}

function fields(metafields: Metafield[]) {
  const map = new Map<string, string>();
  for (const m of metafields) if (m) map.set(m.key, m.value);
  return {
    text: (key: string) => map.get(key) ?? "",
    json: <T>(key: string, fallback: T): T => {
      const raw = map.get(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    },
  };
}

/**
 * Shopify → modèle de la Maison. Le prix de base est le moins cher des variantes ;
 * l'écart par métal est le prix minimal de ce métal moins le prix de base.
 */
export function mapProduct(node: ShopifyProduct): Product {
  const f = fields(node.metafields);
  const variants = node.variants.nodes;
  if (variants.length === 0) throw new Error(`Produit sans variante : ${node.handle}`);

  const priceOf = (v: (typeof variants)[number]) => Math.round(Number(v.price.amount));
  const base = Math.min(...variants.map(priceOf));
  const optionValue = (v: (typeof variants)[number], pattern: RegExp) =>
    v.selectedOptions.find((o) => pattern.test(o.name))?.value;

  const metalLabels = [
    ...new Set(variants.map((v) => optionValue(v, METAL_OPTION)).filter(Boolean)),
  ] as string[];
  const metals = metalLabels.map((label) => ({
    id: toMetalId(label),
    priceDelta:
      Math.min(...variants.filter((v) => optionValue(v, METAL_OPTION) === label).map(priceOf)) -
      base,
  }));

  const sizeOption = node.options.find((o) => SIZE_OPTION.test(o.name));
  const sizeValues = sizeOption?.optionValues.map((v) => v.name) ?? [];
  const lead = f.json("lead_time", { inStock: true, weeksMin: 0, weeksMax: 0 });

  return {
    slug: node.handle,
    reference: f.text("reference"),
    collection: f.text("collection") as CollectionSlug,
    category: f.text("category") as Category,
    name: node.title,
    summary: f.text("summary"),
    description: node.description,
    priceCad: base,
    metals: metals.length > 0 ? metals : [{ id: "or-blanc", priceDelta: 0 }],
    sizes:
      sizeValues.length > 0
        ? {
            kind: (f.text("size_kind") || "bague") as SizeKind,
            values: sizeValues,
            default: sizeValues[Math.floor(sizeValues.length / 2)] ?? sizeValues[0]!,
          }
        : undefined,
    stones: f.json("stones", []),
    metalWeightG: Number(f.text("metal_weight_g") || 0),
    certificate: f.text("certificate") || undefined,
    leadTime: lead,
    provenanceCode: f.text("provenance_code"),
    visual: { form: (f.text("visual_form") || "solitaire") as Visual["form"] },
    featured: f.text("featured") === "true",
  };
}

export function mapCollection(node: ShopifyCollection): Collection {
  const f = fields(node.metafields);
  return {
    slug: node.handle as CollectionSlug,
    order: Number(f.text("order") || 0),
    name: node.title,
    tagline: f.text("tagline"),
    stonesLine: f.text("stones_line"),
    inspiration: f.json<string[]>("inspiration", []),
    signatureMetal: (f.text("signature_metal") || "or-blanc") as MetalId,
  };
}
