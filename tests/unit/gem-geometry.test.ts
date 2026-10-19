import { describe, expect, it } from "vitest";
import { Vector3, type BufferGeometry } from "three";
import { brilliantGeometry, emeraldGeometry, triangleCount } from "@/lib/three/gem-geometry";

function triangles(geometry: BufferGeometry) {
  const pos = geometry.getAttribute("position");
  const tris: [Vector3, Vector3, Vector3][] = [];
  for (let i = 0; i < pos.count; i += 3) {
    tris.push(
      [0, 1, 2].map((k) => new Vector3().fromBufferAttribute(pos, i + k)) as [
        Vector3,
        Vector3,
        Vector3,
      ],
    );
  }
  return tris;
}

const key = (v: Vector3) => `${v.x.toFixed(5)},${v.y.toFixed(5)},${v.z.toFixed(5)}`;

function checkSolid(geometry: BufferGeometry) {
  const edges = new Map<string, number>();
  const center = new Vector3();
  geometry.boundingBox!.getCenter(center);
  let inward = 0;
  let degenerate = 0;
  for (const [a, b, c] of triangles(geometry)) {
    const n = new Vector3().subVectors(b, a).cross(new Vector3().subVectors(c, a));
    if (n.length() < 1e-9) {
      degenerate++;
      continue;
    }
    const centroid = new Vector3().add(a).add(b).add(c).divideScalar(3);
    if (n.dot(centroid.sub(center)) < 0) inward++;
    for (const [p, q] of [
      [a, b],
      [b, c],
      [c, a],
    ] as const) {
      const k = [key(p), key(q)].sort().join("|");
      edges.set(k, (edges.get(k) ?? 0) + 1);
    }
  }
  const open = [...edges.values()].filter((n) => n !== 2).length;
  return { inward, open, degenerate };
}

describe("géométrie des pierres", () => {
  for (const shape of ["rond", "ovale", "coussin", "poire"] as const) {
    it(`brillant ${shape} : solide fermé, facettes tournées vers l'extérieur`, () => {
      const g = brilliantGeometry(shape);
      expect(triangleCount(g)).toBeGreaterThan(80);
      expect(checkSolid(g)).toEqual({ inward: 0, open: 0, degenerate: 0 });
    });
  }

  it("émeraude : solide fermé, plus large que haute", () => {
    const g = emeraldGeometry();
    expect(checkSolid(g)).toEqual({ inward: 0, open: 0, degenerate: 0 });
    const size = new Vector3();
    g.boundingBox!.getSize(size);
    expect(size.x / size.z).toBeCloseTo(1.4, 1);
  });

  it("proportions du brillant rond : diamètre 1, profondeur ≈ 60 %", () => {
    const size = new Vector3();
    brilliantGeometry("rond").boundingBox!.getSize(size);
    expect(size.x).toBeCloseTo(1, 1);
    expect(size.y).toBeGreaterThan(0.55);
    expect(size.y).toBeLessThan(0.65);
  });
});
