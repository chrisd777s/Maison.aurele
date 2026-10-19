import type { Locale } from "@/i18n/routing";

/**
 * Créneau lisible : « mardi 21 octobre 2026 à 14 h 00 » / « Tuesday, October 21, 2026 at 2:00 PM ».
 * La date et l'heure sont celles du lieu : formatées telles quelles, sans conversion.
 */
export function formatSlot(date: string, time: string, locale: Locale) {
  const day = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
  return `${day} ${locale === "fr" ? "à" : "at"} ${formatTime(time, locale)}`;
}

export function formatTime(time: string, locale: Locale) {
  if (locale === "fr") return time.replace(":", " h ");
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`2000-01-01T${time}:00Z`));
}

/** Jour court pour le sélecteur : « mar. 21 oct. ». */
export function formatDayShort(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
