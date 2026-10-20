/**
 * Ambiance de collection d'une adresse : la page d'une collection ou d'une de ses
 * pièces teinte le fond de tout le site. Fonction autonome (sans dépendance) :
 * le script d'amorçage du gabarit la recopie telle quelle pour l'appliquer avant
 * la première peinture.
 */
export function ambianceFor(pathname: string, pieces: Record<string, string>): string | null {
  const collection = /^\/(?:fr|en)\/collections\/([^/]+)\/?$/.exec(pathname);
  if (collection) return decodeURIComponent(collection[1]!);
  const piece = /^\/(?:fr|en)\/(?:creations|pieces)\/([^/]+)\/?$/.exec(pathname);
  return piece ? (pieces[decodeURIComponent(piece[1]!)] ?? null) : null;
}

/** Applique l'ambiance à `<html data-ambiance>` (ou la retire). */
export function applyAmbiance(ambiance: string | null) {
  const root = document.documentElement;
  if (ambiance) root.dataset.ambiance = ambiance;
  else delete root.dataset.ambiance;
}
