import type { ReactNode } from "react";
import type { MetalId, Product, ProductStone, StoneKind, StoneShape } from "@/lib/commerce/types";

/**
 * Illustrations procédurales des pièces, dans l'esprit des gouaches d'atelier.
 * Visuels de remplacement en attendant les rendus 3D (phase 3) puis les photos du client.
 * Tout est vectoriel : la loupe ×4 reste nette.
 */

export type ArtView = "face" | "detail" | "planche";

const W = 400;
const H = 500;
const CX = W / 2;

const metalColor: Record<MetalId, string> = {
  "or-blanc": "var(--or-blanc)",
  "or-jaune": "var(--or-jaune)",
  "or-rose": "var(--or-rose)",
  platine: "var(--platine)",
  "or-noir": "var(--or-noir)",
};

type Ctx = { id: string; line: boolean };

/* ── Dégradés ─────────────────────────────────────────────────── */

const gemStops: Record<StoneKind, [string, string, string]> = {
  diamant: ["var(--diamant)", "var(--diamant-reflet)", "var(--diamant)"],
  "diamant-noir": [
    "color-mix(in oklab, var(--diamant-noir) 70%, var(--pierre))",
    "var(--diamant-noir)",
    "var(--onyx)",
  ],
  saphir: [
    "var(--saphir-clair)",
    "var(--saphir)",
    "color-mix(in oklab, var(--saphir) 70%, var(--onyx))",
  ],
  "perle-akoya": ["var(--diamant)", "var(--perle)", "var(--perle-lustre)"],
  onyx: [
    "color-mix(in oklab, var(--onyx-pierre) 80%, var(--pierre))",
    "var(--onyx-pierre)",
    "var(--onyx)",
  ],
};

function Defs({ id, metal }: { id: string; metal: string }) {
  const kinds = Object.keys(gemStops) as StoneKind[];
  return (
    <defs>
      <radialGradient id={`${id}-lumiere`} cx="0.5" cy="0.38" r="0.62">
        <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
        <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={`color-mix(in oklab, ${metal} 55%, var(--diamant))`} />
        <stop offset="0.45" stopColor={metal} />
        <stop offset="1" stopColor={`color-mix(in oklab, ${metal} 72%, var(--onyx))`} />
      </linearGradient>
      {kinds.map((kind) => {
        const [a, b, c] = gemStops[kind];
        return kind === "perle-akoya" ? (
          <radialGradient key={kind} id={`${id}-${kind}`} cx="0.38" cy="0.34" r="0.7">
            <stop offset="0" stopColor={a} />
            <stop offset="0.55" stopColor={b} />
            <stop offset="1" stopColor={c} />
          </radialGradient>
        ) : (
          <linearGradient key={kind} id={`${id}-${kind}`} x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="0.5" stopColor={b} />
            <stop offset="1" stopColor={c} />
          </linearGradient>
        );
      })}
    </defs>
  );
}

const stroke = "var(--encre-douce)";

function fillFor(ctx: Ctx, kind: StoneKind) {
  return ctx.line ? "none" : `url(#${ctx.id}-${kind})`;
}

/* ── Pierres vues de profil ──────────────────────────────────── */

function GemSide({
  ctx,
  cx,
  cy,
  w,
  kind,
  shape,
  tilt = 0,
}: {
  ctx: Ctx;
  cx: number;
  cy: number;
  w: number;
  kind: StoneKind;
  shape: StoneShape;
  tilt?: number;
}) {
  if (shape === "perle") {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={w / 2}
          fill={fillFor(ctx, kind)}
          stroke={stroke}
          strokeWidth="0.6"
        />
        {!ctx.line && (
          <ellipse
            cx={cx - w * 0.14}
            cy={cy - w * 0.16}
            rx={w * 0.12}
            ry={w * 0.07}
            fill="var(--diamant)"
            opacity="0.8"
          />
        )}
      </g>
    );
  }
  const step = shape === "emeraude" || shape === "coussin";
  const t = w * (step ? 0.36 : 0.3);
  const h1 = w * 0.2;
  const h2 = w * (step ? 0.36 : 0.44);
  const half = w / 2;
  const k = w * 0.22;
  return (
    <g transform={tilt ? `rotate(${tilt} ${cx} ${cy})` : undefined}>
      <path
        d={`M${cx - half} ${cy} L${cx - t} ${cy - h1} H${cx + t} L${cx + half} ${cy} L${cx} ${cy + h2} Z`}
        fill={fillFor(ctx, kind)}
        stroke={stroke}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path
        d={`M${cx - half} ${cy} H${cx + half} M${cx - t} ${cy - h1} L${cx - k} ${cy} L${cx} ${cy - h1} L${cx + k} ${cy} L${cx + t} ${cy - h1} M${cx - k} ${cy} L${cx} ${cy + h2} L${cx + k} ${cy}`}
        fill="none"
        stroke={stroke}
        strokeWidth="0.4"
        opacity="0.8"
      />
    </g>
  );
}

