import { useId } from "react";

/** La gravure telle qu'elle courra à l'intérieur de l'anneau. */
export function EngravingPreview({ text, label }: { text: string; label: string }) {
  const id = useId();
  return (
    <figure className="mt-4">
      <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label={label}>
        <defs>
          <path id={`arc-${id}`} d="M20 70 Q160 10 300 70" />
        </defs>
        <path d="M14 76 Q160 6 306 76" fill="none" stroke="var(--filet)" strokeWidth="1" />
        <path d="M26 64 Q160 14 294 64" fill="none" stroke="var(--filet)" strokeWidth="1" />
        <text
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontSize="17"
          letterSpacing="1.5"
          fill="var(--accent-encre)"
          textAnchor="middle"
        >
          <textPath href={`#arc-${id}`} startOffset="50%">
            {text}
          </textPath>
        </text>
      </svg>
    </figure>
  );
}
