import type { MetalId } from "@/lib/commerce/types";

/** Image fixe d'une pièce, rendue depuis la scène 3D (scripts/render-posters.mjs). */
export function renderSrc(slug: string, metal: MetalId) {
  return `/renders/${slug}--${metal}.webp`;
}

export const RENDER_WIDTH = 1600;
export const RENDER_HEIGHT = 2000;