/* ── Pierres vues de dessus (détail) ─────────────────────────── */

function GemTop({
  ctx,
  cx,
  cy,
  size,
  kind,
  shape,
}: {
  ctx: Ctx;
  cx: number;
  cy: number;
  size: number;
  kind: StoneKind;
  shape: StoneShape;
}) {
  const r = size / 2;
  const fill = fillFor(ctx, kind);
  const facet = { fill: "none", stroke, strokeWidth: 0.5, opacity: 0.75 } as const;

  if (shape === "perle") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth="0.6" />
        {!ctx.line && (
          <>
            <ellipse
              cx={cx - r * 0.3}
              cy={cy - r * 0.32}
              rx={r * 0.26}
              ry={r * 0.15}
              fill="var(--diamant)"
              opacity="0.85"
            />
            <circle
              cx={cx + r * 0.35}
              cy={cy + r * 0.4}
              r={r * 0.5}
              fill="var(--perle-lustre)"
              opacity="0.25"
            />
          </>
        )}
      </g>
    );
  }

  if (shape === "emeraude" || shape === "cabochon") {
    const hw = r * 0.72;
    const hh = r;
    const steps = kind === "onyx" ? [1] : [1, 0.78, 0.56, 0.36];
    const rect = (s: number) => {
      const x = hw * s;
      const y = hh * s;
      const c = Math.min(x, y) * 0.28;
      return `M${cx - x + c} ${cy - y} H${cx + x - c} L${cx + x} ${cy - y + c} V${cy + y - c} L${cx + x - c} ${cy + y} H${cx - x + c} L${cx - x} ${cy + y - c} V${cy - y + c} Z`;
    };
    return (
      <g>
        <path d={rect(1)} fill={fill} stroke={stroke} strokeWidth="0.6" />
        {steps.slice(1).map((s) => (
          <path key={s} d={rect(s)} {...facet} />
        ))}
        {kind !== "onyx" && (
          <path
            d={`M${cx - hw} ${cy - hh + hw * 0.28} L${cx - hw * 0.36} ${cy - hh * 0.36} M${cx + hw} ${cy - hh + hw * 0.28} L${cx + hw * 0.36} ${cy - hh * 0.36} M${cx - hw} ${cy + hh - hw * 0.28} L${cx - hw * 0.36} ${cy + hh * 0.36} M${cx + hw} ${cy + hh - hw * 0.28} L${cx + hw * 0.36} ${cy + hh * 0.36}`}
            {...facet}
          />
        )}
        {kind === "onyx" && !ctx.line && (
          <path
            d={`M${cx - hw * 0.8} ${cy - hh * 0.9} L${cx + hw * 0.2} ${cy - hh * 0.9} L${cx - hw * 0.8} ${cy + hh * 0.1} Z`}
            fill="var(--diamant)"
            opacity="0.06"
          />
        )}
      </g>
    );
  }

  // Tailles brillantes : rond, ovale, coussin, poire — même étoile de facettes, contour adapté.
  const sx = shape === "ovale" ? 0.74 : 1;
  const outline =
    shape === "poire"
      ? `M${cx} ${cy - r} C${cx + r * 0.32} ${cy - r * 0.55} ${cx + r * 0.78} ${cy - r * 0.05} ${cx + r * 0.78} ${cy + r * 0.32} A${r * 0.78} ${r * 0.68} 0 0 1 ${cx - r * 0.78} ${cy + r * 0.32} C${cx - r * 0.78} ${cy - r * 0.05} ${cx - r * 0.32} ${cy - r * 0.55} ${cx} ${cy - r} Z`
      : shape === "coussin"
        ? `M${cx - r * 0.62} ${cy - r * 0.9} Q${cx} ${cy - r * 1.02} ${cx + r * 0.62} ${cy - r * 0.9} Q${cx + r * 0.92} ${cy - r * 0.88} ${cx + r * 0.9} ${cy - r * 0.6} Q${cx + r * 1.02} ${cy} ${cx + r * 0.9} ${cy + r * 0.6} Q${cx + r * 0.88} ${cy + r * 0.88} ${cx + r * 0.62} ${cy + r * 0.9} Q${cx} ${cy + r * 1.02} ${cx - r * 0.62} ${cy + r * 0.9} Q${cx - r * 0.92} ${cy + r * 0.88} ${cx - r * 0.9} ${cy + r * 0.6} Q${cx - r * 1.02} ${cy} ${cx - r * 0.9} ${cy - r * 0.6} Q${cx - r * 0.88} ${cy - r * 0.88} ${cx - r * 0.62} ${cy - r * 0.9} Z`
        : undefined;
  const fcy = shape === "poire" ? cy + r * 0.12 : cy;
  const fr = shape === "poire" ? r * 0.72 : r;
  const table = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    return [cx + Math.cos(a) * fr * 0.52 * sx, fcy + Math.sin(a) * fr * 0.52] as const;
  });
  const rim = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI / 8) * i;
    return [cx + Math.cos(a) * fr * 0.96 * sx, fcy + Math.sin(a) * fr * 0.96] as const;
  });
  const tablePath = `M${table.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
  const stars = table
    .map(([x, y], i) => {
      const [ax, ay] = rim[(i * 2 + 1) % 16]!;
      const [bx, by] = rim[(i * 2 + 2) % 16]!;
      return `M${x.toFixed(1)} ${y.toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}`;
    })
    .join(" ");
  return (
    <g>
      {outline ? (
        <path d={outline} fill={fill} stroke={stroke} strokeWidth="0.6" />
      ) : (
        <ellipse cx={cx} cy={cy} rx={r * sx} ry={r} fill={fill} stroke={stroke} strokeWidth="0.6" />
      )}
      <path d={tablePath} {...facet} />
      <path d={stars} {...facet} />
      {!ctx.line && kind === "diamant" && (
        <path
          d={`M${cx - r * 0.2 * sx} ${fcy - r * 0.42} L${cx + r * 0.05 * sx} ${fcy - r * 0.15} L${cx - r * 0.32 * sx} ${fcy - r * 0.1} Z`}
          fill="var(--diamant)"
          opacity="0.9"
        />
      )}
    </g>
  );
}

/* ── Montures ────────────────────────────────────────────────── */

function Band({
  ctx,
  cy = 300,
  r = 104,
  thickness = 10,
  gap,
}: {
  ctx: Ctx;
  cy?: number;
  r?: number;
  thickness?: number;
  gap?: boolean;
}) {
  const ry = r * 1.04;
  const ir = r - thickness;
  const iry = ry - thickness * 0.9;
  const d = gap
    ? `M${CX + 26} ${cy - ry + 3} A${r} ${ry} 0 1 1 ${CX - 26} ${cy - ry + 3} L${CX - 24} ${cy - iry + 3} A${ir} ${iry} 0 1 0 ${CX + 24} ${cy - iry + 3} Z`
    : `M${CX - r} ${cy} A${r} ${ry} 0 1 0 ${CX + r} ${cy} A${r} ${ry} 0 1 0 ${CX - r} ${cy} Z M${CX - ir} ${cy + 1} A${ir} ${iry} 0 1 1 ${CX + ir} ${cy + 1} A${ir} ${iry} 0 1 1 ${CX - ir} ${cy + 1} Z`;
  return (
    <path
      d={d}
      fillRule="evenodd"
      fill={ctx.line ? "none" : `url(#${ctx.id}-metal)`}
      stroke={stroke}
      strokeWidth="0.6"
    />
  );
}

