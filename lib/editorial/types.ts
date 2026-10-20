import type { Locale } from "@/i18n/routing";

/**
 * Bloc de texte éditorial (Journal, pages légales). Les textes longs vivent dans
 * `data/` et non dans `messages/` : ils ne sont lus que côté serveur et ne
 * gonflent pas les traductions envoyées au navigateur.
 */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "quote"; text: string; cite?: string }
  | { kind: "list"; items: string[] };

export type Body = Record<Locale, Block[]>;

/** Identifiant d'ancre stable à partir d'un intertitre. */
export function anchorId(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Temps de lecture en minutes (230 mots par minute, au moins une). */
export function readingMinutes(blocks: Block[]) {
  const words = blocks
    .flatMap((b) => (b.kind === "list" ? b.items : [b.text]))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
