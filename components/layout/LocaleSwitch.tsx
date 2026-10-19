"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** Bascule FR / EN en conservant la page courante (chemins traduits). */
export function LocaleSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("Locale");
  const current = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <ul className={`flex items-center gap-1 ${className}`} aria-label={t("label")}>
      {routing.locales.map((locale, i) => (
        <li key={locale} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-encre-douce">
              ·
            </span>
          )}
          <Link
            // Les paramètres dynamiques (slug, code…) sont identiques dans les deux langues.
            href={{ pathname, params } as Parameters<typeof Link>[0]["href"]}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            className="surtitre inline-flex min-h-11 min-w-8 items-center justify-center text-encre-douce aria-[current]:text-encre"
          >
            <span aria-hidden="true">{locale.toUpperCase()}</span>
            <span className="sr-only">{t(locale)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
