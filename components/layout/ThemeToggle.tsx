"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

type Theme = "jour" | "nuit";
const STORAGE_KEY = "aurele-theme";
const EVENT = "aurele-theme";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "jour" || set === "nuit") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "nuit" : "jour";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/** Bascule « Salon de jour » / « Salon de nuit », mémorisée dans le navigateur. */
export function ThemeToggle() {
  const t = useTranslations("Theme");
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "jour" as Theme);
  const next: Theme = theme === "nuit" ? "jour" : "nuit";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour la session.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "nuit"}
      className="group inline-flex min-h-11 items-center gap-3 text-petit text-encre"
    >
      <span
        aria-hidden="true"
        className="relative inline-block h-3.5 w-7 rounded-full border border-encre-douce"
      >
        <span className="absolute top-1/2 left-[3px] size-2 -translate-y-1/2 rounded-full bg-accent transition-transform duration-[var(--duree)] ease-maison group-aria-pressed:translate-x-[12px]" />
      </span>
      {t("nuit")}
    </button>
  );
}
