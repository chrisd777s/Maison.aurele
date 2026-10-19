import { describe, expect, it } from "vitest";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { localProvider } from "@/lib/commerce/local/provider";

const words = (text: string) => text.trim().split(/\s+/).length;

describe("catalogue", () => {
  it("15 pièces, 5 par collection", () => {
    expect(products).toHaveLength(15);
    for (const c of collections) {
      expect(products.filter((p) => p.collection === c.slug)).toHaveLength(5);
    }
  });

  it("prix entre 1 800 $ et 48 000 $", () => {
    const prices = products.map((p) => p.priceCad);
    expect(Math.min(...prices)).toBe(1800);
    expect(Math.max(...prices)).toBe(48000);
  });

  it("identifiants uniques (slug, référence, parcours)", () => {
    for (const key of ["slug", "reference", "provenanceCode"] as const) {
      expect(new Set(products.map((p) => p[key])).size).toBe(products.length);
    }
  });

  it("descriptions éditoriales de 60 à 90 mots, dans les deux langues", () => {
    for (const p of products) {
      for (const locale of ["fr", "en"] as const) {
        const n = words(p.description[locale]);
        expect(n, `${p.slug} (${locale}) : ${n} mots`).toBeGreaterThanOrEqual(60);
        expect(n, `${p.slug} (${locale}) : ${n} mots`).toBeLessThanOrEqual(90);
      }
    }
  });

  it("4C complets pour chaque diamant blanc principal", () => {
    for (const p of products) {
      for (const s of p.stones.filter((s) => s.kind === "diamant" && s.role === "centrale")) {
        expect(s.carats, p.slug).toBeGreaterThan(0);
        expect(s.color, p.slug).toBeTruthy();
        expect(s.clarity, p.slug).toBeTruthy();
        expect(s.cut, p.slug).toBeTruthy();
      }
    }
  });

  it("taille par défaut présente dans la liste", () => {
    for (const p of products)
      if (p.sizes) expect(p.sizes.values, p.slug).toContain(p.sizes.default);
  });

  it("le premier métal est le prix de base", () => {
    for (const p of products) expect(p.metals[0]?.priceDelta, p.slug).toBe(0);
  });

  it("le fournisseur local localise les textes", async () => {
    const en = await localProvider.getProduct("maree-haute", "en");
    expect(en?.name).toBe("Marée Haute Ring");
    expect(en?.stones[0]?.hue).toBe("Cornflower blue");
    expect(await localProvider.getProduct("inconnu", "fr")).toBeNull();
    expect(
      (await localProvider.getProducts("fr", { collection: "aube" })).map((p) => p.slug),
    ).toContain("aube-premiere");
  });
});
