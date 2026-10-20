import type { ReactNode } from "react";
import type { CraftStepId } from "@/data/house";

/**
 * Une même bague solitaire aux six étapes de sa création, du croquis au polissage.
 * Chaque étape est un calque `[data-etape]` : la séquence du Savoir-faire les
 * superpose et les fait se succéder au défilement ; ailleurs, un seul est affiché.
 */

const BAND =
  "M82 330a118 128 0 1 0 236 0a118 128 0 1 0-236 0ZM102 330a98 108 0 1 0 196 0a98 108 0 1 0-196 0Z";
const STONE = "M152 168 172 146h56l20 22-48 38Z";
const CROWN = "M172 146l16 22 12-22 12 22 16-22";
const PAVILION = "M176 168l24 38 24-38M188 168l12 38 12-38";
const BASKET = "M186 203l-4-20h36l-4 20";
const PRONGS = "M187 201c-6-12-14-24-20-38M213 201c6-12 14-24 20-38";
const SEAT = "M156 172h88";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-or`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="color-mix(in oklab, var(--or-jaune) 50%, var(--diamant))" />
        <stop offset="0.5" stopColor="var(--or-jaune)" />
        <stop offset="1" stopColor="color-mix(in oklab, var(--or-jaune) 68%, var(--onyx))" />
      </linearGradient>
      <linearGradient id={`${id}-brut`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="color-mix(in oklab, var(--or-jaune) 80%, var(--pierre))" />
        <stop offset="1" stopColor="color-mix(in oklab, var(--or-jaune) 55%, var(--onyx))" />
      </linearGradient>
      <linearGradient id={`${id}-cire`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="color-mix(in oklab, var(--cire) 70%, var(--diamant))" />
        <stop offset="1" stopColor="color-mix(in oklab, var(--cire) 80%, var(--onyx))" />
      </linearGradient>
      <linearGradient id={`${id}-pierre`} x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="var(--diamant)" />
        <stop offset="0.55" stopColor="var(--diamant-reflet)" />
        <stop offset="1" stopColor="var(--diamant)" />
      </linearGradient>
      <radialGradient id={`${id}-braise`} cx="0.5" cy="0.62" r="0.5">
        <stop offset="0" stopColor="var(--champagne)" stopOpacity="0.55" />
        <stop offset="1" stopColor="var(--champagne)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-eclat`} cx="0.5" cy="0.34" r="0.5">
        <stop offset="0" stopColor="var(--champagne)" stopOpacity="0.32" />
        <stop offset="1" stopColor="var(--champagne)" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** Éclat à quatre branches. */
function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  const k = r * 0.18;
  return (
    <path
      data-eclat=""
      d={`M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`}
      fill="var(--diamant)"
      stroke="var(--champagne)"
      strokeWidth="0.6"
    />
  );
}

function Croquis() {
  const line = {
    fill: "none",
    stroke: "var(--encre-douce)",
    strokeLinecap: "round" as const,
    pathLength: 1,
    "data-trait": "",
  };
  return (
    <>
      {/* Constructions : axe, rondiste, course de la lumière */}
      <g fill="none" stroke="var(--encre-douce)" opacity="0.7">
        <path d="M200 112V472" strokeWidth="0.6" strokeDasharray="4 3" />
        <path d="M120 168H280" strokeWidth="0.6" strokeDasharray="4 3" />
        <path d="M64 66 156 150" strokeWidth="0.8" strokeDasharray="6 4" />
        <path d="M146 146l10 4-4-10" strokeWidth="0.8" />
      </g>
      {/* Anneau en double trait, comme à main levée */}
      <path {...line} d={BAND} strokeWidth="1" />
      <path {...line} d="M84 333a117 126 0 1 0 234-4" strokeWidth="0.6" opacity="0.6" />
      <path {...line} d={BASKET} strokeWidth="1" />
      <path {...line} d={PRONGS} strokeWidth="1" />
      <path {...line} d={STONE} strokeWidth="1.1" />
      <path {...line} d={CROWN} strokeWidth="0.7" />
      <path {...line} d={PAVILION} strokeWidth="0.7" />
    </>
  );
}

