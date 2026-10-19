"use client";

import { useMemo } from "react";
import { CatmullRomCurve3, Quaternion, Vector3, type Texture } from "three";
import type { MetalId, Product, ProductStone, StoneShape } from "@/lib/commerce/types";
import type { RenderTier } from "@/lib/device/capabilities";
import { gemGeometry } from "@/lib/three/gem-geometry";
import type { Palette } from "@/lib/three/palette";
import { GemMaterial, MetalMaterial } from "./materials";

/**
 * Modèles procéduraux des pièces. Unité : rayon extérieur d'un anneau = 1 (≈ 9,5 mm).
 * Les anneaux sont debout (axe Z), table de la pierre vers +Y.
 */

const MM = 1 / 9.5;

// Orientations (Euler XYZ : rotation Z appliquée d'abord, puis Y, puis X).
/** Table face à l'objectif. */
const FACE: [number, number, number] = [Math.PI / 2, 0, 0];
/** Table face à l'objectif, grand axe vertical (poire : pointe en bas). */
const FACE_DOWN: [number, number, number] = [Math.PI / 2, -Math.PI / 2, 0];

/** Diamètre d'une pierre (unités de scène) à partir de son poids ou de son diamètre. */
export function stoneSize(stone: ProductStone | undefined, fallbackMm = 5) {
  if (!stone) return fallbackMm * MM;
  if (stone.sizeMm) return stone.sizeMm * MM;
  const each = (stone.carats ?? 0.3) / stone.count;
  // Brillant rond : Ø ≈ 6,4 mm pour 1 ct, en racine cubique du poids.
  return 6.4 * Math.cbrt(each) * MM;
}

type Ctx = { palette: Palette; tier: RenderTier; envMap: Texture; metal: MetalId };

function Gem({
  ctx,
  kind,
  shape,
  size,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  small,
}: {
  ctx: Ctx;
  kind: ProductStone["kind"];
  shape: StoneShape;
  size: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  small?: boolean;
}) {
  const geometry = useMemo(() => gemGeometry(shape), [shape]);
  if (shape === "perle" || kind === "perle-akoya") {
    return (
      <mesh position={position}>
        <sphereGeometry args={[size / 2, 64, 48]} />
        <GemMaterial kind="perle-akoya" palette={ctx.palette} tier={ctx.tier} envMap={ctx.envMap} />
      </mesh>
    );
  }
  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={size}>
      <GemMaterial
        kind={kind}
        palette={ctx.palette}
        tier={ctx.tier}
        envMap={ctx.envMap}
        small={small ?? size < 0.2}
      />
    </mesh>
  );
}

function Metal({ ctx }: { ctx: Ctx }) {
  return <MetalMaterial metal={ctx.metal} palette={ctx.palette} />;
}

/** Anneau : tore aplati (profil confort), éventuellement ouvert en haut. */
function Band({
  ctx,
  thickness = 0.1,
  width = 0.2,
  gap = 0,
}: {
  ctx: Ctx;
  thickness?: number;
  width?: number;
  gap?: number;
}) {
  const radius = 1 - thickness / 2;
  return (
    <mesh rotation={[0, 0, Math.PI / 2 + gap / 2]} scale={[1, 1, width / thickness]}>
      <torusGeometry args={[radius, thickness / 2, 32, 180, Math.PI * 2 - gap]} />
      <Metal ctx={ctx} />
    </mesh>
  );
}

/** Griffes : fines capsules du panier jusqu'au-dessus du rondiste. */
function Prongs({
  ctx,
  count,
  radius,
  girdleY,
  baseY = 0.96,
}: {
  ctx: Ctx;
  count: number;
  radius: number;
  girdleY: number;
  baseY?: number;
}) {
  const prongs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + Math.PI / count;
        const top = new Vector3(
          Math.cos(a) * radius * 1.02,
          girdleY + radius * 0.16,
          Math.sin(a) * radius * 1.02,
        );
        const bottom = new Vector3(Math.cos(a) * radius * 0.45, baseY, Math.sin(a) * radius * 0.45);
        const mid = top.clone().add(bottom).multiplyScalar(0.5);
        const dir = top.clone().sub(bottom);
        const length = dir.length();
        return { mid, dir: dir.normalize(), length };
      }),
    [count, radius, girdleY, baseY],
  );
  return (
    <>
      {prongs.map(({ mid, dir, length }, i) => (
        <mesh key={i} position={mid} quaternion={quaternionFromY(dir)}>
          <capsuleGeometry args={[0.018, length, 4, 12]} />
          <Metal ctx={ctx} />
        </mesh>
      ))}
      {/* Panier : couronne fine sous la pierre */}
      <mesh position={[0, girdleY - radius * 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.62, 0.016, 12, 64]} />
        <Metal ctx={ctx} />
      </mesh>
    </>
  );
}

