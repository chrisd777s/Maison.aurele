import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { localizeProduct } from "@/lib/commerce/local/provider";
import { formatMoney } from "@/lib/currency";
import { decodeEcrin, encodeEcrin } from "@/lib/ecrin/token";
import { toCatalogueEntry } from "@/lib/shop/catalogue";
import { checkoutSchema } from "@/lib/shop/checkout-schema";
import { DEPOSIT_RATE, DEPOSIT_THRESHOLD, priceOrder } from "@/lib/shop/order";
import { toForm, verifyWebhook } from "@/lib/stripe";

const catalogue = products.map((p) => toCatalogueEntry(localizeProduct(p, "fr")));
const slugs = new Set(products.map((p) => p.slug));
// Bague dont toutes les versions restent sous le seuil d'acompte.
const ring = products.find(
  (p) =>
    p.sizes?.kind === "bague" &&
    p.metals.length > 1 &&
    p.metals.every((m) => p.priceCad + m.priceDelta < DEPOSIT_THRESHOLD),
)!;
const big = products.find((p) => p.priceCad >= DEPOSIT_THRESHOLD)!;
const noSize = products.find((p) => !p.sizes)!;

describe("calcul de la commande", () => {
  it("prix du métal choisi, quantité, total réglé en entier sous le seuil", () => {
    const metal = ring.metals.at(-1)!;
    const order = priceOrder(
      [{ slug: ring.slug, metal: metal.id, size: ring.sizes!.default, quantity: 2 }],
      catalogue,
    );
    expect(order.invalid).toEqual([]);
    expect(order.subtotal).toBe((ring.priceCad + metal.priceDelta) * 2);
    expect(order.dueNow).toBe(order.subtotal);
    expect(order.balance).toBe(0);
  });

  it("le seuil s'apprécie sur le prix du métal choisi", () => {
    const crossing = products.find(
      (p) =>
        p.priceCad < DEPOSIT_THRESHOLD &&
        p.metals.some((m) => p.priceCad + m.priceDelta >= DEPOSIT_THRESHOLD),
    )!;
    const metal = crossing.metals.find(
      (m) => crossing.priceCad + m.priceDelta >= DEPOSIT_THRESHOLD,
    )!;
    const order = priceOrder(
      [{ slug: crossing.slug, metal: metal.id, size: crossing.sizes?.default, quantity: 1 }],
      catalogue,
    );
    expect(order.lines[0]!.deposit).toBe(true);
  });

  it("acompte au-delà du seuil, arrondi par unité", () => {
    const order = priceOrder(
      [{ slug: big.slug, metal: big.metals[0]!.id, size: big.sizes?.default, quantity: 1 }],
      catalogue,
    );
    const line = order.lines[0]!;
    expect(line.deposit).toBe(true);
    expect(line.unitDueNow).toBe(Math.round(big.priceCad * DEPOSIT_RATE));
    expect(order.balance).toBe(big.priceCad - line.unitDueNow);
  });

  it("écarte les lignes invalides (pièce inconnue, métal non proposé, taille absente, quantité)", () => {
    const unavailable = (["or-blanc", "or-jaune", "or-rose", "platine", "or-noir"] as const).find(
      (m) => !ring.metals.some((x) => x.id === m),
    )!;
    const order = priceOrder(
      [
        { slug: "inconnue", metal: "or-blanc", quantity: 1 },
        { slug: ring.slug, metal: unavailable, size: ring.sizes!.default, quantity: 1 },
        { slug: ring.slug, metal: ring.metals[0]!.id, quantity: 1 },
        { slug: ring.slug, metal: ring.metals[0]!.id, size: "99", quantity: 1 },
        { slug: noSize.slug, metal: noSize.metals[0]!.id, quantity: 4 },
      ],
      catalogue,
    );
    expect(order.lines).toHaveLength(0);
    expect(order.invalid).toHaveLength(5);
  });

  it("le corps de paiement refuse tout prix envoyé par le navigateur et les chemins externes", () => {
    const base = {
      locale: "fr",
      lines: [{ slug: noSize.slug, metal: noSize.metals[0]!.id, quantity: 1 }],
      gift: { wrap: true, card: "" },
      delivery: "domicile",
    };
    expect(checkoutSchema.safeParse(base).success).toBe(true);
    const parsed = checkoutSchema.parse({ ...base, lines: [{ ...base.lines[0], priceCad: 1 }] });
    expect(parsed.lines[0]).not.toHaveProperty("priceCad");
    expect(checkoutSchema.safeParse({ ...base, returnPath: "//evil.example" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...base, returnPath: "/fr/ecrin" }).success).toBe(true);
  });
});

describe("devises", () => {
  it("CAD exact, USD et EUR arrondis à la dizaine", () => {
    expect(formatMoney(14800, "CAD", "fr").replace(/\s/g, " ")).toBe("14 800 $");
    expect(formatMoney(14800, "USD", "en")).toBe("US$10,660");
    expect(formatMoney(14800, "EUR", "fr").replace(/\s/g, " ")).toBe("9 770 €");
  });
});

describe("lien de partage de l'Écrin", () => {
  const items = [
    { slug: ring.slug, metal: ring.metals[0]!.id },
    { slug: big.slug, metal: big.metals[0]!.id },
  ];

  it("aller-retour, prix masqués ou non", () => {
    for (const hidePrices of [true, false]) {
      const token = encodeEcrin({ items, hidePrices });
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(token).not.toContain(ring.slug); // discret : rien de lisible
      expect(decodeEcrin(token, slugs)).toEqual({ items, hidePrices });
    }
  });

  it("refuse les jetons illisibles ou désignant une pièce inconnue", () => {
    expect(decodeEcrin("n'importe quoi", slugs)).toBeNull();
    expect(decodeEcrin("AAAA", slugs)).toBeNull();
    const forged = encodeEcrin({
      items: [{ slug: "contrefacon", metal: "or-blanc" }],
      hidePrices: false,
    });
    expect(decodeEcrin(forged, slugs)).toBeNull();
  });
});

describe("Stripe", () => {
  it("encode les objets imbriqués comme l'API l'attend", () => {
    const form = toForm({
      line_items: [{ quantity: 1, price_data: { currency: "cad" } }],
      a: ["CA", "FR"],
    });
    expect(form.get("line_items[0][price_data][currency]")).toBe("cad");
    expect(form.get("line_items[0][quantity]")).toBe("1");
    expect(form.get("a[1]")).toBe("FR");
  });

  it("vérifie la signature d'un webhook et refuse le rejeu", () => {
    const secret = "whsec_test";
    const payload = '{"type":"checkout.session.completed"}';
    const t = 1_800_000_000;
    const sig = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
    const header = `t=${t},v1=${sig}`;
    expect(verifyWebhook(payload, header, secret, t * 1000)).toBe(true);
    expect(verifyWebhook(payload + " ", header, secret, t * 1000)).toBe(false);
    expect(verifyWebhook(payload, header, "autre", t * 1000)).toBe(false);
    expect(verifyWebhook(payload, header, secret, (t + 600) * 1000)).toBe(false);
    expect(verifyWebhook(payload, null, secret)).toBe(false);
  });
});
