"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatMoney } from "@/lib/currency";
import { useShop } from "@/lib/shop/store";

/**
 * Prix dans la devise d'affichage choisie. Le rendu serveur est en dollars
 * canadiens ; une devise étrangère est signalée comme indicative.
 */
export function Price({ cad, className = "" }: { cad: number; className?: string }) {
  const locale = useLocale();
  const t = useTranslations("Currency");
  const currency = useShop((s) => s.currency);
  if (currency === "CAD")
    return <span className={className}>{formatMoney(cad, "CAD", locale)}</span>;
  return (
    <span
      className={className}
      title={t("indicativeTitle", { cad: formatMoney(cad, "CAD", locale) })}
    >
      <span aria-hidden="true">≈ </span>
      {formatMoney(cad, currency, locale)}
      <span className="sr-only"> {t("indicativeShort")}</span>
    </span>
  );
}
