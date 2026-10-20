import { describe, expect, it } from "vitest";
import { chooseTier } from "@/lib/device/capabilities";

describe("niveau de rendu 3D", () => {
  it("sans WebGL ou en économie de données : image fixe", () => {
    expect(chooseTier({ webgl: false, cores: 16 })).toBe("aucun");
    expect(chooseTier({ webgl: true, saveData: true, cores: 16 })).toBe("aucun");
  });
  it("batterie sous 20 % hors charge : image fixe", () => {
    expect(chooseTier({ webgl: true, cores: 8, battery: { level: 0.15, charging: false } })).toBe(
      "aucun",
    );
    expect(chooseTier({ webgl: true, cores: 8, battery: { level: 0.15, charging: true } })).toBe(
      "complet",
    );
  });
  it("appareil modeste : rendu léger", () => {
    expect(chooseTier({ webgl: true, cores: 4 })).toBe("leger");
    expect(chooseTier({ webgl: true, cores: 8, memoryGb: 2 })).toBe("leger");
  });
  it("mobile performant, batterie à moitié : rendu léger", () => {
    expect(
      chooseTier({
        webgl: true,
        cores: 8,
        coarsePointer: true,
        battery: { level: 0.4, charging: false },
      }),
    ).toBe("leger");
  });
  it("rendu logiciel (sans carte graphique) : image fixe, sauf 3D demandée", () => {
    expect(chooseTier({ webgl: true, softwareGl: true, cores: 16, memoryGb: 16 })).toBe("aucun");
    expect(chooseTier({ webgl: true, softwareGl: true, cores: 16 }, true)).toBe("leger");
  });
  it("3D demandée : affichée même en économie de données, jamais sans WebGL", () => {
    expect(chooseTier({ webgl: true, saveData: true, cores: 16 }, true)).toBe("complet");
    expect(chooseTier({ webgl: true, cores: 2 }, true)).toBe("leger");
    expect(chooseTier({ webgl: false }, true)).toBe("aucun");
  });
  it("ordinateur récent : rendu complet", () => {
    expect(chooseTier({ webgl: true, cores: 10, memoryGb: 8 })).toBe("complet");
  });
});
