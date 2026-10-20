import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brandHex as c } from "@/lib/brand/hex";
import type { MetalId } from "@/lib/commerce/types";

/** Format des images de partage (Open Graph, X, LinkedIn). */
export const OG_SIZE = { width: 1200, height: 630 };

// Polices OFL réduites au latin (assets/fonts) : `next/og` ne lit ni woff2 ni
// polices variables. Lues une fois par processus.
const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-Light.ttf")),
  readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-LightItalic.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Jost-Regular.ttf")),
]);

/**
 * Rendu fixe d'une pièce en data URI pour `next/og`, depuis sa version JPEG
 * (public/renders/partage, scripts/share-renders.mjs) : le WebP n'y est pas dessiné.
 */
export async function renderDataUri(slug: string, metal: MetalId) {
  "use cache"; // lecture de fichier : sans cache, la route ne serait pas générée au build
  const file = join(process.cwd(), "public/renders/partage", `${slug}--${metal}.jpg`);
  return `data:image/jpeg;base64,${(await readFile(file)).toString("base64")}`;
}

/**
 * Carte de partage : ivoire, titre en Cormorant, filet champagne ; à droite, le
 * rendu de la pièce quand il y en a un (même fond ivoire que la carte).
 */
export async function ogCard({
  eyebrow,
  title,
  subtitle,
  image,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  footer: string;
}) {
  const [serif, serifItalic, sans] = await fonts;
  const long = title.length > 34;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: c.ivoire,
        color: c.onyx,
        fontFamily: "Jost",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 72px 64px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: c.champagneEncre,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              marginTop: 36,
              fontFamily: "Cormorant",
              fontSize: long ? 68 : 88,
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                marginTop: 28,
                fontFamily: "Cormorant",
                fontStyle: "italic",
                fontSize: 34,
                lineHeight: 1.25,
                color: c.pierreEncre,
                maxWidth: 620,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 96, height: 2, background: c.champagne }} />
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            <span>Maison Aurèle</span>
            <span style={{ color: c.pierreEncre }}>{footer}</span>
          </div>
        </div>
      </div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element -- rendu par next/og, pas par le navigateur
        <img src={image} width={504} height={630} alt="" style={{ objectFit: "cover" }} />
      )}
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Cormorant", data: serif, weight: 300, style: "normal" },
        { name: "Cormorant", data: serifItalic, weight: 300, style: "italic" },
        { name: "Jost", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
