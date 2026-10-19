import { describe, expect, it } from "vitest";
import {
  CARATS,
  DEFAULT_CONFIG,
  clampCarats,
  decodeConfig,
  encodeConfig,
  sanitizeEngraving,
  type AtelierConfig,
} from "@/lib/atelier/config";
import { priceConfig } from "@/lib/atelier/pricing";

describe("état du configurateur dans l'URL", () => {
  it("aller-retour sans perte", () => {
    const config: AtelierConfig = {
      shape: "poire",
      carats: 1.35,
      metal: "platine",
      setting: "trilogie",
      engraving: "À toi, toujours ♥",
    };
    const url = encodeConfig(config).toString();
    expect(decodeConfig(new URLSearchParams(url))).toEqual(config);
    expect(url).toContain("v=1");
  });

  it("URL vide ou fantaisiste : valeurs par défaut", () => {
    expect(decodeConfig(new URLSearchParams(""))).toEqual(DEFAULT_CONFIG);
    const odd = decodeConfig(
      new URLSearchParams("forme=triangle&metal=argent&monture=x&carats=abc"),
    );
    expect(odd).toEqual(DEFAULT_CONFIG);
  });

  it("carats bornés et arrondis au pas de 0,05", () => {
    expect(clampCarats(0.1)).toBe(CARATS.min);
    expect(clampCarats(12)).toBe(CARATS.max);
    expect(clampCarats(1.234)).toBe(1.25);
    expect(decodeConfig(new URLSearchParams("carats=2.97")).carats).toBe(2.95);
  });

  it("gravure nettoyée et limitée à 24 caractères", () => {
    expect(sanitizeEngraving("<script>alert(1)</script>")).toBe("scriptalert1script");
    expect(sanitizeEngraving("Hélène & Paul ∞ 2026")).toBe("Hélène & Paul ∞ 2026");
    expect(sanitizeEngraving("a".repeat(40))).toHaveLength(24);
    expect(sanitizeEngraving("  deux   espaces")).toBe("deux espaces");
  });
});

describe("prix", () => {
  const base = { ...DEFAULT_CONFIG };

  it("croît avec le poids, plus vite que linéairement", () => {
    const p1 = priceConfig({ ...base, carats: 1 }).stone;
    const p2 = priceConfig({ ...base, carats: 2 }).stone;
    expect(p2).toBeGreaterThan(2 * p1);
    let previous = 0;
    for (let ct = CARATS.min; ct <= CARATS.max; ct += CARATS.step) {
      const total = priceConfig({ ...base, carats: clampCarats(ct) }).total;
      expect(total).toBeGreaterThanOrEqual(previous);
      previous = total;
    }
  });

  it("platine : supplément ; ors : même prix", () => {
    const or = priceConfig({ ...base, metal: "or-jaune" }).total;
    expect(priceConfig({ ...base, metal: "or-rose" }).total).toBe(or);
    expect(priceConfig({ ...base, metal: "platine" }).total).toBe(or + 900);
  });

  it("halo et trilogie coûtent plus qu'un solitaire ; la gravure est offerte", () => {
    const solo = priceConfig(base).total;
    expect(priceConfig({ ...base, setting: "halo" }).total).toBeGreaterThan(solo);
    expect(priceConfig({ ...base, setting: "trilogie" }).total).toBeGreaterThan(solo);
    expect(priceConfig({ ...base, engraving: "Toujours" }).total).toBe(solo);
  });

  it("total arrondi à la dizaine et égal à la somme du détail", () => {
    const b = priceConfig({
      shape: "ovale",
      carats: 1.45,
      metal: "platine",
      setting: "halo",
      engraving: "",
    });
    expect(b.total % 10).toBe(0);
    expect(b.total).toBe(b.stone + b.setting + b.metal + b.engraving);
  });

  it("ordre de grandeur : 1 ct rond, solitaire or blanc ≈ 9 800 $", () => {
    expect(priceConfig(base).total).toBe(9800);
  });
});
