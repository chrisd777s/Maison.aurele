"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import {
  CARD_HEIGHT_MM,
  CARD_WIDTH_MM,
  DEFAULT_PX_PER_MM,
  circumferenceFromDiameter,
  diameterFromUs,
  formatUs,
  frFromUs,
  isOutOfRange,
  ukFromUs,
  usFromDiameter,
} from "@/lib/sizing/ring";

const STORAGE_KEY = "aurele-calibrage";
const PPM_MIN = 2.5;
const PPM_MAX = 9;
const DIAMETER_MIN = 13.5;
const PORTRAIT_BELOW_PPM = 5.5;
const DIAMETER_MAX = 23;

/** Calibrage mémorisé pour ce navigateur et cet écran (null s'il n'y en a pas). */
function readCalibration() {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEY));
    return value >= PPM_MIN && value <= PPM_MAX ? value : null;
  } catch {
    return null;
  }
}

function subscribeCalibration(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Réglage fin : un curseur et deux boutons « moins / plus ». */
function Adjuster({
  id,
  label,
  value,
  min,
  max,
  step,
  valueText,
  onChange,
  decreaseLabel,
  increaseLabel,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueText: string;
  onChange: (v: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  const button =
    "grid size-11 shrink-0 place-items-center border border-filet font-display text-titre-3 leading-none hover:border-encre";
  return (
    <div>
      <label htmlFor={id} className="surtitre text-encre-douce">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          className={button}
          aria-label={decreaseLabel}
          onClick={() => onChange(clamp(value - step))}
        >
          −
        </button>
        <input
          id={id}
          type="range"
          className="curseur min-w-0 flex-1"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={valueText}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <button
          type="button"
          className={button}
          aria-label={increaseLabel}
          onClick={() => onChange(clamp(value + step))}
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Guide des tailles à l'écran : 1) on calibre l'écran avec une carte bancaire
 * (format ID-1, identique partout), 2) on ajuste un cercle à l'intérieur d'une bague.
 */
export function RingSizer({ email }: { email: string }) {
  const t = useTranslations("SizeGuide");
  const locale = useLocale();
  const id = useId();
  const frame = useRef<HTMLDivElement>(null);
  const stored = useSyncExternalStore(subscribeCalibration, readCalibration, () => null);
  // Choix de l'utilisateur pendant la visite ; à défaut, le calibrage mémorisé.
  const [chosenStep, setStep] = useState<"carte" | "bague" | null>(null);
  const [draftPpm, setPpm] = useState<number | null>(null);
  const [savedNow, setSaved] = useState(false);
  const [diameter, setDiameter] = useState(diameterFromUs(6));
  const [frameWidth, setFrameWidth] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = chosenStep ?? (stored ? "bague" : "carte");
  const ppm = draftPpm ?? stored ?? DEFAULT_PX_PER_MM;
  const saved = savedNow || stored !== null;

  // Largeur disponible : la carte passe en portrait si elle ne tient pas couchée.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setFrameWidth(entry!.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  function go(next: "carte" | "bague") {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }

  function confirmCard() {
    try {
      localStorage.setItem(STORAGE_KEY, String(ppm));
    } catch {
      /* stockage indisponible : le calibrage vaut pour cette visite */
    }
    setSaved(true);
    go("bague");
  }

  const n = (v: number, digits = 1) => formatNumber(v, locale, digits);
  // Écran étroit (téléphone, ~6 px/mm) : la carte est d'emblée en portrait, pour
  // ne pas basculer en cours de réglage.
  const portrait = frameWidth > 0 && frameWidth < CARD_WIDTH_MM * PORTRAIT_BELOW_PPM;
  const cardW = (portrait ? CARD_HEIGHT_MM : CARD_WIDTH_MM) * ppm;
  const cardH = (portrait ? CARD_WIDTH_MM : CARD_HEIGHT_MM) * ppm;
  const us = usFromDiameter(diameter);
  const outOfRange = isOutOfRange(diameter);
  const circumference = circumferenceFromDiameter(diameter);
  const mailto = `mailto:${email}?subject=${encodeURIComponent(t("sizerSubject"))}`;

  return (
    <div className="border-y border-filet py-10">
      <ol className="surtitre flex gap-6 text-encre-douce" aria-label={t("stepsLabel")}>
        {(["carte", "bague"] as const).map((s, i) => (
          <li
            key={s}
            aria-current={step === s ? "step" : undefined}
            className={step === s ? "text-encre" : ""}
          >
            <span className="chiffres mr-2 text-chapeau normal-case">0{i + 1}</span>
            {t(`steps.${s}`)}
          </li>
        ))}
      </ol>

      {step === "carte" ? (
        <div className="mt-8">
          <h3 ref={heading} tabIndex={-1} className="text-titre-3 outline-none">
            {t("cardTitle")}
          </h3>
          <p className="mt-4 max-w-[56ch] text-encre-douce">
            {t(portrait ? "cardTextPortrait" : "cardText")}
          </p>
          <div
            ref={frame}
            className="mt-8 flex min-h-40 items-start justify-center overflow-hidden"
          >
            <div
              data-testid="carte-calibrage"
              aria-hidden="true"
              className="carte-calibrage relative shrink-0"
              style={{ width: cardW, height: cardH, borderRadius: 3.18 * ppm }}
            >
              <span
                className="absolute rounded-[2px] bg-accent/50"
                style={
                  portrait
                    ? { top: 9 * ppm, right: 15 * ppm, width: 9 * ppm, height: 12 * ppm }
                    : { left: 9 * ppm, top: 15 * ppm, width: 12 * ppm, height: 9 * ppm }
                }
              />
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-xl">
            <Adjuster
              id={`${id}-carte`}
              label={t("cardAdjust")}
              value={ppm}
              min={PPM_MIN}
              max={PPM_MAX}
              step={0.01}
              valueText={t("cardValue", {
                mm: n(CARD_WIDTH_MM),
                px: Math.round(CARD_WIDTH_MM * ppm),
              })}
              onChange={setPpm}
              decreaseLabel={t("smaller")}
              increaseLabel={t("larger")}
            />
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={confirmCard}
                className="surtitre min-h-11 bg-encre px-8 py-4 text-fond hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))]"
              >
                {t("cardConfirm")}
              </button>
              {saved && (
                <button
                  type="button"
                  onClick={() => {
                    if (stored) setPpm(null);
                    go("bague");
                  }}
                  className="surtitre lien-fin"
                >
                  {t("cardKeep")}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 ref={heading} tabIndex={-1} className="text-titre-3 outline-none">
              {t("ringTitle")}
            </h3>
            <p className="mt-4 max-w-[52ch] text-encre-douce">{t("ringText")}</p>
            <div
              ref={frame}
              className="mt-8 grid place-items-center"
              style={{ minHeight: DIAMETER_MAX * ppm + 32 }}
            >
              <div
                data-testid="cercle-bague"
                aria-hidden="true"
                className="cercle-bague rounded-full"
                style={{ width: diameter * ppm, height: diameter * ppm }}
              />
            </div>
            <Adjuster
              id={`${id}-bague`}
              label={t("ringAdjust")}
              value={diameter}
              min={DIAMETER_MIN}
              max={DIAMETER_MAX}
              step={0.1}
              valueText={t("ringValue", { mm: n(diameter) })}
              onChange={setDiameter}
              decreaseLabel={t("smaller")}
              increaseLabel={t("larger")}
            />
            <button type="button" onClick={() => go("carte")} className="surtitre lien-fin mt-6">
              {t("recalibrate")}
            </button>
          </div>

          <div aria-live="polite" className="lg:border-l lg:border-filet lg:pl-gouttiere">
            <p className="surtitre text-encre-douce">{t("resultTitle")}</p>
            {outOfRange ? (
              <p className="mt-4 font-display text-titre-3">{t("outOfRange")}</p>
            ) : (
              <>
                <p className="mt-4 flex items-baseline gap-4" data-testid="taille-resultat">
                  <span className="chiffres text-titre-1 font-light">{formatUs(us)}</span>
                  <span className="surtitre text-encre-douce">{t("systemCaUs")}</span>
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-petit sm:grid-cols-4 lg:grid-cols-2">
                  <div>
                    <dt className="text-encre-douce">{t("systemFr")}</dt>
                    <dd className="chiffres text-chapeau">{frFromUs(us)}</dd>
                  </div>
                  <div>
                    <dt className="text-encre-douce">{t("systemUk")}</dt>
                    <dd className="chiffres text-chapeau">{ukFromUs(us)}</dd>
                  </div>
                  <div>
                    <dt className="text-encre-douce">{t("diameter")}</dt>
                    <dd className="chiffres text-chapeau">{t("mm", { value: n(diameter) })}</dd>
                  </div>
                  <div>
                    <dt className="text-encre-douce">{t("circumference")}</dt>
                    <dd className="chiffres text-chapeau">
                      {t("mm", { value: n(circumference) })}
                    </dd>
                  </div>
                </dl>
              </>
            )}
            <p className="mt-8 max-w-[44ch] text-petit text-encre-douce">{t("accuracy")}</p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <a href={mailto} className="surtitre lien-fin">
                {t("sizerCta")}
              </a>
              <Link
                href={{ pathname: "/collections/[collection]", params: { collection: "aube" } }}
                className="surtitre lien-fin"
              >
                {t("ringsCta")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
