import { arcPath, MAP, project, type Journey } from "@/lib/provenance/journey";

/**
 * Carte du parcours, à la manière d'une carte céleste : un canevas de méridiens et
 * de parallèles, des points lumineux, des arcs qui se dessinent à l'apparition.
 * Pas de tracé des côtes : la carte situe, la légende nomme.
 */

const GRID_STEP = 15;

/** Cadre recentré sur les points (avec une marge), au rapport 5:2 de la carte. */
function viewBox(journeys: Journey[]) {
  const points = journeys.flatMap((j) => j.stops.map((s) => project(s.place.lat, s.place.lon)));
  const pad = 70;
  let x0 = Math.min(...points.map((p) => p.x)) - pad;
  let x1 = Math.max(...points.map((p) => p.x)) + pad;
  let y0 = Math.min(...points.map((p) => p.y)) - pad * 1.6;
  let y1 = Math.max(...points.map((p) => p.y)) + pad;
  const ratio = MAP.width / MAP.height;
  // Élargit le côté trop court pour garder le rapport, sans sortir de la carte.
  if ((x1 - x0) / (y1 - y0) < ratio) {
    const w = (y1 - y0) * ratio;
    const cx = (x0 + x1) / 2;
    x0 = cx - w / 2;
    x1 = cx + w / 2;
  } else {
    const h = (x1 - x0) / ratio;
    const cy = (y0 + y1) / 2;
    y0 = cy - h / 2;
    y1 = cy + h / 2;
  }
  const w = Math.min(MAP.width, x1 - x0);
  const h = w / ratio;
  x0 = Math.max(0, Math.min(MAP.width - w, x0));
  y0 = Math.max(0, Math.min(MAP.height - h, y0));
  return { x: x0, y: y0, w, h };
}

/** Points d'un même parcours trop proches pour être distingués : un seul repère. */
function markers(journey: Journey, minDistance: number) {
  const out: { x: number; y: number; numbers: number[] }[] = [];
  journey.stops.forEach((stop, i) => {
    const p = project(stop.place.lat, stop.place.lon);
    const near = out.find((m) => Math.hypot(m.x - p.x, m.y - p.y) < minDistance);
    if (near) near.numbers.push(i + 1);
    else out.push({ ...p, numbers: [i + 1] });
  });
  return out;
}

export function JourneyMap({ journeys, label }: { journeys: Journey[]; label: string }) {
  const box = viewBox(journeys);
  const k = box.w / MAP.width; // échelle : tailles constantes à l'écran
  const central = journeys.find((j) => j.central) ?? journeys[0]!;
  const others = journeys.filter((j) => j !== central);

  const meridians: number[] = [];
  for (let lon = MAP.lonMin; lon <= MAP.lonMax; lon += GRID_STEP) meridians.push(lon);
  const parallels: number[] = [];
  for (let lat = -45; lat <= MAP.latMax; lat += GRID_STEP) parallels.push(lat);

  return (
    <figure className="carte" data-reveal>
      <svg
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        role="img"
        aria-label={label}
        className="block h-auto w-full"
      >
        <g fill="none" stroke="var(--filet)" strokeWidth={k} opacity="0.6">
          {meridians.map((lon) => {
            const x = project(0, lon).x;
            return <path key={`m${lon}`} d={`M${x} 0V${MAP.height}`} />;
          })}
          {parallels.map((lat) => {
            const y = project(lat, 0).y;
            return (
              <path
                key={`p${lat}`}
                d={`M0 ${y}H${MAP.width}`}
                strokeWidth={lat === 0 ? 2 * k : k}
              />
            );
          })}
        </g>

        {others.map((j) => (
          <g key={j.kind}>
            {j.stops.slice(1).map((stop, i) => (
              <path
                key={stop.stage}
                d={arcPath(j.stops[i]!.place, stop.place)}
                fill="none"
                stroke="var(--encre-douce)"
                strokeWidth={1.2 * k}
                strokeDasharray={`${4 * k} ${4 * k}`}
              />
            ))}
            {j.stops.map((stop) => {
              const p = project(stop.place.lat, stop.place.lon);
              return (
                <circle key={stop.stage} cx={p.x} cy={p.y} r={4 * k} fill="var(--encre-douce)" />
              );
            })}
          </g>
        ))}

        {central.stops.slice(1).map((stop, i) => (
          <path
            key={stop.stage}
            data-arc=""
            pathLength={1}
            d={arcPath(central.stops[i]!.place, stop.place)}
            fill="none"
            stroke="var(--accent-encre)"
            strokeWidth={2 * k}
            strokeLinecap="round"
            style={{ transitionDelay: `${i * 700}ms` }}
          />
        ))}
        {markers(central, 30 * k).map((m) => (
          <g key={m.numbers.join("-")}>
            <circle cx={m.x} cy={m.y} r={28 * k} fill="var(--accent)" opacity="0.22" />
            <circle
              cx={m.x}
              cy={m.y}
              r={16 * k}
              fill="var(--fond)"
              stroke="var(--accent-encre)"
              strokeWidth={1.5 * k}
            />
            <text
              x={m.x}
              y={m.y}
              dy="0.35em"
              textAnchor="middle"
              fontSize={(m.numbers.length > 1 ? 12 : 17) * k}
              fill="var(--encre)"
              className="chiffres max-sm:hidden"
            >
              {m.numbers.join("·")}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
