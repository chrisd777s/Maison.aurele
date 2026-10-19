import type { MetalId } from "./types";

/** Tous les métaux connus, dans l'ordre de présentation. */
export const METAL_IDS = [
  "or-blanc",
  "or-jaune",
  "or-rose",
  "platine",
  "or-noir",
] as const satisfies readonly MetalId[];
