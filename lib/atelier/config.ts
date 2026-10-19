import type { MetalId } from "@/lib/commerce/types";

/** Bague composée dans L'Atelier. */
export type AtelierShape = "rond" | "ovale" | "emeraude" | "poire" | "coussin";
export type AtelierMetal = Extract<MetalId, "or-jaune" | "or-blanc" | "or-rose" | "platine">;
export type AtelierSetting = "solitaire" | "halo" | "trilogie";

export type AtelierConfig = {
  shape: AtelierShape;
  carats: number;
  metal: AtelierMetal;
  setting: AtelierSetting;
  engraving: string;
};

export const SHAPES: AtelierShape[] = ["rond", "ovale", "emeraude", "poire", "coussin"];
export const METALS: AtelierMetal[] = ["or-jaune", "or-blanc", "or-rose", "platine"];
export const SETTINGS: AtelierSetting[] = ["solitaire", "halo", "trilogie"];

export const CARATS = { min: 0.5, max: 3, step: 0.05 } as const;
export const ENGRAVING_MAX = 24;

export const DEFAULT_CONFIG: AtelierConfig = {
  shape: "rond",
  carats: 1,
  metal: "or-blanc",
  setting: "solitaire",
  engraving: "",
};

/** Version du format d'URL : un lien partagé reste lisible si le format évolue. */
const VERSION = "1";

const oneOf = <T extends string>(list: readonly T[], value: string | null, fallback: T): T =>
  value !== null && (list as readonly string[]).includes(value) ? (value as T) : fallback;

/** Arrondit au pas de 0,05 ct et borne entre 0,5 et 3 ct. */
export function clampCarats(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_CONFIG.carats;
  const stepped = Math.round(value / CARATS.step) * CARATS.step;
  return Math.min(CARATS.max, Math.max(CARATS.min, Number(stepped.toFixed(2))));
}

/**
 * Gravure intérieure : lettres (accents compris), chiffres, espaces et quelques
 * signes que le graveur sait reproduire. Le reste est retiré.
 */
export function sanitizeEngraving(value: string) {
  return value
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} .,'’&\-♥∞]/gu, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(0, ENGRAVING_MAX);
}

/** URL → configuration. Toute valeur inconnue retombe sur la valeur par défaut. */
export function decodeConfig(params: URLSearchParams): AtelierConfig {
  return {
    shape: oneOf(SHAPES, params.get("forme"), DEFAULT_CONFIG.shape),
    carats: clampCarats(Number.parseFloat(params.get("carats") ?? "")),
    metal: oneOf(METALS, params.get("metal"), DEFAULT_CONFIG.metal),
    setting: oneOf(SETTINGS, params.get("monture"), DEFAULT_CONFIG.setting),
    engraving: sanitizeEngraving(params.get("gravure") ?? "").trim(),
  };
}

/** Configuration → paramètres d'URL lisibles (et stables, pour le partage). */
export function encodeConfig(config: AtelierConfig): URLSearchParams {
  const params = new URLSearchParams({
    v: VERSION,
    forme: config.shape,
    carats: clampCarats(config.carats).toFixed(2),
    metal: config.metal,
    monture: config.setting,
  });
  const engraving = sanitizeEngraving(config.engraving).trim();
  if (engraving) params.set("gravure", engraving);
  return params;
}
