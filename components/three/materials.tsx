"use client";

import { MeshRefractionMaterial } from "@react-three/drei";
import { Color, type Texture } from "three";
import type { MetalId, StoneKind } from "@/lib/commerce/types";
import type { RenderTier } from "@/lib/device/capabilities";
import { metalToken, stoneToken, type Palette } from "@/lib/three/palette";

export function MetalMaterial({ metal, palette }: { metal: MetalId; palette: Palette }) {
  const black = metal === "or-noir";
  // Le rhodium noir réfléchit encore ~30 % : teinte « canon de fusil », pas noir mat.
  const color = black
    ? new Color(palette["or-noir"]).lerp(new Color(palette.platine), 0.38)
    : new Color(palette[metalToken[metal]]);
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={black ? 0.16 : 0.12}
      envMapIntensity={black ? 1.8 : 1.15}
      clearcoat={black ? 0.6 : 0.15}
      clearcoatRoughness={0.1}
    />
  );
}

type GemProps = {
  kind: StoneKind;
  palette: Palette;
  tier: RenderTier;
  envMap: Texture;
  /** Petites pierres d'accompagnement : matière simplifiée, sans lancer de rayons. */
  small?: boolean;
};

/**
 * Diamant et saphir : réfraction par lancer de rayons dans la géométrie (BVH),
 * indice 2,42 pour le diamant et 1,77 pour le saphir, légère dispersion.
 * Sur appareil modeste ou pour les petites pierres : facettes miroir.
 */
export function GemMaterial({ kind, palette, tier, envMap, small }: GemProps) {
  const color = palette[stoneToken[kind]];
  const transparent = kind === "diamant" || kind === "saphir";

  if (transparent && tier === "complet" && !small) {
    return (
      <MeshRefractionMaterial
        envMap={envMap}
        bounces={3}
        ior={kind === "diamant" ? 2.42 : 1.77}
        fresnel={kind === "diamant" ? 0.4 : 0.6}
        aberrationStrength={kind === "diamant" ? 0.008 : 0.004}
        fastChroma
        color={color}
        toneMapped={false}
      />
    );
  }

  switch (kind) {
    case "diamant":
      // Facettes miroir éclaircies : sans lancer de rayons, la pierre reste lumineuse.
      return (
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          emissive={palette["diamant-reflet"]}
          emissiveIntensity={0.14}
          envMapIntensity={2.4}
          flatShading
        />
      );
    case "saphir":
      return (
        <meshPhysicalMaterial
          color={color}
          metalness={0.35}
          roughness={0.04}
          clearcoat={1}
          envMapIntensity={1.6}
          flatShading
        />
      );
    case "diamant-noir":
      return (
        <meshPhysicalMaterial
          color={color}
          metalness={0.4}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={2}
          flatShading
        />
      );
    case "onyx":
      return (
        <meshPhysicalMaterial
          color={color}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={1.4}
        />
      );
    case "perle-akoya":
      return (
        <meshPhysicalMaterial
          color={color}
          roughness={0.22}
          sheen={1}
          sheenColor={palette["perle-lustre"]}
          sheenRoughness={0.35}
          iridescence={0.55}
          iridescenceIOR={1.3}
          clearcoat={0.7}
          clearcoatRoughness={0.12}
          envMapIntensity={1.1}
        />
      );
  }
}
