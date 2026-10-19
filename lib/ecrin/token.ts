import { METAL_IDS } from "@/lib/commerce/metals";
import type { MetalId } from "@/lib/commerce/types";

/**
 * Lien de partage de l'Écrin, sans compte ni stockage serveur : la sélection est
 * encodée dans l'URL (base64url), ce qui la rend discrète sans la chiffrer.
 * Format : « 1.<options>.<slug>~<métal>,… » ; options : « m » = prix masqués.
 */
export type SharedEcrin = { items: { slug: string; metal: MetalId }[]; hidePrices: boolean };

export const SHARE_MAX_ITEMS = 24;

const toBase64Url = (text: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(text)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

function fromBase64Url(token: string) {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeEcrin({ items, hidePrices }: SharedEcrin) {
  const list = items
    .slice(0, SHARE_MAX_ITEMS)
    .map((i) => `${i.slug}~${i.metal}`)
    .join(",");
  return toBase64Url(`1.${hidePrices ? "m" : ""}.${list}`);
}

/** Renvoie `null` pour tout jeton illisible ou désignant une pièce inconnue. */
export function decodeEcrin(token: string, knownSlugs: ReadonlySet<string>): SharedEcrin | null {
  if (!/^[A-Za-z0-9_-]{4,1200}$/.test(token)) return null;
  let text: string;
  try {
    text = fromBase64Url(token);
  } catch {
    return null;
  }
  const match = /^1\.(m?)\.(.+)$/.exec(text);
  if (!match) return null;
  const items: SharedEcrin["items"] = [];
  for (const part of match[2]!.split(",").slice(0, SHARE_MAX_ITEMS)) {
    const [slug, metal] = part.split("~");
    if (!slug || !knownSlugs.has(slug) || !METAL_IDS.includes(metal as MetalId)) return null;
    if (!items.some((i) => i.slug === slug)) items.push({ slug, metal: metal as MetalId });
  }
  return items.length ? { items, hidePrices: match[1] === "m" } : null;
}
