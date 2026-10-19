import type { MetalId } from "@/lib/commerce/types";
import type { CatalogueEntry } from "./catalogue";

/**
 * Calcul d'une commande, partagé par le panier (affichage) et le serveur (montant
 * facturé : le navigateur n'envoie jamais de prix, seulement des références).
 */

/** Au-delà de ce prix unitaire, la pièce est réservée par un acompte. */
export const DEPOSIT_THRESHOLD = 15_000;
export const DEPOSIT_RATE = 0.3;
export const MAX_QUANTITY = 3;
export const GIFT_CARD_MAX = 240;

export const DELIVERIES = ["domicile", "salon-montreal", "salon-paris"] as const;
export type Delivery = (typeof DELIVERIES)[number];

export type CartLine = { slug: string; metal: MetalId; size?: string; quantity: number };

export type PricedLine = CartLine & {
  entry: CatalogueEntry;
  unitPrice: number;
  total: number;
  /** Montant réglé aujourd'hui par unité (acompte ou prix entier). */
  unitDueNow: number;
  dueNow: number;
  deposit: boolean;
};

export type PricedOrder = {
  lines: PricedLine[];
  subtotal: number;
  dueNow: number;
  balance: number;
  /** Lignes ignorées (pièce retirée du catalogue, métal ou taille indisponible). */
  invalid: CartLine[];
};

export const lineId = (line: Pick<CartLine, "slug" | "metal" | "size">) =>
  [line.slug, line.metal, line.size ?? ""].join("|");

export function unitPrice(entry: CatalogueEntry, metal: MetalId) {
  const option = entry.metals.find((m) => m.id === metal);
  return option ? entry.priceCad + option.priceDelta : null;
}

export function priceOrder(lines: CartLine[], catalogue: CatalogueEntry[]): PricedOrder {
  const bySlug = new Map(catalogue.map((entry) => [entry.slug, entry]));
  const priced: PricedLine[] = [];
  const invalid: CartLine[] = [];

  for (const line of lines) {
    const entry = bySlug.get(line.slug);
    const price = entry ? unitPrice(entry, line.metal) : null;
    const sizeOk =
      !entry?.sizes || (line.size !== undefined && entry.sizes.values.includes(line.size));
    const quantityOk =
      Number.isInteger(line.quantity) && line.quantity >= 1 && line.quantity <= MAX_QUANTITY;
    if (!entry || price === null || !sizeOk || !quantityOk) {
      invalid.push(line);
      continue;
    }
    const deposit = price >= DEPOSIT_THRESHOLD;
    // Acompte arrondi au dollar, par unité : le montant affiché est celui facturé.
    const unitDueNow = deposit ? Math.round(price * DEPOSIT_RATE) : price;
    priced.push({
      ...line,
      entry,
      unitPrice: price,
      total: price * line.quantity,
      deposit,
      unitDueNow,
      dueNow: unitDueNow * line.quantity,
    });
  }

  const subtotal = priced.reduce((sum, l) => sum + l.total, 0);
  const dueNow = priced.reduce((sum, l) => sum + l.dueNow, 0);
  return { lines: priced, subtotal, dueNow, balance: subtotal - dueNow, invalid };
}