function Prongs({
  cx,
  top,
  girdle,
  half,
}: {
  cx: number;
  top: number;
  girdle: number;
  half: number;
}) {
  return (
    <path
      d={`M${cx - 14} ${top} L${cx - half * 0.86} ${girdle - 6} M${cx + 14} ${top} L${cx + half * 0.86} ${girdle - 6} M${cx - 6} ${top + 2} L${cx - half * 0.3} ${girdle + 4} M${cx + 6} ${top + 2} L${cx + half * 0.3} ${girdle + 4} M${cx - 16} ${top + 4} Q${cx} ${top + 12} ${cx + 16} ${top + 4}`}
      fill="none"
      stroke={stroke}
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  );
}

function Chain({
  from,
  to,
  sag,
  dots,
}: {
  from: [number, number];
  to: [number, number];
  sag: number;
  dots?: boolean;
}) {
  const mx = (from[0] + to[0]) / 2;
  const my = Math.max(from[1], to[1]) + sag;
  return (
    <path
      d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`}
      fill="none"
      stroke={stroke}
      strokeWidth="0.7"
      strokeDasharray={dots ? "1.4 2.6" : undefined}
      strokeLinecap="round"
    />
  );
}

/** Points espacés le long d'une courbe quadratique. */
function along(from: [number, number], ctrl: [number, number], to: [number, number], n: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const x = (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * ctrl[0] + t ** 2 * to[0];
    const y = (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * ctrl[1] + t ** 2 * to[1];
    return [x, y] as const;
  });
}

/* ── Compositions par forme ──────────────────────────────────── */

function gemWidth(stone: ProductStone | undefined, min = 46, max = 96) {
  if (!stone) return min;
  if (stone.sizeMm) return Math.min(max, stone.sizeMm * 7);
  const each = (stone.carats ?? 0.5) / stone.count;
  return Math.max(min, Math.min(max, 46 + each * 24));
}

function Composition({ product, ctx }: { product: Product; ctx: Ctx }) {
  const main = product.stones.find((s) => s.role === "centrale") ?? product.stones[0];
  const second = product.stones.find((s) => s.role === "accent");
  if (!main) return null;
  const k = main.kind;
  const w = gemWidth(main);

  switch (product.visual.form) {
    case "solitaire":
    case "epaulee": {
      const girdle = 166;
      return (
        <g>
          <Band ctx={ctx} thickness={product.visual.form === "epaulee" ? 12 : 9} />
          <Prongs cx={CX} top={194} girdle={girdle} half={w / 2} />
          {product.visual.form === "epaulee" && second && (
            <>
              <GemSide
                ctx={ctx}
                cx={CX - w / 2 - 12}
                cy={194}
                w={16}
                kind={second.kind}
                shape={second.shape}
                tilt={-24}
              />
              <GemSide
                ctx={ctx}
                cx={CX + w / 2 + 12}
                cy={194}
                w={16}
                kind={second.kind}
                shape={second.shape}
                tilt={24}
              />
            </>
          )}
          <GemSide ctx={ctx} cx={CX} cy={girdle} w={w} kind={k} shape={main.shape} />
        </g>
      );
    }
    case "trilogie": {
      const side = second ?? main;
      return (
        <g>
          <Band ctx={ctx} />
          <Prongs cx={CX} top={194} girdle={168} half={w / 2} />
          <GemSide
            ctx={ctx}
            cx={CX - w / 2 - 14}
            cy={184}
            w={w * 0.5}
            kind={side.kind}
            shape={side.shape}
            tilt={-18}
          />
          <GemSide
            ctx={ctx}
            cx={CX + w / 2 + 14}
            cy={184}
            w={w * 0.5}
            kind={side.kind}
            shape={side.shape}
            tilt={18}
          />
          <GemSide ctx={ctx} cx={CX} cy={168} w={w} kind={k} shape={main.shape} />
        </g>
      );
    }
    case "halo": {
      const halo = second ?? main;
      const pts = along([CX - w * 0.62, 176], [CX, 214], [CX + w * 0.62, 176], 11);
      return (
        <g>
          <Band ctx={ctx} />
          <Prongs cx={CX} top={194} girdle={166} half={w / 2} />
          {pts.map(([x, y], i) => (
            <GemSide key={i} ctx={ctx} cx={x} cy={y} w={9} kind={halo.kind} shape="rond" />
          ))}
          <GemSide ctx={ctx} cx={CX} cy={164} w={w} kind={k} shape={main.shape} />
        </g>
      );
    }
    case "toi-et-moi": {
      const other = second ?? main;
      return (
        <g>
          <Band ctx={ctx} gap />
          <GemSide ctx={ctx} cx={CX - 40} cy={180} w={w} kind={k} shape={main.shape} tilt={-12} />
          <GemSide
            ctx={ctx}
            cx={CX + 40}
            cy={182}
            w={gemWidth(other)}
            kind={other.kind}
            shape={other.shape}
          />
        </g>
      );
    }
    case "chevaliere": {
      const top = 176;
      return (
        <g>
          <Band ctx={ctx} thickness={16} />
          <path
            d={`M${CX - 62} ${top + 16} L${CX - 46} ${top - 14} H${CX + 46} L${CX + 62} ${top + 16} Z`}
            fill={ctx.line ? "none" : `url(#${ctx.id}-metal)`}
            stroke={stroke}
            strokeWidth="0.6"
          />
          <path
            d={`M${CX - 50} ${top + 10} L${CX - 39} ${top - 9} H${CX + 39} L${CX + 50} ${top + 10} Z`}
            fill={fillFor(ctx, k)}
            stroke={stroke}
            strokeWidth="0.5"
          />
          {second && (
            <ellipse
              cx={CX}
              cy={top + 1}
              rx={6}
              ry={3.6}
              fill={fillFor(ctx, second.kind)}
              stroke={stroke}
              strokeWidth="0.5"
            />
          )}
        </g>
      );
    }
    case "pendentif": {
      const hang = 250;
      const pearl = product.stones.find((s) => s.kind === "perle-akoya" && s !== main);
      const line = product.stones.find((s) => s.kind === "diamant-noir" && s.count > 1);
      return (
        <g>
          <Chain from={[40, 40]} to={[CX, hang - 54]} sag={-30} />
          <Chain from={[W - 40, 40]} to={[CX, hang - 54]} sag={-30} />
          <circle cx={CX} cy={hang - 50} r={4} fill="none" stroke={stroke} strokeWidth="0.7" />
          <GemTop
            ctx={ctx}
            cx={CX}
            cy={hang}
            size={k === "onyx" ? 90 : w + 24}
            kind={k}
            shape={main.shape}
          />
          {line &&
            Array.from({ length: line.count }, (_, i) => (
              <circle
                key={i}
                cx={CX}
                cy={hang - 40 + i * 10}
                r={2.6}
                fill={fillFor(ctx, line.kind)}
                stroke={stroke}
                strokeWidth="0.3"
              />
            ))}
          {pearl && (
            <>
              <path
                d={`M${CX} ${hang + w * 0.4} q6 14 0 28`}
                fill="none"
                stroke={stroke}
                strokeWidth="0.7"
              />
              <GemTop
                ctx={ctx}
                cx={CX}
                cy={hang + w * 0.4 + 52}
                size={gemWidth(pearl) + 8}
                kind="perle-akoya"
                shape="perle"
              />
            </>
          )}
        </g>
      );
    }
    case "boucles-pendantes":
    case "puces": {
      const drops = product.visual.form === "boucles-pendantes";
      const accentStone = second;
      return (
        <g>
          {[CX - 80, CX + 80].map((x) => (
            <g key={x}>
              {drops ? (
                <>
                  <GemTop
                    ctx={ctx}
                    cx={x}
                    cy={150}
                    size={16}
                    kind={accentStone?.kind ?? k}
                    shape="rond"
                  />
                  <path d={`M${x} 158 V196`} stroke={stroke} strokeWidth="0.7" />
                  <GemTop ctx={ctx} cx={x} cy={238} size={w + 8} kind={k} shape={main.shape} />
                </>
              ) : (
                <>
                  <path
                    d={`M${x - 26} 268 Q${x} 300 ${x + 26} 268`}
                    fill="none"
                    stroke={ctx.line ? stroke : `url(#${ctx.id}-metal)`}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <GemTop
                    ctx={ctx}
                    cx={x}
                    cy={228}
                    size={gemWidth(main) + 10}
                    kind={k}
                    shape="perle"
                  />
                  {accentStone && (
                    <GemTop
                      ctx={ctx}
                      cx={x}
                      cy={290}
                      size={12}
                      kind={accentStone.kind}
                      shape="rond"
                    />
                  )}
                </>
              )}
            </g>
          ))}
        </g>
      );
    }
    case "riviere": {
      const pts = along([60, 260], [CX, 420], [W - 60, 260], 24);
      return (
        <g>
          <ellipse
            cx={CX}
            cy={250}
            rx={150}
            ry={92}
            fill="none"
            stroke={stroke}
            strokeWidth="0.5"
            strokeDasharray="1.5 3"
          />
          {pts.map(([x, y], i) => (
            <GemTop key={i} ctx={ctx} cx={x} cy={y - 40} size={13} kind={k} shape="rond" />
          ))}
        </g>
      );
    }
    case "rang-de-perles": {
      const pts = along([46, 70], [CX, 520], [W - 46, 70], 31);
      return (
        <g>
          {pts.map(([x, y], i) => (
            <GemTop key={i} ctx={ctx} cx={x} cy={y} size={20} kind={k} shape="perle" />
          ))}
          {second && (
            <GemTop ctx={ctx} cx={CX} cy={312} size={12} kind={second.kind} shape="rond" />
          )}
        </g>
      );
    }
    case "manchette": {
      const blades = 12;
      return (
        <g>
          <path
            d={`M70 190 Q${CX} 150 ${W - 70} 190 V310 Q${CX} 270 70 310 Z`}
            fill={ctx.line ? "none" : `url(#${ctx.id}-metal)`}
            stroke={stroke}
            strokeWidth="0.6"
          />
          {Array.from({ length: blades }, (_, i) => {
            const x = 84 + i * ((W - 168) / blades);
            const bw = (W - 168) / blades - 6;
            const dy = Math.abs(x + bw / 2 - CX) * -0.18 + 22;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={196 - dy + 18}
                  width={bw}
                  height={92}
                  fill={fillFor(ctx, k)}
                  stroke={stroke}
                  strokeWidth="0.4"
                />
                {second &&
                  Array.from({ length: 5 }, (_, j) => (
                    <circle
                      key={j}
                      cx={x + bw + 3}
                      cy={196 - dy + 26 + j * 19}
                      r={1.8}
                      fill={fillFor(ctx, second.kind)}
                      stroke={stroke}
                      strokeWidth="0.2"
                    />
                  ))}
              </g>
            );
          })}
        </g>
      );
    }
  }
}

