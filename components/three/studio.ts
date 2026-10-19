import {
  BackSide,
  DoubleSide,
  Color,
  CubeCamera,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLCubeRenderTarget,
  type WebGLRenderer,
} from "three";

/**
 * Studio photo procédural (aucun fichier HDR) : une pièce sombre et quelques
 * boîtes à lumière. Le panneau principal suit le curseur ; la carte de cube
 * est alors recalculée, si bien que la pierre et le métal réagissent ensemble.
 */
export type Studio = {
  texture: WebGLCubeRenderTarget["texture"];
  /** Direction de la lumière principale (vecteur unitaire, repère monde). */
  setKey(direction: Vector3): void;
  update(renderer: WebGLRenderer): void;
  dispose(): void;
};

type Panel = {
  position: [number, number, number];
  size: [number, number];
  intensity: number;
  tone?: "warm" | "dark";
};

const PANELS: Panel[] = [
  // Grande boîte zénithale
  { position: [0, 7, 1], size: [6, 4], intensity: 2.4 },
  // Bandes latérales : liserés sur l'anneau, arêtes des facettes
  { position: [-6, 1.5, 2], size: [1, 7], intensity: 3.4 },
  { position: [6, 1.5, -1], size: [1, 7], intensity: 3.4 },
  // Drapeaux noirs : le contraste qui fait scintiller la pierre et dessine le métal
  { position: [-4.5, 0.5, -4.5], size: [3, 8], intensity: 1, tone: "dark" },
  { position: [4.5, 0.5, 4.5], size: [2.2, 8], intensity: 1, tone: "dark" },
  { position: [0, -6, 0], size: [14, 14], intensity: 1, tone: "dark" },
  // Petites sources ponctuelles : autant d'éclats dans les facettes
  { position: [-3, 5, 3], size: [0.5, 0.5], intensity: 8 },
  { position: [2, 6, -2], size: [0.4, 0.4], intensity: 8 },
  { position: [-5, 3, -1], size: [0.35, 0.35], intensity: 9 },
  { position: [4, 2.5, 3.5], size: [0.35, 0.35], intensity: 9 },
  { position: [1, 3.5, 6], size: [0.3, 0.3], intensity: 10 },
  // Contre-jour chaud, très léger (signature champagne)
  { position: [0, 2, -7], size: [8, 1.4], intensity: 1.4, tone: "warm" },
];

export function createStudio(
  colors: { warm: string; light: string; dark: string },
  resolution = 256,
): Studio {
  const scene = new Scene();
  // Pièce claire et neutre, comme un fond de studio
  const room = new Mesh(
    new SphereGeometry(20, 32, 16),
    new MeshBasicMaterial({ color: new Color(colors.light).multiplyScalar(0.62), side: BackSide }),
  );
  scene.add(room);

  const target = new Vector3(0, 0, 0);
  const panel = (p: Panel) => {
    const base = p.tone === "warm" ? colors.warm : p.tone === "dark" ? colors.dark : colors.light;
    const color = new Color(base).multiplyScalar(p.intensity);
    const mesh = new Mesh(
      new PlaneGeometry(...p.size),
      new MeshBasicMaterial({ color, toneMapped: false, side: DoubleSide }),
    );
    mesh.position.set(...p.position);
    mesh.lookAt(target);
    scene.add(mesh);
    return mesh;
  };
  PANELS.forEach(panel);

  // Boîte principale, mobile : la « lumière qui suit le regard »
  const key = panel({ position: [3, 4, 5], size: [2.6, 2.6], intensity: 7 });

  const renderTarget = new WebGLCubeRenderTarget(resolution, { type: HalfFloatType });
  const camera = new CubeCamera(0.1, 50, renderTarget);
  let dirty = true;

  return {
    texture: renderTarget.texture,
    setKey(direction) {
      key.position.copy(direction).normalize().multiplyScalar(7);
      key.lookAt(target);
      dirty = true;
    },
    update(renderer) {
      if (!dirty) return;
      camera.update(renderer, scene);
      // Le métal (PBR) recalcule sa version préfiltrée à partir de la carte de cube.
      renderTarget.texture.needsPMREMUpdate = true;
      dirty = false;
    },
    dispose() {
      renderTarget.dispose();
      scene.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose();
          (o.material as MeshBasicMaterial).dispose();
        }
      });
    },
  };
}
