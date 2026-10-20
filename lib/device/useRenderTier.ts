"use client";

import { useEffect, useState } from "react";
import { chooseTier, readDeviceSignals, type RenderTier } from "./capabilities";

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
 * Niveau de rendu 3D de l'appareil, déterminé une fois la page au repos
 * (`null` tant qu'il n'est pas connu), et préférence de mouvement réduit.
 * `requested` : la 3D a été demandée explicitement par le visiteur.
 */
export function useRenderTier(enabled = true, requested = false) {
  const [tier, setTier] = useState<RenderTier | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    whenIdle(async () => {
      const signals = await readDeviceSignals();
      if (cancelled) return;
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setTier(chooseTier(signals, requested));
    });
    return () => {
      cancelled = true;
    };
  }, [enabled, requested]);

  return { tier, reducedMotion };
}
