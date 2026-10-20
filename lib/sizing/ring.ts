/**
 * Tailles de bague. Référence : la taille nord-américaine (CA/US), dont le diamètre
 * intérieur croît de 0,8128 mm par taille à partir de 11,63 mm (taille 0).
 * La taille française est le tour de doigt en millimètres ; la britannique, une lettre
 * (F½ = taille 3, puis deux demi-lettres par taille).
 */

/** Carte bancaire au format ID-1 (ISO/IEC 7810) : largeur en millimètres. */
export const CARD_WIDTH_MM = 85.6;
export const CARD_HEIGHT_MM = 53.98;

export const US_MIN = 3;
export const US_MAX = 13;

/** Tailles CA/US par demi-taille, de 3 à 13. */
export const US_SIZES: number[] = Array.from(
  { length: (US_MAX - US_MIN) * 2 + 1 },
  (_, i) => US_MIN + i / 2,
);

export function diameterFromUs(us: number) {
  return 11.63 + 0.8128 * us;
}

export function circumferenceFromDiameter(mm: number) {
  return Math.PI * mm;
}

/** Taille CA/US la plus proche (par demi-taille), bornée à la plage proposée. */
export function usFromDiameter(mm: number) {
  const exact = (mm - 11.63) / 0.8128;
  const half = Math.round(exact * 2) / 2;
  return Math.min(US_MAX, Math.max(US_MIN, half));
}

export function usFromCircumference(mm: number) {
  return usFromDiameter(mm / Math.PI);
}

/** Taille française : tour de doigt arrondi au millimètre. */
export function frFromUs(us: number) {
  return Math.round(circumferenceFromDiameter(diameterFromUs(us)));
}

const UK_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Taille britannique : 3 → « F½ », 6 → « L½ », 6,5 → « M½ ». */
export function ukFromUs(us: number) {
  const index = 5.5 + (us - US_MIN) * 2;
  const letter = UK_LETTERS[Math.floor(index)];
  if (!letter) return "Z+";
  return index % 1 === 0 ? letter : `${letter}½`;
}

/** Taille hors de la plage mesurable (bague trop petite ou trop grande). */
export function isOutOfRange(mm: number) {
  const exact = (mm - 11.63) / 0.8128;
  return exact < US_MIN - 0.25 || exact > US_MAX + 0.25;
}

/** Pixels CSS par millimètre, d'après la largeur à l'écran de la carte posée contre lui. */
export function pxPerMmFromCard(cardWidthPx: number) {
  return cardWidthPx / CARD_WIDTH_MM;
}

/**
 * Valeur de départ du calibrage : 96 px CSS par pouce (norme CSS), juste sur un
 * ordinateur de bureau, souvent fausse sur un téléphone — d'où la carte.
 */
export const DEFAULT_PX_PER_MM = 96 / 25.4;

/** Affichage : « 6 », « 6½ ». */
export function formatUs(us: number) {
  return us % 1 === 0 ? String(us) : `${Math.floor(us)}½`;
}
