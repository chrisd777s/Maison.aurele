"use client";

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import {
  CARATS,
  DEFAULT_CONFIG,
  ENGRAVING_MAX,
  METALS,
  SETTINGS,
  SHAPES,
  clampCarats,
  encodeConfig,
  sanitizeEngraving,
  type AtelierConfig,
} from "@/lib/atelier/config";
import { priceConfig } from "@/lib/atelier/pricing";
import { configuredProduct } from "@/lib/atelier/product";
import { formatNumber } from "@/lib/format";
import { Price } from "@/components/shop/Price";
import { AtelierViewer } from "./AtelierViewer";
import { EngravingPreview } from "./EngravingPreview";
import { SettingPictogram, ShapePictogram } from "./Pictograms";

const swatch: Record<AtelierConfig["metal"], string> = {
  "or-jaune": "var(--or-jaune)",
  "or-blanc": "var(--or-blanc)",
  "or-rose": "var(--or-rose)",
  platine: "var(--platine)",
};

/** Diamètre approximatif d'un brillant rond, en mm, pour un poids donné. */
const diameterMm = (carats: number) => 6.4 * Math.cbrt(carats);

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-filet pt-6">
      <legend className="surtitre flex items-baseline gap-3 text-encre-douce">
        <span className="chiffres text-chapeau normal-case">0{number}</span>
        {title}
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

/** Carte d'option : radio natif masqué, bordure encre une fois choisi. */
const optionCard =
  "relative flex cursor-pointer flex-col items-center gap-2 border border-filet px-2 py-3 text-center transition-colors duration-[var(--duree-courte)] ease-maison hover:border-encre-douce has-checked:border-encre has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-accent-encre";

