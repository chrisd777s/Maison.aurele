import { atelier, routes, type Place } from "@/data/provenance";
import type { Locale } from "@/i18n/routing";
import type { ProductRecord, StoneKind } from "@/lib/commerce/types";

export type Journey = {
  kind: StoneKind;
  central: boolean;
  stops: { stage: "origine" | "taille" | "atelier"; place: Place }[];
};

/**
 * Un parcours par nature de pierre, la pierre centrale d'abord.
 * Les pierres d'accompagnement de même nature que la centrale partagent son parcours.
 */
export function journeysFor(stones: Pick<ProductRecord["stones"][number], "kind" | "role">[]) {
  const ordered = [...stones].sort(
    (a, b) => Number(b.role === "centrale") - Number(a.role === "centrale"),
  );
  const seen = new Set<StoneKind>();
  const journeys: Journey[] = [];
  for (const stone of ordered) {
    if (seen.has(stone.kind)) continue;
    seen.add(stone.kind);
    const route = routes[stone.kind];
    journeys.push({
      kind: stone.kind,
      central: stone.role === "centrale",
      stops: [
        { stage: "origine", place: route.origin },
        { stage: "taille", place: route.cutting },
        { stage: "atelier", place: atelier },
      ],
    });
  }
  return journeys;
}

/* ── Projection de la carte (équirectangulaire, recadrée) ─────── */

export const MAP = { width: 1000, height: 400, lonMin: -140, lonMax: 160, latMin: -45, latMax: 75 };

export function project(lat: number, lon: number) {
  const x = ((lon - MAP.lonMin) / (MAP.lonMax - MAP.lonMin)) * MAP.width;
  const y = ((MAP.latMax - lat) / (MAP.latMax - MAP.latMin)) * MAP.height;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

/** Arc lumineux entre deux points : courbe quadratique bombée vers le nord. */
export function arcPath(a: Place, b: Place) {
  const p = project(a.lat, a.lon);
  const q = project(b.lat, b.lon);
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const length = Math.hypot(dx, dy);
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2 - Math.min(90, length * 0.22);
  return `M${p.x} ${p.y} Q${Math.round(mx)} ${Math.round(my)} ${q.x} ${q.y}`;
}

/** Coordonnées lisibles : « 64,7° N · 110,6° O ». */
export function formatCoordinates(place: Place, locale: Locale) {
  const n = (v: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", { maximumFractionDigits: 1 }).format(
      Math.abs(v),
    );
  const ns = place.lat >= 0 ? "N" : "S";
  const ew = place.lon >= 0 ? "E" : locale === "fr" ? "O" : "W";
  return `${n(place.lat)}° ${ns} · ${n(place.lon)}° ${ew}`;
}
