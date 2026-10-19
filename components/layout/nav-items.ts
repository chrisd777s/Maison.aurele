import type { ComponentProps } from "react";
import type { Messages } from "next-intl";
import type { Link } from "@/i18n/navigation";

export type Href = ComponentProps<typeof Link>["href"];

type NavKey = keyof Messages["Nav"];

export type NavItem = {
  key: NavKey;
  href: Href;
};

export const collectionItems: NavItem[] = [
  { key: "aube", href: { pathname: "/collections/[collection]", params: { collection: "aube" } } },
  {
    key: "maree",
    href: { pathname: "/collections/[collection]", params: { collection: "maree" } },
  },
  {
    key: "obsidienne",
    href: { pathname: "/collections/[collection]", params: { collection: "obsidienne" } },
  },
];

/** Navigation principale (gauche sur grand écran). */
export const primaryItems: NavItem[] = [
  {
    key: "collections",
    href: { pathname: "/collections/[collection]", params: { collection: "aube" } },
  },
  { key: "atelier", href: "/atelier" },
  { key: "savoirFaire", href: "/savoir-faire" },
];

/** Entrées supplémentaires du menu plein écran. */
export const secondaryItems: NavItem[] = [
  { key: "maison", href: "/la-maison" },
  { key: "provenance", href: "/provenance" },
  { key: "journal", href: "/journal" },
  { key: "guide", href: "/guide-des-tailles" },
  { key: "ecrin", href: "/ecrin" },
];
