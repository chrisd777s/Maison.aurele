/**
 * Couleurs de marque en hexadécimal, pour les supports qui ignorent les variables
 * CSS : courriels et images de partage. Recopie des tokens de `app/globals.css`
 * (seule exception à la règle des couleurs ; concordance vérifiée par test).
 */
export const brandHex = {
  ivoire: "#f6f1ea",
  nacre: "#ede6dc",
  onyx: "#0e0d0c",
  champagne: "#c2a36b",
  champagneEncre: "#7e6331",
  pierre: "#8c857c",
  pierreEncre: "#6b655d",
  // `--filet` (pierre à 35 % sur ivoire), aplati
  filet: "#d1cbc3",
} as const;