function quaternionFromY(direction: Vector3) {
  return new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction);
}

function Chain({
  ctx,
  points,
  radius = 0.009,
}: {
  ctx: Ctx;
  points: [number, number, number][];
  radius?: number;
}) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 120, radius, 8, false]} />
      <Metal ctx={ctx} />
    </mesh>
  );
}

/* ── Compositions ────────────────────────────────────────────── */

function Ring({ product, ctx }: { product: Product; ctx: Ctx }) {
  const main = product.stones.find((s) => s.role === "centrale") ?? product.stones[0]!;
  const second = product.stones.find((s) => s.role === "accent");
  const d = Math.max(stoneSize(main), 0.38);
  const girdleY = 1 + d * 0.42;
  // Pierres allongées : grand axe le long du doigt.
  const along: [number, number, number] =
    main.shape === "ovale" || main.shape === "poire" || main.shape === "emeraude"
      ? [0, Math.PI / 2, 0]
      : [0, 0, 0];
  const form = product.visual.form;

  if (form === "chevaliere") {
    return (
      <group>
        <Band ctx={ctx} thickness={0.16} width={0.34} />
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[0.62, 0.1, 0.48]} />
          <Metal ctx={ctx} />
        </mesh>
        <mesh position={[0, 1.075, 0]}>
          <boxGeometry args={[0.54, 0.02, 0.4]} />
          <GemMaterial kind="onyx" palette={ctx.palette} tier={ctx.tier} envMap={ctx.envMap} />
        </mesh>
        {second && (
          <Gem
            ctx={ctx}
            kind={second.kind}
            shape="rond"
            size={stoneSize(second)}
            position={[0, 1.082, 0]}
            small
          />
        )}
      </group>
    );
  }

  if (form === "toi-et-moi") {
    const other = second ?? main;
    return (
      <group>
        <Band ctx={ctx} gap={0.7} thickness={0.1} width={0.18} />
        <Gem
          ctx={ctx}
          kind={main.kind}
          shape={main.shape}
          size={d}
          position={[-0.36, 1.02, 0.02]}
          rotation={[0, 0, 0.35]}
        />
        <Gem
          ctx={ctx}
          kind={other.kind}
          shape="perle"
          size={stoneSize(other)}
          position={[0.36, 1.02, -0.02]}
        />
      </group>
    );
  }

  const halo = form === "halo" && second;
  const accents =
    form === "trilogie" && second
      ? [-1, 1].map((side) => ({
          key: side,
          // Posées sur l'épaule de l'anneau, pointe vers la pierre centrale
          position: [side * (d * 0.5 + stoneSize(second) * 0.42), girdleY - 0.16, 0] as [
            number,
            number,
            number,
          ],
          rotation: [0, side > 0 ? Math.PI : 0, -0.12] as [number, number, number],
          size: stoneSize(second),
          stone: second,
        }))
      : form === "epaulee" && second
        ? [-1, 1].map((side) => ({
            key: side,
            position: [Math.sin(side * 0.42) * 1.0, Math.cos(0.42) * 1.0 + 0.02, 0] as [
              number,
              number,
              number,
            ],
            rotation: [0, 0, -side * 0.42] as [number, number, number],
            size: stoneSize(second),
            stone: second,
          }))
        : [];

  return (
    <group>
      <Band
        ctx={ctx}
        thickness={form === "epaulee" ? 0.11 : 0.09}
        width={form === "epaulee" ? 0.22 : 0.17}
      />
      <Prongs ctx={ctx} count={main.shape === "rond" ? 6 : 4} radius={d / 2} girdleY={girdleY} />
      <Gem
        ctx={ctx}
        kind={main.kind}
        shape={main.shape}
        size={d}
        position={[0, girdleY, 0]}
        rotation={along}
      />
      {accents.map((a) => (
        <Gem
          key={a.key}
          ctx={ctx}
          kind={a.stone.kind}
          shape={a.stone.shape}
          size={a.size}
          position={a.position}
          rotation={a.rotation}
          small
        />
      ))}
      {halo &&
        Array.from({ length: Math.min(second.count, 22) }, (_, i) => {
          const a = (i / Math.min(second.count, 22)) * Math.PI * 2;
          const r = d / 2 + 0.075;
          return (
            <Gem
              key={i}
              ctx={ctx}
              kind={second.kind}
              shape="rond"
              size={0.11}
              position={[Math.cos(a) * r, girdleY - 0.04, Math.sin(a) * r]}
              small
            />
          );
        })}
    </group>
  );
}

