"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useLocale } from "next-intl";
import { JewelArt } from "@/components/art/JewelArt";
import type { AtelierConfig } from "@/lib/atelier/config";
import type { Product } from "@/lib/commerce/types";
import { useRenderTier } from "@/lib/device/useRenderTier";

const JewelCanvas = dynamic(() => import("@/components/three/JewelCanvas"), { ssr: false });

/**
 * Aperçu de la bague composée. L'illustration se met à jour instantanément
 * (configurateur utilisable sans 3D) ; la 3D la remplace dès qu'elle est prête.
 */
export function AtelierViewer({
  product,
  config,
  label,
  hint,
}: {
  product: Product;
  config: AtelierConfig;
  label: string;
  hint: string;
}) {
  const locale = useLocale();
  const { tier, reducedMotion } = useRenderTier();
  const [ready, setReady] = useState(false);
  const live = tier !== null && tier !== "aucun";

  return (
    <figure
      aria-label={label}
      className="relative bg-surface"
      data-3d={live ? (ready ? "pret" : "chargement") : "image"}
    >
      <JewelArt
        product={product}
        metal={config.metal}
        locale={locale}
        uid="atelier"
        className={`block aspect-square w-full transition-opacity duration-[var(--duree-longue)] ease-maison ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {live && (
        <div
          className={`absolute inset-0 transition-opacity duration-[var(--duree-longue)] ease-maison ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <JewelCanvas
            product={product}
            metal={config.metal}
            tier={tier}
            orbit
            framing="fixe"
            autoRotate={!reducedMotion}
            onReady={() => setReady(true)}
          />
        </div>
      )}
      {ready && (
        <figcaption className="absolute bottom-3 left-4 text-petit text-encre-douce">
          {hint}
        </figcaption>
      )}
    </figure>
  );
}
