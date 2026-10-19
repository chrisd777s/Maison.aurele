import { BufferGeometry, Float32BufferAttribute } from "three";
import type { StoneShape } from "@/lib/commerce/types";

/**
 * Géométries de pierres facettées, construites anneau par anneau.
 * Unité : diamètre (ou largeur) de la pierre = 1, table vers +Y, rondiste à y = 0.
 * Les faces sont plates (sommets non partagés) : chaque facette renvoie la lumière d'un bloc.
 */

type Vec3 = [number, number, number];
type Ring = Vec3[];

/** Contour de la pierre vu de dessus : direction angulaire → point du rondiste (rayon ≈ 0,5). */
export function outline(shape: StoneShape, t: number): [number, number] {
  const c = Math.cos(t);
  const s = Math.sin(t);
  switch (shape) {
    case "ovale":
      return [0.5 * c, 0.37 * s];
    case "coussin": {
      // Superellipse : carré aux angles adoucis.
      const p = 3.2;
      const sx = Math.sign(c) * Math.abs(c) ** (2 / p);
      const sz = Math.sign(s) * Math.abs(s) ** (2 / p);
      return [0.48 * sx, 0.48 * sz];
    }
    case "poire": {
      // Goutte : arrière arrondi, pointe vers +X.
      const front = c > 0;
      const x = front ? 0.62 * c : 0.4 * c;
      const taper = front ? 1 - 0.62 * c ** 1.4 : 1;
      return [x + 0.1, 0.4 * s * taper];
    }
    default:
      return [0.5 * c, 0.5 * s];
  }
}

function ring(shape: StoneShape, count: number, scale: number, y: number, offset = 0): Ring {
  return Array.from({ length: count }, (_, i) => {
    const t = offset + (i / count) * Math.PI * 2;
    const [x, z] = outline(shape, t);
    return [x * scale, y, z * scale];
  });
}

function angleOf(v: Vec3) {
  const a = Math.atan2(v[2], v[0]);
  return a < 0 ? a + Math.PI * 2 : a;
}

/**
 * Relie deux anneaux fermés de tailles quelconques par des triangles, en avançant
 * sur celui dont le prochain sommet est le moins avancé en angle.
 */
export function stitch(lower: Ring, upper: Ring, out: number[]) {
  const sort = (r: Ring) => [...r].sort((a, b) => angleOf(a) - angleOf(b));
  const a = sort(lower);
  const b = sort(upper);
  let i = 0;
  let j = 0;
  const push = (...vs: Vec3[]) => vs.forEach((v) => out.push(...v));
  while (i < a.length || j < b.length) {
    const a0 = a[i % a.length]!;
    const b0 = b[j % b.length]!;
    const nextA =
      i < a.length
        ? angleOf(a[(i + 1) % a.length]!) + (i + 1 >= a.length ? Math.PI * 2 : 0)
        : Infinity;
    const nextB =
      j < b.length
        ? angleOf(b[(j + 1) % b.length]!) + (j + 1 >= b.length ? Math.PI * 2 : 0)
        : Infinity;
    if (nextA <= nextB) {
      // Triangle (a0, a1, b0), orienté vers l'extérieur.
      push(a0, b0, a[(i + 1) % a.length]!);
      i++;
    } else {
      push(a0, b0, b[(j + 1) % b.length]!);
      j++;
    }
  }
}

function fan(center: Vec3, r: Ring, out: number[], up: boolean) {
  const sorted = [...r].sort((a, b) => angleOf(a) - angleOf(b));
  sorted.forEach((v, i) => {
    const w = sorted[(i + 1) % sorted.length]!;
    out.push(...(up ? [...center, ...w, ...v] : [...center, ...v, ...w]));
  });
}

function finish(positions: number[]) {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * Taille brillant (rond, ovale, coussin, poire) : table 57 %, couronne 15 %,
 * pavillon 43 %. Étoiles, bézels et halefis approchés par des anneaux décalés.
 */
export function brilliantGeometry(shape: Exclude<StoneShape, "emeraude" | "perle" | "cabochon">) {
  const p: number[] = [];
  const table = ring(shape, 8, 0.57, 0.165, 0);
  const star = ring(shape, 8, 0.8, 0.105, Math.PI / 8);
  const girdleTop = ring(shape, 16, 1, 0.02);
  const girdleBottom = ring(shape, 16, 1, -0.01);
  const pavilion = ring(shape, 8, 0.48, -0.24, 0);
  const tableCenter: Vec3 = [shape === "poire" ? 0.07 : 0, 0.165, 0];
  const culet: Vec3 = [shape === "poire" ? 0.08 : 0, -0.43, 0];

  fan(tableCenter, table, p, true);
  stitch(star, table, p);
  stitch(girdleTop, star, p);
  stitch(girdleBottom, girdleTop, p);
  stitch(pavilion, girdleBottom, p);
  fan(culet, pavilion, p, false);
  return finish(p);
}

/** Taille émeraude : contour rectangulaire à pans coupés, facettes en gradins. */
export function emeraldGeometry(ratio = 1.4) {
  const octagon = (scale: number, y: number): Ring => {
    const hw = 0.5 * ratio * scale;
    const hh = 0.5 * scale;
    const c = Math.min(hw, hh) * 0.3;
    return [
      [hw, y, -hh + c],
      [hw, y, hh - c],
      [hw - c, y, hh],
      [-hw + c, y, hh],
      [-hw, y, hh - c],
      [-hw, y, -hh + c],
      [-hw + c, y, -hh],
      [hw - c, y, -hh],
    ];
  };
  const p: number[] = [];
  const levels: [number, number][] = [
    [0.62, 0.15],
    [0.82, 0.09],
    [1, 0.02],
    [1, -0.01],
    [0.74, -0.14],
    [0.46, -0.27],
    [0.2, -0.37],
  ];
  const rings = levels.map(([s, y]) => octagon(s, y));
  fan([0, 0.15, 0], rings[0]!, p, true);
  for (let k = 1; k < rings.length; k++) stitch(rings[k]!, rings[k - 1]!, p);
  fan([0, -0.4, 0], rings[rings.length - 1]!, p, false);
  return finish(p);
}

export function gemGeometry(shape: StoneShape) {
  if (shape === "emeraude") return emeraldGeometry();
  if (shape === "perle" || shape === "cabochon") return brilliantGeometry("rond");
  return brilliantGeometry(shape);
}

/** Nombre de facettes (triangles) : utile aux tests. */
export function triangleCount(geometry: BufferGeometry) {
  return geometry.getAttribute("position").count / 3;
}