function Gouache({ id }: { id: string }) {
  return (
    <>
      <rect
        x="40"
        y="96"
        width="320"
        height="388"
        rx="2"
        fill="color-mix(in oklab, var(--surface) 70%, var(--pierre))"
        opacity="0.5"
      />
      <path d={BAND} fill={`url(#${id}-or)`} fillRule="evenodd" />
      <path
        d="M96 300c6-46 40-84 82-94"
        fill="none"
        stroke="var(--diamant)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M300 372c-10 40-40 70-74 80"
        fill="none"
        stroke="color-mix(in oklab, var(--or-jaune) 55%, var(--onyx))"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path d={BASKET} fill={`url(#${id}-or)`} />
      <path
        d={PRONGS}
        fill="none"
        stroke={`url(#${id}-or)`}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d={STONE} fill={`url(#${id}-pierre)`} />
      <path
        d={`${CROWN}${PAVILION}`}
        fill="none"
        stroke="var(--diamant-reflet)"
        strokeWidth="1.2"
      />
      <path d="M178 152h14" stroke="var(--diamant)" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function Cire({ id }: { id: string }) {
  return (
    <>
      <path d={BAND} fill={`url(#${id}-cire)`} fillRule="evenodd" />
      <path d={BASKET} fill={`url(#${id}-cire)`} />
      <path
        d="M187 201c-6-12-14-24-20-38M213 201c6-12 14-24 20-38"
        fill="none"
        stroke={`url(#${id}-cire)`}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Assise vide : la pierre viendra plus tard */}
      <path d={SEAT} stroke="color-mix(in oklab, var(--cire) 80%, var(--onyx))" strokeWidth="1" />
      <path
        d="M98 312c6-40 34-74 70-88"
        fill="none"
        stroke="var(--diamant)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </>
  );
}

function Fonte({ id }: { id: string }) {
  return (
    <>
      <ellipse data-braise="" cx="200" cy="340" rx="158" ry="156" fill={`url(#${id}-braise)`} />
      {/* Arbre de coulée : la tige par où l'or est entré */}
      <path d="M194 458h12v30h-12Z" fill={`url(#${id}-brut)`} />
      <path d={BAND} fill={`url(#${id}-brut)`} fillRule="evenodd" />
      <path d={BASKET} fill={`url(#${id}-brut)`} />
      <path
        d="M187 201c-6-12-14-24-20-38M213 201c6-12 14-24 20-38"
        fill="none"
        stroke={`url(#${id}-brut)`}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </>
  );
}

function Sertissage({ id }: { id: string }) {
  return (
    <>
      <path d={BAND} fill={`url(#${id}-or)`} fillRule="evenodd" />
      <path d={BASKET} fill={`url(#${id}-or)`} />
      <g data-pose="">
        <path d={STONE} fill={`url(#${id}-pierre)`} />
        <path
          d={`${CROWN}${PAVILION}`}
          fill="none"
          stroke="var(--diamant-reflet)"
          strokeWidth="1"
        />
      </g>
      <path
        d={PRONGS}
        fill="none"
        stroke={`url(#${id}-or)`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Échoppe du sertisseur */}
      <path d="M314 88 240 152" stroke="var(--encre-douce)" strokeWidth="3" strokeLinecap="round" />
      <path d="M336 68l-22 20" stroke="var(--encre-douce)" strokeWidth="9" strokeLinecap="round" />
    </>
  );
}

function Polissage({ id }: { id: string }) {
  return (
    <>
      <ellipse cx="200" cy="250" rx="158" ry="200" fill={`url(#${id}-eclat)`} />
      <path d={BAND} fill={`url(#${id}-or)`} fillRule="evenodd" />
      <path
        d="M96 300c6-46 40-84 82-94"
        fill="none"
        stroke="var(--diamant)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path d={BASKET} fill={`url(#${id}-or)`} />
      <path
        d={PRONGS}
        fill="none"
        stroke={`url(#${id}-or)`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d={STONE} fill={`url(#${id}-pierre)`} />
      <path d={`${CROWN}${PAVILION}`} fill="none" stroke="var(--diamant-reflet)" strokeWidth="1" />
      <Sparkle x={172} y={146} r={14} />
      <Sparkle x={246} y={130} r={9} />
      <Sparkle x={112} y={262} r={7} />
    </>
  );
}

const LAYERS: Record<CraftStepId, (props: { id: string }) => ReactNode> = {
  croquis: Croquis,
  gouache: Gouache,
  cire: Cire,
  fonte: Fonte,
  sertissage: Sertissage,
  polissage: Polissage,
};

type Props = {
  /** Préfixe des dégradés (unique dans la page). */
  id: string;
  /** Étapes dessinées, superposées dans cet ordre. */
  steps: CraftStepId[];
  className?: string;
};

export function CraftArt({ id, steps, className = "" }: Props) {
  return (
    <svg viewBox="40 40 320 460" className={className} aria-hidden="true" focusable="false">
      <Defs id={id} />
      {steps.map((step) => {
        const Layer = LAYERS[step];
        return (
          <g key={step} data-etape={step}>
            <Layer id={id} />
          </g>
        );
      })}
    </svg>
  );
}
