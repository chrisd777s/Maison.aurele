"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  NeutralToneMapping,
  Sphere,
  Vector3,
  type Group,
  type PerspectiveCamera,
} from "three";
import type { MetalId, Product } from "@/lib/commerce/types";
import type { RenderTier } from "@/lib/device/capabilities";
import { readPalette } from "@/lib/three/palette";
import { JewelModel, viewDirection } from "./JewelModel";
import { createStudio } from "./studio";

export type JewelCanvasProps = {
  product: Product;
  metal: MetalId;
  tier: Exclude<RenderTier, "aucun">;
  /** Rotation lente automatique (désactivée si l'utilisateur préfère moins de mouvement). */
  autoRotate?: boolean;
  /** Rotation à la main (visionneuse des fiches produit). */
  orbit?: boolean;
  /** Mode affiche : rendu figé, signal `window.__posterReady` après stabilisation. */
  poster?: boolean;
  /** Appelé après la première image affichée (fondu depuis l'image fixe). */
  onReady?: () => void;
  /** Lumière pilotée par le gyroscope : [-1, 1] sur chaque axe. */
  tiltRef?: React.RefObject<{ x: number; y: number } | null>;
  active?: boolean;
};

const FOV = 26;

function Scene({
  product,
  metal,
  tier,
  autoRotate,
  orbit,
  poster,
  onReady,
  tiltRef,
}: JewelCanvasProps) {
  const { gl, camera, size } = useThree();
  const palette = useMemo(() => readPalette(), []);
  const studio = useMemo(
    () =>
      createStudio(
        { warm: palette.champagne, light: palette.diamant, dark: palette.onyx },
        tier === "complet" ? 256 : 128,
      ),
    [palette, tier],
  );
  const model = useRef<Group>(null);
  const pointer = useRef({ x: 0.35, y: 0.55 });
  const light = useRef(new Vector3(0.35, 0.55, 1));
  const frames = useRef(0);
  const [bounds, setBounds] = useState({ minY: -1, radius: 1.5 });

  useEffect(() => () => studio.dispose(), [studio]);

  // La lumière suit le curseur sur toute la page (pas seulement le canevas).
  useEffect(() => {
    if (poster) return;
    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [poster]);

  // Cadrage : la caméra recule jusqu'à contenir la sphère englobante du bijou.
  useLayoutEffect(() => {
    if (!model.current) return;
    const box = new Box3().setFromObject(model.current);
    const sphere = box.getBoundingSphere(new Sphere());
    model.current.position.sub(sphere.center);
    // Mesure après montage : la géométrie n'existe qu'une fois rendue.
    setBounds({ minY: box.min.y - sphere.center.y, radius: sphere.radius });
    const cam = camera as PerspectiveCamera;
    const fitH = sphere.radius / Math.sin((FOV * Math.PI) / 360);
    const fitW = fitH / Math.min(1, size.width / size.height);
    const dir = new Vector3(...viewDirection(product.visual.form)).normalize();
    cam.position.copy(dir.multiplyScalar(Math.max(fitH, fitW) * 1.08));
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, product, size.width, size.height]);

  useFrame((_, delta) => {
    const target = tiltRef?.current ?? pointer.current;
    // Lumière principale : au-dessus, déplacée par le curseur, lissée.
    const wanted = new Vector3(target.x * 1.4, 0.6 + target.y * 0.9, 1).normalize();
    if (wanted.distanceTo(light.current) > 0.002 || frames.current === 0) {
      light.current.lerp(wanted, poster ? 1 : Math.min(1, delta * 3));
      studio.setKey(light.current.clone().applyQuaternion(camera.quaternion));
    }
    studio.update(gl);
    if (autoRotate && model.current && !orbit) model.current.rotation.y += delta * 0.12;

    frames.current += 1;
    if (frames.current === 2) onReady?.();
    if (poster && frames.current === 8)
      (window as Window & { __posterReady?: boolean }).__posterReady = true;
  });

  return (
    <>
      {/* Carte d'environnement de la scène : le studio procédural */}
      <primitive object={studio.texture} attach="environment" />
      <group ref={model}>
        <JewelModel
          product={product}
          metal={metal}
          palette={palette}
          tier={tier}
          envMap={studio.texture}
        />
      </group>
      <ContactShadows
        position={[0, bounds.minY - 0.02, 0]}
        scale={bounds.radius * 3}
        blur={2.6}
        far={1.4}
        opacity={0.32}
        resolution={tier === "complet" ? 512 : 256}
        frames={poster ? 1 : Infinity}
      />
      {orbit && (
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={bounds.radius * 1.6}
          maxDistance={bounds.radius * 6}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          enableDamping
        />
      )}
    </>
  );
}

/** Canevas WebGL : transparent, pour se poser sur n'importe quel fond (jour ou nuit). */
export default function JewelCanvas(props: JewelCanvasProps) {
  return (
    <Canvas
      dpr={props.poster ? 2 : props.tier === "complet" ? [1, 2] : [1, 1.5]}
      frameloop={props.active === false ? "never" : "always"}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: props.tier === "complet" ? "high-performance" : "low-power",
        preserveDrawingBuffer: Boolean(props.poster),
        toneMapping: NeutralToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: FOV, near: 0.05, far: 60, position: [0, 0.5, 6] }}
      style={{ touchAction: props.orbit ? "none" : "auto" }}
      aria-hidden="true"
    >
      <Scene {...props} />
    </Canvas>
  );
}
