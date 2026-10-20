import type { ArticleCover } from "@/data/journal-index";

/**
 * Couvertures du Journal : compositions vectorielles sobres, dans l'esprit des
 * planches d'atelier, en attendant les photographies.
 */

function Perle({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-nacre`} cx="0.38" cy="0.34" r="0.7">
          <stop offset="0" stopColor="var(--diamant)" />
          <stop offset="0.45" stopColor="var(--perle)" />
          <stop offset="0.85" stopColor="var(--perle-lustre)" />
          <stop
            offset="1"
            stopColor="color-mix(in oklab, var(--perle-lustre) 80%, var(--pierre))"
          />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <ellipse
          key={i}
          cx="400"
          cy="392"
          rx={150 + i * 70}
          ry={22 + i * 10}
          fill="none"
          stroke="var(--encre-douce)"
          strokeWidth="1"
          opacity={0.5 - i * 0.1}
        />
      ))}
      <circle cx="400" cy="250" r="128" fill={`url(#${id}-nacre)`} />
      <ellipse
        cx="358"
        cy="204"
        rx="34"
        ry="20"
        fill="var(--diamant)"
        opacity="0.85"
        transform="rotate(-30 358 204)"
      />
    </>
  );
}

function Diamant() {
  return (
    <>
      <g stroke="var(--champagne)" strokeWidth="1.2" opacity="0.7">
        <path d="M120 40 340 236" />
        <path d="M200 20 372 222" />
        <path d="M456 300 700 440" />
        <path d="M430 318 620 480" />
      </g>
      <g fill="none" stroke="var(--encre)" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M250 220 312 160h176l62 60-150 160Z" fill="var(--diamant)" />
        <path d="M250 220h300" />
        <path d="M312 160l38 60 50-60 50 60 38-60" />
        <path d="M290 220l110 160 110-160M350 220l50 160 50-160" strokeWidth="0.9" />
      </g>
      <path d="M330 176h40" stroke="var(--diamant-reflet)" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function Soin({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-or`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="color-mix(in oklab, var(--or-jaune) 50%, var(--diamant))" />
          <stop offset="0.5" stopColor="var(--or-jaune)" />
          <stop offset="1" stopColor="color-mix(in oklab, var(--or-jaune) 65%, var(--onyx))" />
        </linearGradient>
      </defs>
      {/* Coupelle d'eau tiède */}
      <ellipse
        cx="400"
        cy="300"
        rx="270"
        ry="92"
        fill="color-mix(in oklab, var(--diamant-reflet) 40%, transparent)"
      />
      <ellipse
        cx="400"
        cy="300"
        rx="270"
        ry="92"
        fill="none"
        stroke="var(--encre-douce)"
        strokeWidth="1.2"
      />
      <path
        d="M130 300c0 90 120 150 270 150s270-60 270-150"
        fill="none"
        stroke="var(--encre-douce)"
        strokeWidth="1.2"
      />
      {/* Anneau couché */}
      <path
        d="M290 300a110 40 0 1 0 220 0a110 40 0 1 0-220 0ZM312 300a88 28 0 1 0 176 0a88 28 0 1 0-176 0Z"
        fill={`url(#${id}-or)`}
        fillRule="evenodd"
      />
      <path
        d="M390 262 400 244l10 18-10 8Z"
        fill="var(--diamant)"
        stroke="var(--encre-douce)"
        strokeWidth="0.8"
      />
      {[
        [470, 230, 7],
        [500, 196, 5],
        [452, 170, 4],
        [330, 214, 5],
        [520, 254, 3],
      ].map(([x, y, r]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={r}
          fill="none"
          stroke="var(--encre-douce)"
          strokeWidth="1"
        />
      ))}
    </>
  );
}

export function JournalCover({
  cover,
  className = "",
}: {
  cover: ArticleCover;
  className?: string;
}) {
  const id = `couverture-${cover}`;
  return (
    <svg
      viewBox="0 0 800 500"
      className={`journal-couverture block h-auto w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="800" height="500" fill="var(--surface)" />
      {cover === "perle" ? <Perle id={id} /> : cover === "diamant" ? <Diamant /> : <Soin id={id} />}
    </svg>
  );
}
