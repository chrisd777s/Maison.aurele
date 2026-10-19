/**
 * Niveau de rendu 3D selon l'appareil :
 * - « complet » : réfraction par lancer de rayons dans la pierre, pixels denses ;
 * - « leger » : matériaux simplifiés, résolution réduite ;
 * - « aucun » : l'image fixe suffit (pas de WebGL, économie de données, batterie faible).
 */
export type RenderTier = "complet" | "leger" | "aucun";

export type DeviceSignals = {
  webgl: boolean;
  cores?: number;
  memoryGb?: number;
  saveData?: boolean;
  battery?: { level: number; charging: boolean };
  coarsePointer?: boolean;
};

export function chooseTier(s: DeviceSignals): RenderTier {
  if (!s.webgl || s.saveData) return "aucun";
  if (s.battery && !s.battery.charging && s.battery.level < 0.2) return "aucun";
  const weak =
    (s.cores !== undefined && s.cores <= 4) || (s.memoryGb !== undefined && s.memoryGb <= 4);
  if (weak) return "leger";
  // Mobile correct mais batterie entamée : on reste sobre.
  if (s.coarsePointer && s.battery && !s.battery.charging && s.battery.level < 0.5) return "leger";
  return "complet";
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
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(canvas.getContext("webgl2"));
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
    cores: nav.hardwareConcurrency || undefined,
    memoryGb: nav.deviceMemory,
    saveData: nav.connection?.saveData,
    battery,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
  };
}