function Pendant({ product, ctx }: { product: Product; ctx: Ctx }) {
  const main = product.stones.find((s) => s.role === "centrale") ?? product.stones[0]!;
  const pearl = product.stones.find((s) => s.kind === "perle-akoya" && s !== main);
  const line = product.stones.find((s) => s.kind === "diamant-noir" && s.count > 1);
  const d = Math.max(stoneSize(main), 0.5);
  // Table face à l'objectif ; poire pointe en bas, émeraude en hauteur.
  const facing: [number, number, number] =
    main.shape === "poire" || main.shape === "emeraude" ? FACE_DOWN : FACE;
  return (
    <group>
      <Chain
        ctx={ctx}
        points={[
          [-0.75, 1.55, -0.3],
          [-0.38, 0.95, -0.1],
          [-0.06, 0.5, 0],
          [0, 0.46, 0],
          [0.06, 0.5, 0],
          [0.38, 0.95, -0.1],
          [0.75, 1.55, -0.3],
        ]}
      />
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[0.05, 0.012, 12, 32]} />
        <Metal ctx={ctx} />
      </mesh>
      {main.kind === "onyx" ? (
        <group position={[0, -0.1, 0]}>
          <mesh>
            <boxGeometry args={[0.46, 0.8, 0.05]} />
            <GemMaterial kind="onyx" palette={ctx.palette} tier={ctx.tier} envMap={ctx.envMap} />
          </mesh>
          {line &&
            Array.from({ length: line.count }, (_, i) => (
              <Gem
                key={i}
                ctx={ctx}
                kind={line.kind}
                shape="rond"
                size={0.05}
                position={[0, 0.3 - i * 0.075, 0.03]}
                rotation={FACE}
                small
              />
            ))}
        </group>
      ) : (
        <Gem
          ctx={ctx}
          kind={main.kind}
          shape={main.shape}
          size={d}
          position={[0, 0.36 - d * 0.55, 0]}
          rotation={facing}
        />
      )}
      {pearl && (
        <Gem
          ctx={ctx}
          kind="perle-akoya"
          shape="perle"
          size={stoneSize(pearl)}
          position={[0, -0.25 - d * 0.6, 0]}
        />
      )}
    </group>
  );
}

function Earrings({ product, ctx }: { product: Product; ctx: Ctx }) {
  const main = product.stones.find((s) => s.role === "centrale") ?? product.stones[0]!;
  const second = product.stones.find((s) => s.role === "accent");
  const drops = product.visual.form === "boucles-pendantes";
  return (
    <group>
      {[-0.55, 0.55].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {drops ? (
            <>
              {second && (
                <Gem
                  ctx={ctx}
                  kind={second.kind}
                  shape="rond"
                  size={0.13}
                  position={[0, 0.62, 0]}
                  rotation={FACE}
                  small
                />
              )}
              <Chain
                ctx={ctx}
                points={[
                  [0, 0.56, 0],
                  [0.01, 0.4, 0],
                  [0, 0.26, 0],
                ]}
                radius={0.008}
              />
              <Gem
                ctx={ctx}
                kind={main.kind}
                shape={main.shape}
                size={stoneSize(main) * 1.15}
                position={[0, 0.0, 0]}
                rotation={FACE_DOWN}
              />
            </>
          ) : (
            <>
              <Gem
                ctx={ctx}
                kind="perle-akoya"
                shape="perle"
                size={stoneSize(main)}
                position={[0, 0.2, 0]}
              />
              <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.2, 0.018, 12, 48, Math.PI * 0.7]} />
                <Metal ctx={ctx} />
              </mesh>
              {second && (
                <Gem
                  ctx={ctx}
                  kind={second.kind}
                  shape="rond"
                  size={0.1}
                  position={[0, -0.2, 0.01]}
                  rotation={FACE}
                  small
                />
              )}
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function Riviere({ product, ctx }: { product: Product; ctx: Ctx }) {
  const main = product.stones[0]!;
  const count = Math.min(main.count, 48);
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const p: [number, number, number] = [Math.cos(a) * 1.2, 0, Math.sin(a) * 1.0];
        return (
          <group key={i} position={p}>
            <mesh>
              <cylinderGeometry args={[0.058, 0.05, 0.06, 16]} />
              <Metal ctx={ctx} />
            </mesh>
            <Gem
              ctx={ctx}
              kind={main.kind}
              shape="rond"
              size={0.11}
              position={[0, 0.04, 0]}
              small
            />
          </group>
        );
      })}
    </group>
  );
}

