/**
 * Esquisse au trait d'un solitaire, en attendant la bague 3D (phase 3).
 * Purement décorative.
 */
export function RingSketch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Anneau */}
      <ellipse cx="100" cy="176" rx="68" ry="72" />
      <ellipse cx="100" cy="178" rx="58" ry="62" />
      {/* Panier et griffes */}
      <path d="M86 108 L92 84 M114 108 L108 84 M80 104 L74 72 M120 104 L126 72" />
      <path d="M84 106 Q100 114 116 106" />
      {/* Pierre : couronne, rondiste, pavillon et facettes */}
      <path d="M70 76 L82 60 H118 L130 76 Z" />
      <path d="M70 76 L100 106 L130 76" />
      <path d="M82 60 L90 76 L100 60 L110 76 L118 60 M90 76 L100 106 L110 76" />
      {/* Éclat */}
      <g className="eclat" stroke="var(--accent)" strokeWidth="0.8" strokeLinecap="round">
        <path d="M112 46 V58 M106 52 H118" />
      </g>
    </svg>
  );
}
