import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { routing } from "@/i18n/routing";

function keys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe("traductions", () => {
  it("le français et l'anglais ont exactement les mêmes clés", () => {
    expect(keys(en).sort()).toEqual(keys(fr).sort());
  });

  it("aucune traduction n'est vide", () => {
    for (const messages of [fr, en]) {
      for (const key of keys(messages)) {
        const value = key
          .split(".")
          .reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], messages);
        expect(String(value).trim(), key).not.toBe("");
      }
    }
  });
});

describe("routage", () => {
  const entries = Object.entries(routing.pathnames);

  it("chaque chemin traduit garde les mêmes paramètres dynamiques", () => {
    for (const [internal, external] of entries) {
      const params = (p: string) => (p.match(/\[[^\]]+\]/g) ?? []).sort();
      const variants = typeof external === "string" ? [external] : Object.values(external);
      for (const v of variants) expect(params(v), internal).toEqual(params(internal));
    }
  });

  it("aucune URL publique n'est partagée par deux pages dans une même langue", () => {
    for (const locale of routing.locales) {
      const urls = entries.map(([, e]) => (typeof e === "string" ? e : e[locale]));
      expect(new Set(urls).size).toBe(urls.length);
    }
  });
});