function PearlStrand({ product, ctx }: { product: Product; ctx: Ctx }) {
  const main = product.stones[0]!;
  const count = Math.min(main.count, 41);
  const d = stoneSize(main);
  // Perles jointives (fil de soie entre elles) : le rayon découle du nombre.
  const radius = (count * d * 1.04) / (Math.PI * 2);
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + Math.PI / 2;
        return (
          <Gem
            key={i}
            ctx={ctx}
            kind="perle-akoya"
            shape="perle"
            size={d}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius * 0.86]}
          />
        );
      })}
    </group>
  );
}

function Cuff({ product, ctx }: { product: Product; ctx: Ctx }) {
  const accent = product.stones.find((s) => s.role === "accent");
  const blades = 12;
  const span = Math.PI * 1.1;
  return (
    <group rotation={[0.25, 0, 0]}>
      <mesh rotation={[0, Math.PI / 2 + (Math.PI * 2 - Math.PI * 1.6) / 2, 0]}>
        <cylinderGeometry args={[1, 1, 0.9, 96, 1, true, 0, Math.PI * 1.6]} />
        <MetalMaterial metal={ctx.metal} palette={ctx.palette} />
      </mesh>
      {Array.from({ length: blades }, (_, i) => {
        const a = -span / 2 + (i + 0.5) * (span / blades);
        return (
          <group key={i} rotation={[0, -a, 0]}>
            <mesh position={[0, 0, 1.012]}>
              <boxGeometry args={[0.22, 0.78, 0.02]} />
              <GemMaterial kind="onyx" palette={ctx.palette} tier={ctx.tier} envMap={ctx.envMap} />
            </mesh>
            {accent &&
              Array.from({ length: 5 }, (_, j) => (
                <Gem
                  key={j}
                  ctx={ctx}
                  kind={accent.kind}
                  shape="rond"
                  size={0.045}
                  position={[0.135, -0.3 + j * 0.15, 1.015]}
                  rotation={FACE}
                  small
                />
              ))}
          </group>
        );
      })}
    </group>
  );
}

export function JewelModel({
  product,
  metal,
  palette,
  tier,
  envMap,
}: {
  product: Product;
  metal: MetalId;
  palette: Palette;
  tier: RenderTier;
  envMap: Texture;
}) {
  const ctx: Ctx = { palette, tier, envMap, metal };
  switch (product.visual.form) {
    case "pendentif":
      return <Pendant product={product} ctx={ctx} />;
    case "boucles-pendantes":
    case "puces":
      return <Earrings product={product} ctx={ctx} />;
    case "riviere":
      return <Riviere product={product} ctx={ctx} />;
    case "rang-de-perles":
      return <PearlStrand product={product} ctx={ctx} />;
    case "manchette":
      return <Cuff product={product} ctx={ctx} />;
    default:
      return <Ring product={product} ctx={ctx} />;
  }
}

/** Les bagues se présentent de trois quarts ; les autres pièces de face. */
export function viewDirection(form: Product["visual"]["form"]): [number, number, number] {
  switch (form) {
    case "pendentif":
    case "boucles-pendantes":
    case "puces":
      return [0, 0.08, 1];
    case "riviere":
    case "rang-de-perles":
      return [0, 1.15, 1];
    case "manchette":
      return [0.2, 0.25, 1];
    default:
      return [0.55, 0.42, 1];
  }
}