export function AtelierConfigurator({ initial }: { initial: AtelierConfig }) {
  const t = useTranslations("Atelier");
  const m = useTranslations("Materials");
  const locale = useLocale();
  const [config, setConfig] = useState(initial);
  const [copied, setCopied] = useState(false);
  const caratsId = useId();
  const engravingId = useId();
  const engravingHintId = useId();

  const price = priceConfig(config);
  const product = useMemo(() => configuredProduct(config, t("summaryTitle")), [config, t]);
  const query = encodeConfig(config).toString();

  function update(patch: Partial<AtelierConfig>) {
    const next = { ...config, ...patch };
    setConfig(next);
    setCopied(false);
    // L'URL reflète la bague à tout instant : elle se partage ou se retrouve telle quelle.
    window.history.replaceState(null, "", `${window.location.pathname}?${encodeConfig(next)}`);
  }

  async function copyLink() {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: t("shareTitle"), url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
    } catch {
      // Partage annulé par l'utilisateur : rien à signaler.
    }
  }

  const summary = t("summaryLine", {
    shape: m(`shapes.${config.shape}`),
    carats: formatNumber(config.carats, locale),
    setting: t(`settings.${config.setting}`).toLocaleLowerCase(locale),
    metal: m(`metals.${config.metal}`).toLocaleLowerCase(locale),
  });

  return (
    <div className="grille gap-y-10">
      {/* Aperçu : collant sur grand écran ; en haut de l'écran sur mobile */}
      <div className="col-span-12 lg:col-span-7">
        <div className="lg:sticky lg:top-[calc(var(--entete)+2rem)]">
          <AtelierViewer
            product={product}
            config={config}
            label={t("viewerLabel")}
            hint={t("viewerHint")}
          />
          <p className="mt-4 font-display text-chapeau italic">{summary}</p>
        </div>
      </div>

      <form className="col-span-12 space-y-10 lg:col-span-5" onSubmit={(e) => e.preventDefault()}>
        <Step number={1} title={t("stepShape")}>
          <div className="grid grid-cols-5 gap-2">
            {SHAPES.map((shape) => (
              <label key={shape} className={optionCard}>
                <input
                  type="radio"
                  name="forme"
                  value={shape}
                  checked={config.shape === shape}
                  onChange={() => update({ shape })}
                  className="sr-only"
                />
                <ShapePictogram shape={shape} className="size-10" />
                <span className="text-[0.75rem] leading-tight">{m(`shapes.${shape}`)}</span>
              </label>
            ))}
          </div>
        </Step>

        <Step number={2} title={t("stepCarats")}>
          <div className="flex items-baseline justify-between">
            <label htmlFor={caratsId} className="text-petit text-encre-douce">
              {t("caratsLabel")}
            </label>
            <output htmlFor={caratsId} className="chiffres text-titre-3 font-light">
              {t("caratsValue", { value: formatNumber(config.carats, locale) })}
            </output>
          </div>
          <input
            id={caratsId}
            type="range"
            min={CARATS.min}
            max={CARATS.max}
            step={CARATS.step}
            value={config.carats}
            onChange={(e) => update({ carats: clampCarats(Number(e.target.value)) })}
            aria-valuetext={t("caratsValue", { value: formatNumber(config.carats, locale) })}
            className="curseur mt-4 w-full"
          />
          <div className="mt-2 flex justify-between text-petit text-encre-douce">
            <span className="chiffres">{formatNumber(CARATS.min, locale)}</span>
            <span>
              {t("caratsHint", { mm: formatNumber(diameterMm(config.carats), locale, 1) })}
            </span>
            <span className="chiffres">{formatNumber(CARATS.max, locale)}</span>
          </div>
        </Step>

        <Step number={3} title={t("stepMetal")}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {METALS.map((metal) => (
              <label key={metal} className={optionCard}>
                <input
                  type="radio"
                  name="metal"
                  value={metal}
                  checked={config.metal === metal}
                  onChange={() => update({ metal })}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className="pastille size-8 rounded-full"
                  style={{ "--pastille": swatch[metal] } as CSSProperties}
                />
                <span className="text-[0.75rem] leading-tight">{m(`metalsShort.${metal}`)}</span>
              </label>
            ))}
          </div>
        </Step>

        <Step number={4} title={t("stepSetting")}>
          <div className="grid grid-cols-3 gap-2">
            {SETTINGS.map((setting) => (
              <label key={setting} className={optionCard}>
                <input
                  type="radio"
                  name="monture"
                  value={setting}
                  checked={config.setting === setting}
                  onChange={() => update({ setting })}
                  aria-describedby={`${setting}-aide`}
                  className="sr-only"
                />
                <SettingPictogram setting={setting} className="size-11" />
                <span className="text-petit">{t(`settings.${setting}`)}</span>
                <span
                  id={`${setting}-aide`}
                  className="text-[0.75rem] leading-snug text-encre-douce"
                >
                  {t(`settingsHint.${setting}`)}
                </span>
              </label>
            ))}
          </div>
        </Step>

        <Step number={5} title={t("stepEngraving")}>
          <label htmlFor={engravingId} className="text-petit text-encre-douce">
            {t("engravingLabel")}
          </label>
          <div className="relative mt-2">
            <input
              id={engravingId}
              type="text"
              value={config.engraving}
              maxLength={ENGRAVING_MAX}
              placeholder={t("engravingPlaceholder")}
              aria-describedby={engravingHintId}
              autoComplete="off"
              onChange={(e) => update({ engraving: sanitizeEngraving(e.target.value) })}
              className="min-h-12 w-full border border-filet bg-transparent px-4 pr-16 font-display text-chapeau italic placeholder:text-encre-douce"
            />
            <span
              className="chiffres absolute top-1/2 right-4 -translate-y-1/2 text-petit text-encre-douce"
              aria-hidden="true"
            >
              {t("engravingCount", { count: config.engraving.length, max: ENGRAVING_MAX })}
            </span>
          </div>
          <p id={engravingHintId} className="mt-2 text-petit text-encre-douce">
            {t("engravingHint")}
          </p>
          <EngravingPreview
            text={config.engraving || t("engravingPlaceholder")}
            label={t("engravingPreview")}
          />
        </Step>

        {/* Récapitulatif chiffré */}
        <section aria-labelledby="recapitulatif" className="border-t border-encre pt-6">
          <h2 id="recapitulatif" className="surtitre font-sans text-encre-douce">
            {t("summaryTitle")}
          </h2>
          <dl className="mt-4 text-petit">
            {(
              [
                [t("summaryStone"), <Price key="pierre" cad={price.stone} />],
                [t("summarySetting"), <Price key="monture" cad={price.setting} />],
                [
                  t("summaryMetal"),
                  price.metal > 0 ? <Price key="metal" cad={price.metal} /> : t("included"),
                ],
                [t("summaryEngraving"), t("offered")],
              ] satisfies [string, ReactNode][]
            ).map(([term, value]) => (
              <div key={term} className="flex justify-between border-b border-filet py-2">
                <dt className="text-encre-douce">{term}</dt>
                <dd className="chiffres">{value}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between pt-4">
              <dt className="surtitre">{t("total")}</dt>
              <dd
                className="chiffres text-titre-3 font-light"
                aria-live="polite"
                data-testid="prix-atelier"
              >
                <Price cad={price.total} />
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-petit text-encre-douce">{t("quality")}</p>
          <p className="mt-1 text-petit text-encre-douce">{t("lead")}</p>

          <div className="mt-8 flex flex-col gap-4">
            <Link
              href={{ pathname: "/rendez-vous", query: { creation: query } }}
              className="surtitre inline-flex min-h-12 items-center justify-center bg-encre px-8 text-fond transition-colors duration-[var(--duree-courte)] ease-maison hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))]"
            >
              {t("cta")}
            </Link>
            <p className="text-petit text-encre-douce">{t("ctaHint")}</p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={copyLink}
                className="surtitre lien-fin inline-flex min-h-11 items-center gap-2"
              >
                <Icon name="arrow" width={14} height={14} />
                {t("copyLink")}
              </button>
              <button
                type="button"
                onClick={() => update(DEFAULT_CONFIG)}
                className="surtitre lien-fin min-h-11 text-encre-douce"
              >
                {t("reset")}
              </button>
            </div>
            <p
              role="status"
              data-testid="copie-statut"
              className="min-h-6 text-petit text-accent-encre"
            >
              {copied ? t("copied") : ""}
            </p>
          </div>
        </section>
      </form>
    </div>
  );
}
