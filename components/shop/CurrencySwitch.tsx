"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { CURRENCIES } from "@/lib/currency";
import { useShop } from "@/lib/shop/store";

/** Devise d'affichage : CAD (facturée), USD et EUR (indicatives). */
export function CurrencySwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("Currency");
  const currency = useShop((s) => s.currency);
  const setCurrency = useShop((s) => s.setCurrency);
  const name = useId();

  return (
    <fieldset className={className}>
      <legend className="sr-only">{t("label")}</legend>
      <div className="flex items-center gap-1">
        {CURRENCIES.map((code, i) => (
          <span key={code} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden="true" className="text-encre-douce">
                ·
              </span>
            )}
            <label className="surtitre inline-flex min-h-11 min-w-9 cursor-pointer items-center justify-center text-encre-douce has-checked:text-encre has-focus-visible:outline-2 has-focus-visible:outline-accent-encre">
              <input
                type="radio"
                name={name}
                value={code}
                checked={currency === code}
                onChange={() => setCurrency(code)}
                className="sr-only"
              />
              <span aria-hidden="true">{code}</span>
              <span className="sr-only">{t(`names.${code}`)}</span>
            </label>
          </span>
        ))}
      </div>
    </fieldset>
  );
}
