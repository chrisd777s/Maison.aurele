import type { ReactNode } from "react";
import { NextIntlClientProvider, type Messages } from "next-intl";
import { getMessages } from "next-intl/server";

type Namespace = keyof Messages;

/** Espaces de noms lus par les composants clients du gabarit (en-tête, panier). */
export const LAYOUT_NAMESPACES = [
  "Locale",
  "Theme",
  "Nav",
  "Cart",
  "Materials",
  "Currency",
] as const satisfies Namespace[];

/**
 * Ne transmet au navigateur que les messages dont ses composants clients ont
 * besoin : ceux du gabarit, plus ceux de la page. Sans cela, tout `messages/`
 * (≈ 34 Ko, courriels compris) partirait dans chaque page.
 * Un fournisseur imbriqué remplace celui du gabarit : il doit donc tout reprendre.
 */
export async function ClientMessages({
  namespaces = [],
  children,
}: {
  namespaces?: Namespace[];
  children: ReactNode;
}) {
  const all = await getMessages();
  const keep = new Set<Namespace>([...LAYOUT_NAMESPACES, ...namespaces]);
  const messages = Object.fromEntries(
    Object.entries(all).filter(([key]) => keep.has(key as Namespace)),
  );
  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
