import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { ambianceFor } from "@/lib/ambiance";
import { brandHex } from "@/lib/brand/hex";

const css = readFileSync("app/globals.css", "utf8");
const token = (name: string) => new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`).exec(css)?.[1];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const path = join(dir, f);
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(f) ? [path] : [];
  });
}

describe("couleurs hors CSS", () => {
  it("les valeurs hexadécimales recopient les tokens de globals.css", () => {
    const pairs: [keyof typeof brandHex, string][] = [
      ["ivoire", "ivoire"],
      ["nacre", "nacre"],
      ["onyx", "onyx"],
      ["champagne", "champagne"],
      ["champagneEncre", "champagne-encre"],
      ["pierre", "pierre"],
      ["pierreEncre", "pierre-encre"],
    ];
    for (const [key, name] of pairs) expect(brandHex[key], name).toBe(token(name));
  });
});

describe("messages transmis au navigateur", () => {
  it("chaque espace de noms lu par un composant client est transmis", () => {
    const sources = [...files("app"), ...files("components")];
    const provider = readFileSync("components/i18n/ClientMessages.tsx", "utf8");
    const layout = [...provider.matchAll(/^\s+"([A-Z]\w+)",$/gm)].map((m) => m[1]);
    const passed = new Set(layout);
    for (const file of sources) {
      for (const m of readFileSync(file, "utf8").matchAll(/namespaces=\{\[([^\]]*)\]\}/g)) {
        for (const ns of m[1]!.matchAll(/"(\w+)"/g)) passed.add(ns[1]!);
      }
    }
    const missing = sources
      .filter((f) => readFileSync(f, "utf8").startsWith('"use client"'))
      .flatMap((f) =>
        [...readFileSync(f, "utf8").matchAll(/useTranslations\("(\w+)"\)/g)]
          .map((m) => m[1]!)
          .filter((ns) => !passed.has(ns))
          .map((ns) => `${f} : ${ns}`),
      );
    expect(layout.length).toBeGreaterThan(3);
    expect(missing).toEqual([]);
  });

  it("les courriels ne partent jamais au navigateur", () => {
    const provider = readFileSync("components/i18n/ClientMessages.tsx", "utf8");
    expect(provider).not.toMatch(/"Email"/);
  });
});

describe("robots.txt", () => {
  it("écarte les pages personnelles et annonce le plan du site", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0]! : result.rules;
    const disallow = [rules.disallow].flat();
    for (const path of ["/api/", "/fr/ecrin/partage/", "/en/ecrin/shared/", "/fr/commande/"]) {
      expect(disallow).toContain(path);
    }
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});

describe("images de partage", () => {
  it("chaque rendu a sa version JPEG pour next/og", () => {
    const renders = readdirSync("public/renders").filter((f) => f.endsWith(".webp"));
    const jpegs = new Set(readdirSync("public/renders/partage"));
    for (const r of renders) expect(jpegs.has(r.replace(/\.webp$/, ".jpg")), r).toBe(true);
  });
});

describe("ambiance de collection", () => {
  const pieces = { "maree-haute": "maree", "aube-premiere": "aube" };
  it("se déduit de l'adresse d'une collection ou d'une pièce, dans les deux langues", () => {
    expect(ambianceFor("/fr/collections/obsidienne", pieces)).toBe("obsidienne");
    expect(ambianceFor("/fr/creations/maree-haute", pieces)).toBe("maree");
    expect(ambianceFor("/en/pieces/aube-premiere/", pieces)).toBe("aube");
  });
  it("aucune ailleurs ni pour une pièce inconnue", () => {
    expect(ambianceFor("/fr", pieces)).toBeNull();
    expect(ambianceFor("/fr/journal/choisir-un-diamant", pieces)).toBeNull();
    expect(ambianceFor("/fr/creations/inconnue", pieces)).toBeNull();
  });
  it("le script d'amorçage peut recopier la fonction telle quelle", () => {
    const copy = new Function(`return (${ambianceFor.toString()})`)() as typeof ambianceFor;
    expect(copy("/fr/collections/aube", {})).toBe("aube");
  });
});

describe("feuille de style", () => {
  it("aucun :has() (recalcul de style de tout le document à chaque mutation)", () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/:has\(/);
  });
});
