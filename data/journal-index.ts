import type { Localized } from "@/lib/commerce/types";

/**
 * Index du Journal, sans le corps des articles : le proxy le lit pour valider
 * les slugs sans embarquer les textes.
 */
export type ArticleCover = "soin" | "diamant" | "perle";

export type ArticleMeta = {
  slug: string;
  /** Date de parution (AAAA-MM-JJ). */
  date: string;
  cover: ArticleCover;
  rubric: Localized;
  title: Localized;
  dek: Localized;
  author: { name: string; role: Localized };
  /** Pièces citées en fin d'article. */
  related: string[];
};

export const articleIndex: ArticleMeta[] = [
  {
    slug: "histoire-de-la-perle",
    date: "2026-09-15",
    cover: "perle",
    rubric: { fr: "Histoire", en: "History" },
    title: { fr: "La perle, ou l’art de la patience", en: "The pearl, or the art of patience" },
    dek: {
      fr: "Des bancs du golfe Persique aux baies abritées du Japon, la perle a toujours exigé du temps. Récit d’une gemme que l’on ne taille pas.",
      en: "From the banks of the Persian Gulf to the sheltered bays of Japan, the pearl has always demanded time. The story of a gem that is never cut.",
    },
    author: {
      name: "Yara Haddad",
      role: { fr: "Sertisseuse et enfileuse de perles", en: "Setter and pearl stringer" },
    },
    related: ["maree-ecume", "maree-reflet", "maree-ressac"],
  },
  {
    slug: "choisir-un-diamant",
    date: "2026-06-02",
    cover: "diamant",
    rubric: { fr: "Conseil", en: "Advice" },
    title: { fr: "Choisir un diamant, au-delà des 4C", en: "Choosing a diamond, beyond the 4Cs" },
    dek: {
      fr: "Taille, couleur, pureté, carat : quatre lettres que tout le monde cite et que peu savent hiérarchiser. Ce que nous regardons d’abord, et pourquoi.",
      en: "Cut, colour, clarity, carat: four letters everyone quotes and few know how to rank. What we look at first, and why.",
    },
    author: { name: "Hélène Aurèle", role: { fr: "Fondatrice", en: "Founder" } },
    related: ["aube-premiere", "aube-trilogie", "obsidienne-absolue"],
  },
  {
    slug: "prendre-soin-de-ses-bijoux",
    date: "2026-03-12",
    cover: "soin",
    rubric: { fr: "Entretien", en: "Care" },
    title: { fr: "Prendre soin de ses bijoux", en: "Caring for your jewellery" },
    dek: {
      fr: "Un diamant ne s’use pas, mais il se ternit ; une perle craint le parfum ; l’or noir demande à être ravivé. Gestes simples pour une lumière intacte.",
      en: "A diamond does not wear, but it dulls; a pearl fears perfume; black gold asks to be revived. Simple habits to keep the light intact.",
    },
    author: { name: "Anouk Pelletier", role: { fr: "Polisseuse", en: "Polisher" } },
    related: ["aube-filament", "maree-goutte", "obsidienne-nuit"],
  },
];
