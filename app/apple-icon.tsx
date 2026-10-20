import { ImageResponse } from "next/og";
import { brandHex as c } from "@/lib/brand/hex";

// Icône d'écran d'accueil (iOS) : le monogramme de app/icon.svg, en PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: c.onyx }}>
      <svg viewBox="0 0 64 64" width="180" height="180">
        <ellipse
          cx="32"
          cy="38"
          rx="15"
          ry="15.5"
          fill="none"
          stroke={c.champagne}
          strokeWidth="3.2"
        />
        <path
          d="M24.5 17.5 28 13h8l3.5 4.5L32 25Z"
          fill={c.ivoire}
          stroke={c.champagne}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
