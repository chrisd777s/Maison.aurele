import { describe, expect, it } from "vitest";
import { craftSteps } from "@/data/house";
import { articleIndex } from "@/data/journal-index";
import { articles } from "@/data/journal";
import { legalPages } from "@/data/legal";
import { products } from "@/data/products";
import { artisans, provenanceRecords, routes } from "@/data/provenance";
import { routing } from "@/i18n/routing";
import { anchorId, readingMinutes, type Block } from "@/lib/editorial/types";
import { normalizeCode } from "@/lib/provenance/code";
import { arcPath, formatCoordinates, journeysFor, MAP, project } from "@/lib/provenance/journey";
import {
  US_SIZES,
  circumferenceFromDiameter,
  diameterFromUs,
  frFromUs,
  isOutOfRange,
  pxPerMmFromCard,
  ukFromUs,
  usFromCircumference,
  usFromDiameter,
} from "@/lib/sizing/ring";

describe("tailles de bague", () => {
  it("taille 6 : 16,5 mm, tour 52, L½", () => {
    expect(diameterFromUs(6)).toBeCloseTo(16.51, 2);
    expect(frFromUs(6)).toBe(52);
    expect(ukFromUs(6)).toBe("L½");
  });

  it("correspondances de référence", () => {
    expect(ukFromUs(3)).toBe("F½");
    expect(ukFromUs(6.5)).toBe("M½");
    expect(ukFromUs(9)).toBe("R½");
    expect(ukFromUs(13)).toBe("Z½");
    expect(frFromUs(4)).toBe(47);
    expect(frFromUs(8)).toBe(57);
  });

  it("aller-retour diamètre ↔ taille sur toute la gamme", () => {
    for (const us of US_SIZES) {
      expect(usFromDiameter(diameterFromUs(us))).toBe(us);
      expect(usFromCircumference(circumferenceFromDiameter(diameterFromUs(us)))).toBe(us);
    }
  });

  it("arrondit à la demi-taille la plus proche", () => {
    expect(usFromDiameter(diameterFromUs(6) + 0.15)).toBe(6);
    expect(usFromDiameter(diameterFromUs(6) + 0.3)).toBe(6.5);
  });

  it("signale les mesures hors gamme", () => {
    expect(isOutOfRange(12)).toBe(true);
    expect(isOutOfRange(16.5)).toBe(false);
    expect(isOutOfRange(24)).toBe(true);
  });

  it("calibrage : une carte de 85,6 mm affichée sur 323,5 px → 3,78 px/mm", () => {
    expect(pxPerMmFromCard(323.5)).toBeCloseTo(3.78, 2);
  });

  it("les tailles proposées sur les fiches sont dans la gamme", () => {
    for (const p of products) {
      if (p.sizes?.kind !== "bague") continue;
      for (const v of p.sizes.values) expect(US_SIZES).toContain(Number(v));
    }
  });
});

describe("provenance", () => {
  it("chaque pièce a sa fiche, et inversement", () => {
    const codes = products.map((p) => p.provenanceCode).sort();
    expect(provenanceRecords.map((r) => r.code).sort()).toEqual(codes);
  });

  it("dates de sertissage valides et passées, artisans connus", () => {
    const ids = new Set<string>(artisans.map((a) => a.id));
    for (const r of provenanceRecords) {
      expect(r.setAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(r.setAt))).toBe(false);
      expect(r.setAt < "2026-10-19").toBe(true);
      expect(ids.has(r.setter)).toBe(true);
      expect(ids.has(r.polisher)).toBe(true);
    }
  });

  it("toute nature de pierre du catalogue a un parcours", () => {
    for (const p of products) for (const s of p.stones) expect(routes[s.kind]).toBeDefined();
  });

  it("un parcours par nature de pierre, la pierre centrale d'abord", () => {
    const j = journeysFor([
      { kind: "diamant", role: "accent" },
      { kind: "saphir", role: "centrale" },
      { kind: "diamant", role: "accent" },
    ]);
    expect(j.map((x) => x.kind)).toEqual(["saphir", "diamant"]);
    expect(j[0]!.central).toBe(true);
    expect(j[0]!.stops.map((s) => s.stage)).toEqual(["origine", "taille", "atelier"]);
  });

  it("tous les lieux tombent dans le cadre de la carte", () => {
    const places = Object.values(routes).flatMap((r) => [r.origin, r.cutting]);
    for (const place of places) {
      const { x, y } = project(place.lat, place.lon);
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(MAP.width);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(MAP.height);
    }
    expect(arcPath(routes.diamant.origin, routes.diamant.cutting)).toMatch(/^M[\d.]+ [\d.]+ Q/);
  });

  it("coordonnées lisibles dans les deux langues", () => {
    expect(formatCoordinates(routes.diamant.origin, "fr")).toBe("64,7° N · 110,6° O");
    expect(formatCoordinates(routes.diamant.origin, "en")).toBe("64.7° N · 110.6° W");
    expect(formatCoordinates(routes.onyx.origin, "en")).toBe("30.4° S · 56.5° W");
  });

  it("normalise un code saisi à la main ou lu dans un QR", () => {
    expect(normalizeCode(" au101-0187 ")).toBe("AU101-0187");
    expect(normalizeCode("au101 0187")).toBe("AU101-0187");
    expect(normalizeCode("AU1010187")).toBe("AU101-0187");
    expect(normalizeCode("inconnu")).toBe("INCONNU");
  });
});

