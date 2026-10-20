/**
 * Niveau de rendu 3D selon l'appareil :
 * - « complet » : réfraction par lancer de rayons dans la pierre, pixels denses ;
 * - « leger » : matériaux simplifiés, résolution réduite ;
 * - « aucun » : l'image fixe suffit (pas de WebGL, rendu logiciel sans carte graphique,
 *   économie de données, batterie faible).
 * Une 3D demandée explicitement (bouton « Vue 3D ») passe outre, en rendu léger au besoin.
 */
export type RenderTier = "complet" | "leger" | "aucun";

export type DeviceSignals = {
  webgl: boolean;
  /** WebGL émulé par le processeur (SwiftShader, llvmpipe) : la 3D monopoliserait le fil principal. */
  softwareGl?: boolean;
  cores?: number;
  memoryGb?: number;
  saveData?: boolean;
  battery?: { level: number; charging: boolean };
  coarsePointer?: boolean;
};

export function chooseTier(s: DeviceSignals, requested = false): RenderTier {
  if (!s.webgl) return "aucun";
  const weak =
    (s.cores !== undefined && s.cores <= 4) || (s.memoryGb !== undefined && s.memoryGb <= 4);
  if (requested) return weak || s.softwareGl ? "leger" : "complet";
  if (s.softwareGl || s.saveData) return "aucun";
  if (s.battery && !s.battery.charging && s.battery.level < 0.2) return "aucun";
  if (weak) return "leger";
  // Mobile correct mais batterie entamée : on reste sobre.
  if (s.coarsePointer && s.battery && !s.battery.charging && s.battery.level < 0.5) return "leger";
  return "complet";
}

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render driver/i;

/**
 * `localStorage["aurele-3d"] = "force"` : 3D malgré un rendu logiciel (tests de bout en
 * bout et démonstrations sur une machine sans carte graphique).
 */
function forced3d() {
  try {
    return localStorage.getItem("aurele-3d") === "force";
  } catch {
    return false;
  }
}

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
};

/** Lit les signaux disponibles dans le navigateur (chacun est facultatif). */
export async function readDeviceSignals(): Promise<DeviceSignals> {
  const nav = navigator as NavigatorExtras;
  let webgl = false;
  let softwareGl = false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    webgl = Boolean(gl);
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl!.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    softwareGl = SOFTWARE_RENDERER.test(renderer) && !forced3d();
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl = false;
  }
  let battery: DeviceSignals["battery"];
  try {
    const b = await nav.getBattery?.();
    if (b) battery = { level: b.level, charging: b.charging };
  } catch {
    battery = undefined;
  }
  return {
    webgl,
    softwareGl,
    cores: nav.hardwareConcurrency || undefined,
    memoryGb: nav.deviceMemory,
    saveData: nav.connection?.saveData,
    battery,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
  };
}
