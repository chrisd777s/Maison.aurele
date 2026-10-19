"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import type { EcrinItem } from "@/lib/shop/store";
import { useShop } from "@/lib/shop/store";

/** « Garder dans mon Écrin » : copie la sélection reçue dans l'Écrin du visiteur. */
export function KeepSelection({ items }: { items: EcrinItem[] }) {
  const t = useTranslations("Ecrin");
  const ecrin = useShop((s) => s.ecrin);
  const hydrated = useShop((s) => s.hydrated);
  const all = hydrated && items.every((i) => ecrin.some((e) => e.slug === i.slug));

  function keep() {
    const missing = items.filter((i) => !ecrin.some((e) => e.slug === i.slug));
    useShop.setState({ ecrin: [...ecrin, ...missing] });
  }

  return (
    <button
      type="button"
      onClick={keep}
      disabled={all}
      className="surtitre inline-flex min-h-12 items-center gap-3 border border-encre/70 px-8 transition-colors duration-[var(--duree-courte)] ease-maison hover:border-encre disabled:border-filet disabled:text-encre-douce"
    >
      <Icon name="ecrin" width={18} height={18} />
      {all ? t("kept") : t("keep")}
    </button>
  );
}
