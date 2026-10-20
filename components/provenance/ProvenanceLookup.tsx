"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { normalizeCode } from "@/lib/provenance/code";

/**
 * Recherche d'un parcours par le code imprimé sur l'écrin. Sans JS, le formulaire
 * passe par `/api/provenance`, qui redirige vers la page du code.
 */
export function ProvenanceLookup({ codes }: { codes: string[] }) {
  const t = useTranslations("Provenance");
  const locale = useLocale();
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = normalizeCode(input.current?.value ?? "");
    if (!codes.includes(code)) {
      setError(true);
      input.current?.focus();
      return;
    }
    setError(false);
    router.push({ pathname: "/provenance/[code]", params: { code } });
  }

  return (
    <form action="/api/provenance" method="get" onSubmit={submit} noValidate role="search">
      <input type="hidden" name="locale" value={locale} />
      <label htmlFor={id} className="surtitre block text-encre-douce">
        {t("lookupLabel")}
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          ref={input}
          id={id}
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="AU101-0187"
          aria-invalid={error || undefined}
          aria-describedby={`${id}-aide`}
          onChange={() => error && setError(false)}
          className="min-h-12 flex-1 border-b border-encre/60 bg-transparent px-1 font-display text-titre-3 tracking-wider uppercase [font-variant-numeric:lining-nums] placeholder:text-encre-douce/50 focus:border-encre"
        />
        <button
          type="submit"
          className="surtitre min-h-12 bg-encre px-8 text-fond transition-colors duration-[var(--duree-courte)] hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))]"
        >
          {t("lookupSubmit")}
        </button>
      </div>
      <p
        id={`${id}-aide`}
        role={error ? "alert" : undefined}
        className="mt-3 text-petit text-encre-douce"
      >
        {error ? t("lookupUnknown") : t("lookupHint")}
      </p>
    </form>
  );
}
