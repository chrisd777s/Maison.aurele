import type { AtelierConfig, AtelierSetting, AtelierShape } from "./config";

/**
 * Barème indicatif de L'Atelier (dollars canadiens). Diamant certifié F/VS1,
 * taille excellente ; le prix par carat croît avec le poids (rareté).
 * À remplacer par le barème réel de la Maison.
 */
const DIAMOND_BASE = 8200;
const DIAMOND_EXPONENT = 1.7;

const SHAPE_FACTOR: Record<AtelierShape, number> = {
  rond: 1,
  ovale: 0.93,
  emeraude: 0.86,
  poire: 0.9,
  coussin: 0.88,
};

const SETTING_PRICE: Record<AtelierSetting, number> = {
  solitaire: 1600,
  halo: 3500,
  trilogie: 2200,
};

const PLATINUM_SUPPLEMENT = 900;

/** Les pierres de côté d'une trilogie pèsent chacune 22 % de la pierre centrale. */
export const TRILOGY_SIDE_RATIO = 0.22;

export function diamondPrice(carats: number, shape: AtelierShape) {
  return DIAMOND_BASE * carats ** DIAMOND_EXPONENT * SHAPE_FACTOR[shape];
}

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export type PriceBreakdown = {
  stone: number;
  setting: number;
  metal: number;
  engraving: number;
  total: number;
};

export function priceConfig(config: AtelierConfig): PriceBreakdown {
  const stone = roundTo(diamondPrice(config.carats, config.shape), 10);
  const sideStones =
    config.setting === "trilogie"
      ? 2 * diamondPrice(config.carats * TRILOGY_SIDE_RATIO, "poire")
      : 0;
  const setting = roundTo(SETTING_PRICE[config.setting] + sideStones, 10);
  const metal = config.metal === "platine" ? PLATINUM_SUPPLEMENT : 0;
  // La gravure est offerte.
  const engraving = 0;
  return {
    stone,
    setting,
    metal,
    engraving,
    total: roundTo(stone + setting + metal + engraving, 10),
  };
}