/* ── Annotations de la planche d'atelier ─────────────────────── */

function Annotations({ product, locale }: { product: Product; locale: string }) {
  const main = product.stones.find((s) => s.role === "centrale") ?? product.stones[0];
  const fmt = new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    maximumFractionDigits: 2,
  });
  const label = main?.carats
    ? `${fmt.format(main.carats)} ct`
    : main?.sizeMm
      ? `${fmt.format(main.sizeMm)} mm`
      : "";
  const text = {
    fontFamily: "var(--font-sans)",
    fontSize: 9,
    letterSpacing: "0.18em",
    fill: stroke,
  } as const;
  return (
    <g>
      <path d={`M120 430 H280 M120 425 V435 M280 425 V435`} stroke={stroke} strokeWidth="0.5" />
      <text x={CX} y={450} textAnchor="middle" {...text}>
        {label}
      </text>
      <text x={28} y={474} {...text}>
        {product.reference}
      </text>
      <text x={W - 28} y={474} textAnchor="end" {...text}>
        {`${product.metalWeightG.toString().replace(".", locale === "fr" ? "," : ".")} g`}
      </text>
      <path d="M24 24 H44 M24 24 V44 M376 24 H356 M376 24 V44" stroke={stroke} strokeWidth="0.5" />
    </g>
  );
}

