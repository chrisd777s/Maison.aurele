import type { AtelierSetting, AtelierShape } from "@/lib/atelier/config";

const common = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Contour de la pierre vue de dessus, avec sa table. */
export function ShapePictogram({
  shape,
  className = "",
}: {
  shape: AtelierShape;
  className?: string;
}) {
  const outline: Record<AtelierShape, string> = {
    rond: "M24 8a16 16 0 1 0 0 32a16 16 0 1 0 0-32z",
    ovale: "M24 5c8 0 12 9 12 19s-4 19-12 19-12-9-12-19 4-19 12-19z",
    emeraude: "M17 7h14l5 5v24l-5 5H17l-5-5V12z",
    poire: "M24 5c5 6 13 15 13 23a13 13 0 0 1-26 0c0-8 8-17 13-23z",
    coussin:
      "M14 9c6-2 14-2 20 0 4 1 5 2 5 5 2 6 2 14 0 20 0 3-1 4-5 5-6 2-14 2-20 0-4-1-5-2-5-5-2-6-2-14 0-20 0-3 1-4 5-5z",
  };
  const table: Record<AtelierShape, string> = {
    rond: "M24 15l6.4 2.6 2.6 6.4-2.6 6.4L24 33l-6.4-2.6L15 24l2.6-6.4z",
    ovale: "M24 13l5 3.5 1.5 7.5-1.5 7.5L24 35l-5-3.5-1.5-7.5 1.5-7.5z",
    emeraude: "M19.5 14h9l2.5 2.5v15L28.5 34h-9L17 31.5v-15z",
    poire: "M24 14l5 6.5 1.5 7.5-3 5h-7l-3-5 1.5-7.5z",
    coussin: "M19 15h10l4 4v10l-4 4H19l-4-4V19z",
  };
  return (
    <svg {...common} className={className}>
      <path d={outline[shape]} />
      <path d={table[shape]} strokeWidth={0.6} opacity={0.7} />
    </svg>
  );
}

/** Monture vue de dessus : pierre seule, en halo ou en trilogie. */
export function SettingPictogram({
  setting,
  className = "",
}: {
  setting: AtelierSetting;
  className?: string;
}) {
  return (
    <svg {...common} className={className}>
      <circle cx="24" cy="24" r={setting === "trilogie" ? 8 : 9} />
      {setting === "halo" &&
        Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <circle key={i} cx={24 + Math.cos(a) * 13.5} cy={24 + Math.sin(a) * 13.5} r={1.6} />
          );
        })}
      {setting === "trilogie" && (
        <>
          <path d="M5 24c3-4 7-6 9-6v12c-2 0-6-2-9-6z" />
          <path d="M43 24c-3-4-7-6-9-6v12c2 0 6-2 9-6z" />
        </>
      )}
      {setting === "solitaire" && <path d="M24 9v-4M24 43v-4M9 24H5M43 24h-4" strokeWidth={0.6} />}
    </svg>
  );
}
