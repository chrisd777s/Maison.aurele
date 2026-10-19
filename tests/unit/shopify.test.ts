import { describe, expect, it } from "vitest";
import {
  mapCollection,
  mapProduct,
  toMetalId,
  type ShopifyProduct,
} from "@/lib/commerce/shopify/mapper";

const fixture: ShopifyProduct = {
  handle: "aube-premiere",
  title: "Bague Aube Première",
  description: "Notre solitaire le plus pur.",
  options: [
    { name: "Métal", optionValues: [{ name: "Or blanc" }, { name: "Platine" }] },
    { name: "Taille", optionValues: ["5", "6", "7"].map((name) => ({ name })) },
  ],
  variants: {
    nodes: [
      {
        price: { amount: "14800.0", currencyCode: "CAD" },
        availableForSale: true,
        selectedOptions: [
          { name: "Métal", value: "Or blanc" },
          { name: "Taille", value: "6" },
        ],
      },
      {
        price: { amount: "14800.0", currencyCode: "CAD" },
        availableForSale: true,
        selectedOptions: [
          { name: "Métal", value: "Or blanc" },
          { name: "Taille", value: "7" },
        ],
      },
      {
        price: { amount: "15700.0", currencyCode: "CAD" },
        availableForSale: true,
        selectedOptions: [
          { name: "Métal", value: "Platine" },
          { name: "Taille", value: "6" },
        ],
      },
    ],
  },
  metafields: [
    { key: "reference", value: "AUR-AU-101" },
    { key: "collection", value: "aube" },
    { key: "category", value: "bague" },
    { key: "lead_time", value: '{"inStock":true,"weeksMin":0,"weeksMax":0}' },
    {
      key: "stones",
      value:
        '[{"kind":"diamant","shape":"rond","count":1,"carats":1.02,"origin":"Canada","role":"centrale"}]',
    },
    { key: "visual_form", value: "solitaire" },
    null,
  ],
};

describe("adaptateur Shopify", () => {
  it("convertit variantes et métadonnées dans le modèle de la Maison", () => {
    const product = mapProduct(fixture);
    expect(product.priceCad).toBe(14800);
    expect(product.metals).toEqual([
      { id: "or-blanc", priceDelta: 0 },
      { id: "platine", priceDelta: 900 },
    ]);
    expect(product.sizes?.values).toEqual(["5", "6", "7"]);
    expect(product.sizes?.default).toBe("6");
    expect(product.stones[0]?.carats).toBe(1.02);
    expect(product.reference).toBe("AUR-AU-101");
  });

  it("reconnaît les métaux en français et en anglais, sans accents", () => {
    expect(toMetalId("Or rhodié noir")).toBe("or-noir");
    expect(toMetalId("Yellow Gold")).toBe("or-jaune");
    expect(() => toMetalId("Argent")).toThrow();
  });

  it("convertit une collection", () => {
    const c = mapCollection({
      handle: "maree",
      title: "Marée",
      metafields: [
        { key: "order", value: "2" },
        { key: "inspiration", value: '["Un.","Deux."]' },
      ],
    });
    expect(c.order).toBe(2);
    expect(c.inspiration).toHaveLength(2);
  });
});
