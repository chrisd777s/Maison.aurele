"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LazyJewel } from "@/components/three/LazyJewel";
import type { Product } from "@/lib/commerce/types";

type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/**
 * Bague de l'ouverture. Sur téléphone, la lumière suit l'inclinaison :
 * directement sur Android, après autorisation explicite sur iOS (bouton).
 */
export function HeroJewel({ product }: { product: Product }) {
  const t = useTranslations("Home");
  const tilt = useRef<{ x: number; y: number } | null>(null);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [tiltOn, setTiltOn] = useState(false);

  function listen() {
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      tilt.current = { x: clamp(event.gamma / 35), y: clamp((50 - event.beta) / 35) };
      // Annoncé seulement quand le capteur répond réellement.
      setTiltOn(true);
    };
    window.addEventListener("deviceorientation", onOrientation);
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches || !("DeviceOrientationEvent" in window))
      return;
    const api = window.DeviceOrientationEvent as unknown as OrientationPermission;
    if (typeof api.requestPermission === "function") {
      // iOS : il faut un geste de l'utilisateur.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNeedsPermission(true);
      return;
    }
    return listen();
  }, []);

  async function askPermission() {
    const api = window.DeviceOrientationEvent as unknown as OrientationPermission;
    const answer = await api.requestPermission?.();
    setNeedsPermission(false);
    if (answer === "granted") listen();
  }

  return (
    <div className="relative">
      <LazyJewel
        product={product}
        metal={product.metals[0]!.id}
        alt={t("heroAlt")}
        sizes="(min-width: 1024px) 48vw, 80vw"
        preload
        tiltRef={tilt}
        className="aspect-[4/5] h-[min(42svh,26rem)] lg:h-[min(62svh,38rem)]"
      />
      {(needsPermission || tiltOn) && (
        <p className="surtitre mt-2 text-center text-encre-douce">
          {needsPermission ? (
            <button
              type="button"
              onClick={askPermission}
              className="lien-fin inline-flex min-h-11 items-center"
            >
              {t("tiltPrompt")}
            </button>
          ) : (
            t("tiltActive")
          )}
        </p>
      )}
    </div>
  );
}
