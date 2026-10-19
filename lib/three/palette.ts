import type { MetalId, StoneKind } from "@/lib/commerce/types";

/**
 * Couleurs WebGL lues dans les tokens CSS (`app/globals.css`) : la 3D partage
 * exactement la palette du site, sans valeur dupliquée dans le code.
 */
const TOKENS = [
  "or-blanc",
  "or-jaune",
  "or-rose",
  "platine",
  "or-noir",
  "diamant",
  "diamant-reflet",
  "diamant-noir",
  "saphir",
  "saphir-clair",
  "perle",
  "perle-lustre",
  "onyx-pierre",
  "onyx",
  "champagne",
  "onyx-voile",
] as const;

export type Token = (typeof TOKENS)[number];
export type Palette = Record<Token, string>;

export function readPalette(element: Element = document.documentElement): Palette {
  const style = getComputedStyle(element);
  return Object.fromEntries(
    TOKENS.map((name) => [name, style.getPropertyValue(`--${name}`).trim()]),
  ) as Palette;
}

export const metalToken: Record<MetalId, Token> = {
  "or-blanc": "or-blanc",
  "or-jaune": "or-jaune",
  "or-rose": "or-rose",
  platine: "platine",
  "or-noir": "or-noir",
};

export const stoneToken: Record<StoneKind, Token> = {
  diamant: "diamant",
  "diamant-noir": "diamant-noir",
  saphir: "saphir",
  "perle-akoya": "perle",
  onyx: "onyx-pierre",
};