/** Structure d'un texte (nature des blocs et longueur des listes), sans les mots. */
const shape = (blocks: Block[]) =>
  blocks.map((b) => (b.kind === "list" ? `list:${b.items.length}` : b.kind)).join(",");

describe("contenus éditoriaux", () => {
  it("articles : même structure en français et en anglais, aucun texte vide", () => {
    for (const a of articles) {
      expect(shape(a.body.en), a.slug).toBe(shape(a.body.fr));
      for (const locale of routing.locales) {
        expect(a.title[locale].trim()).not.toBe("");
        expect(a.dek[locale].trim()).not.toBe("");
        for (const b of a.body[locale]) {
          const texts = b.kind === "list" ? b.items : [b.text];
          for (const text of texts) expect(text.trim()).not.toBe("");
        }
      }
    }
  });

  it("articles : 500 mots au moins, pièces citées existantes, slugs uniques", () => {
    const slugs = new Set(products.map((p) => p.slug));
    for (const a of articles) {
      for (const locale of routing.locales) {
        const words = a.body[locale]
          .flatMap((b) => (b.kind === "list" ? b.items : [b.text]))
          .join(" ")
          .split(/\s+/).length;
        expect(words, `${a.slug} ${locale}`).toBeGreaterThanOrEqual(500);
      }
      expect(readingMinutes(a.body.fr)).toBeGreaterThanOrEqual(2);
      for (const s of a.related) expect(slugs.has(s), s).toBe(true);
    }
    expect(new Set(articleIndex.map((a) => a.slug)).size).toBe(articleIndex.length);
    expect(articles).toHaveLength(3);
    // Du plus récent au plus ancien.
    expect(articles.map((a) => a.date)).toEqual([...articles.map((a) => a.date)].sort().reverse());
  });

  it("pages légales : même structure dans les deux langues, ancres uniques", () => {
    for (const [slug, page] of Object.entries(legalPages)) {
      expect(shape(page.body.en), slug).toBe(shape(page.body.fr));
      for (const locale of routing.locales) {
        const anchors = page.body[locale]
          .filter((b) => b.kind === "h2")
          .map((b) => anchorId(b.text));
        expect(new Set(anchors).size, `${slug} ${locale}`).toBe(anchors.length);
        expect(anchors.every(Boolean)).toBe(true);
      }
    }
  });

  it("la confidentialité nomme les lois et les autorités", () => {
    const fr = legalPages.confidentialite.body.fr
      .map((b) => ("text" in b ? b.text : b.items.join(" ")))
      .join(" ");
    for (const term of [
      "Loi 25",
      "Commission d’accès à l’information",
      "CNIL",
      "Stripe",
      "Resend",
    ]) {
      expect(fr + legalPages.confidentialite.intro.fr).toContain(term);
    }
  });

  it("ancres : sans accents ni ponctuation", () => {
    expect(anchorId("Ce que nous recueillons, et pourquoi")).toBe(
      "ce-que-nous-recueillons-et-pourquoi",
    );
    expect(anchorId("L’éclat, d’abord")).toBe("l-eclat-d-abord");
  });

  it("savoir-faire : six étapes dans l'ordre du brief", () => {
    expect(craftSteps.map((s) => s.id)).toEqual([
      "croquis",
      "gouache",
      "cire",
      "fonte",
      "sertissage",
      "polissage",
    ]);
  });
});