function Grid() {
  const lines: ReactNode[] = [];
  for (let x = 40; x < W; x += 40) lines.push(<path key={`x${x}`} d={`M${x} 0 V${H}`} />);
  for (let y = 50; y < H; y += 50) lines.push(<path key={`y${y}`} d={`M0 ${y} H${W}`} />);
  return (
    <g stroke="var(--filet)" strokeWidth="0.4">
      {lines}
    </g>
  );
}

/* ── Composant public ────────────────────────────────────────── */

type Props = {
  product: Product;
  view?: ArtView;
  metal?: MetalId;
  locale: string;
  className?: string;
  /** Identifiant unique dans la page (les dégradés SVG sont référencés par id). */
  uid: string;
};

export function JewelArt({ product, view = "face", metal, locale, className = "", uid }: Props) {
  const metalId = metal ?? product.metals[0]?.id ?? "or-blanc";
  const ctx: Ctx = { id: uid, line: view === "planche" };
  const main = product.stones.find((s) => s.role === "centrale") ?? product.stones[0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <Defs id={uid} metal={metalColor[metalId]} />
      <rect width={W} height={H} fill="var(--surface)" />
      {view === "planche" ? <Grid /> : <rect width={W} height={H} fill={`url(#${uid}-lumiere)`} />}
      {view === "detail" && main ? (
        <g>
          <GemTop
            ctx={ctx}
            cx={CX}
            cy={240}
            size={main.kind === "onyx" ? 220 : 230}
            kind={main.kind}
            shape={main.shape}
          />
          <ellipse cx={CX} cy={410} rx={110} ry={8} fill="var(--encre)" opacity="0.05" />
        </g>
      ) : (
        <g transform={view === "planche" ? "translate(0 30)" : undefined}>
          <Composition product={product} ctx={ctx} />
        </g>
      )}
      {view === "planche" && <Annotations product={product} locale={locale} />}
    </svg>
  );
}
