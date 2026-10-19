"use client";

import dynamic from "next/dynamic";
import type { MetalId, Product } from "@/lib/commerce/types";

const JewelCanvas = dynamic(() => import("@/components/three/JewelCanvas"), { ssr: false });

export function PosterStage({ product, metal }: { product: Product; metal: MetalId }) {
  return (
    <div id="affiche" style={{ width: "100vw", height: "100vh" }}>
      <JewelCanvas product={product} metal={metal} tier="complet" poster />
    </div>
  );
}
