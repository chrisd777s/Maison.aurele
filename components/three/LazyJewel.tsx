"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { MetalId, Product } from "@/lib/commerce/types";
import { chooseTier, readDeviceSignals, type RenderTier } from "@/lib/device/capabilities";
import { RENDER_HEIGHT, RENDER_WIDTH, renderSrc } from "@/lib/renders";

// Three.js n'est jamais dans le bundle initial : chargé à la demande, côté client.
const JewelCanvas = dynamic(() => import("./JewelCanvas"), { ssr: false });

type Props = {
  product: Product;
  metal: MetalId;
  alt: string;
  sizes: string;
  /** Image principale de la page (LCP) : préchargée. */
  preload?: boolean;
  orbit?: boolean;
  autoRotate?: boolean;
  /** Charger la 3D (sinon l'image fixe seule). */
  enable3d?: boolean;
  tiltRef?: RefObject<{ x: number; y: number } | null>;
  className?: string;
};

/** Attend que le navigateur soit au repos après le chargement, pour ne rien retarder. */
function whenIdle(callback: () => void) {
  const run = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(callback, { timeout: 2500 });
    } else {
      setTimeout(callback, 600);
    }
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}

/**
 * Image fixe rendue depuis la scène 3D (premier affichage, LCP), remplacée en
 * fondu par la 3D vivante si l'appareil le permet. Hors écran, la 3D se met en pause.
 */
export function LazyJewel({
  product,
  metal,
  alt,
  sizes,
  preload,
  orbit,
  autoRotate = true,
  enable3d = true,
  tiltRef,
  className = "",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<RenderTier | null>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!enable3d) return;
    let cancelled = false;
    whenIdle(async () => {
      const signals = await readDeviceSignals();
      if (!cancelled) {
        setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        setTier(chooseTier(signals));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [enable3d]);

  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      {
        rootMargin: "120px",
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const live = enable3d && tier !== null && tier !== "aucun";

  return (
    <div
      ref={root}
      className={`relative ${className}`}
      data-3d={live ? (ready ? "pret" : "chargement") : "image"}
    >
      <Image
        src={renderSrc(product.slug, metal)}
        alt={alt}
        width={RENDER_WIDTH}
        height={RENDER_HEIGHT}
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        quality={85}
        className={`size-full object-contain transition-opacity duration-[var(--duree-longue)] ease-maison ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {live && (
        <div
          className={`absolute inset-0 transition-opacity duration-[var(--duree-longue)] ease-maison ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <JewelCanvas
            product={product}
            metal={metal}
            tier={tier}
            orbit={orbit}
            autoRotate={autoRotate && !reducedMotion}
            active={visible}
            tiltRef={tiltRef}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
