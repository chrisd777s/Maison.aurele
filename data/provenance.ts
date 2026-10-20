import type { Localized, StoneKind } from "@/lib/commerce/types";

/**
 * Parcours des pierres : de la mine (ou de la ferme perlière) à l'atelier de Montréal.
 * Lieux décrits par région, jamais par exploitant. Coordonnées en degrés décimaux.
 */

export type Place = { name: Localized; lat: number; lon: number };

export type JourneyStage = "origine" | "taille" | "atelier";

const MONTREAL: Place = {
  name: { fr: "Atelier, Vieux-Montréal", en: "Atelier, Old Montréal" },
  lat: 45.508,
  lon: -73.554,
};

/** Étapes d'origine et de taille par nature de pierre. */
export const routes: Record<StoneKind, { origin: Place; cutting: Place }> = {
  diamant: {
    origin: {
      name: { fr: "Territoires du Nord-Ouest, Canada", en: "Northwest Territories, Canada" },
      lat: 64.7,
      lon: -110.6,
    },
    cutting: { name: { fr: "Anvers, Belgique", en: "Antwerp, Belgium" }, lat: 51.22, lon: 4.4 },
  },
  "diamant-noir": {
    origin: {
      name: { fr: "Minas Gerais, Brésil", en: "Minas Gerais, Brazil" },
      lat: -18.5,
      lon: -44,
    },
    cutting: { name: { fr: "Surat, Inde", en: "Surat, India" }, lat: 21.17, lon: 72.83 },
  },
  saphir: {
    origin: {
      name: { fr: "Ratnapura, Sri Lanka", en: "Ratnapura, Sri Lanka" },
      lat: 6.68,
      lon: 80.4,
    },
    cutting: {
      name: { fr: "Chanthaburi, Thaïlande", en: "Chanthaburi, Thailand" },
      lat: 12.61,
      lon: 102.1,
    },
  },
  "perle-akoya": {
    origin: { name: { fr: "Baie d’Ago, Japon", en: "Ago Bay, Japan" }, lat: 34.3, lon: 136.82 },
    cutting: { name: { fr: "Kobe, Japon", en: "Kobe, Japan" }, lat: 34.69, lon: 135.2 },
  },
  onyx: {
    origin: { name: { fr: "Artigas, Uruguay", en: "Artigas, Uruguay" }, lat: -30.4, lon: -56.47 },
    cutting: {
      name: { fr: "Idar-Oberstein, Allemagne", en: "Idar-Oberstein, Germany" },
      lat: 49.71,
      lon: 7.31,
    },
  },
};

export const atelier = MONTREAL;

export type Artisan = { id: string; name: string; role: Localized; since: number };

/** Artisans de l'atelier (personnages fictifs). */
export const artisans = [
  {
    id: "mathieu-lavoie",
    name: "Mathieu Lavoie",
    role: { fr: "Maître sertisseur", en: "Master setter" },
    since: 2012,
  },
  {
    id: "camille-thibodeau",
    name: "Camille Thibodeau",
    role: { fr: "Sertisseuse", en: "Setter" },
    since: 2016,
  },
  {
    id: "yara-haddad",
    name: "Yara Haddad",
    role: { fr: "Sertisseuse et enfileuse de perles", en: "Setter and pearl stringer" },
    since: 2019,
  },
  {
    id: "anouk-pelletier",
    name: "Anouk Pelletier",
    role: { fr: "Polisseuse", en: "Polisher" },
    since: 2014,
  },
] as const satisfies readonly Artisan[];

export type ArtisanId = (typeof artisans)[number]["id"];

export type ProvenanceRecord = {
  /** Code imprimé (et en QR) sur l'écrin de la pièce. */
  code: string;
  /** Date de sertissage (AAAA-MM-JJ). */
  setAt: string;
  setter: ArtisanId;
  polisher: ArtisanId;
  /** Lot d'or ou de platine recyclé employé pour la monture. */
  metalLot: string;
};

export const provenanceRecords: ProvenanceRecord[] = [
  {
    code: "AU101-0187",
    setAt: "2026-02-11",
    setter: "mathieu-lavoie",
    polisher: "anouk-pelletier",
    metalLot: "R-2601-OB",
  },
  {
    code: "AU102-0214",
    setAt: "2026-03-04",
    setter: "camille-thibodeau",
    polisher: "anouk-pelletier",
    metalLot: "R-2602-OB",
  },
  {
    code: "AU103-0233",
    setAt: "2026-03-19",
    setter: "camille-thibodeau",
    polisher: "anouk-pelletier",
    metalLot: "R-2602-OB",
  },
  {
    code: "AU104-0251",
    setAt: "2026-04-08",
    setter: "mathieu-lavoie",
    polisher: "anouk-pelletier",
    metalLot: "R-2603-OB",
  },
  {
    code: "AU105-0270",
    setAt: "2026-04-29",
    setter: "mathieu-lavoie",
    polisher: "anouk-pelletier",
    metalLot: "R-2603-PT",
  },
  {
    code: "MA201-0302",
    setAt: "2026-05-13",
    setter: "mathieu-lavoie",
    polisher: "anouk-pelletier",
    metalLot: "R-2604-OJ",
  },
  {
    code: "MA202-0318",
    setAt: "2026-05-27",
    setter: "yara-haddad",
    polisher: "anouk-pelletier",
    metalLot: "R-2604-OJ",
  },
  {
    code: "MA203-0325",
    setAt: "2026-06-03",
    setter: "yara-haddad",
    polisher: "anouk-pelletier",
    metalLot: "R-2605-OJ",
  },
  {
    code: "MA204-0331",
    setAt: "2026-06-10",
    setter: "yara-haddad",
    polisher: "anouk-pelletier",
    metalLot: "R-2605-OJ",
  },
  {
    code: "MA205-0347",
    setAt: "2026-06-24",
    setter: "camille-thibodeau",
    polisher: "anouk-pelletier",
    metalLot: "R-2605-OR",
  },
  {
    code: "OB301-0401",
    setAt: "2026-07-15",
    setter: "camille-thibodeau",
    polisher: "anouk-pelletier",
    metalLot: "R-2606-ON",
  },
  {
    code: "OB302-0418",
    setAt: "2026-08-05",
    setter: "mathieu-lavoie",
    polisher: "anouk-pelletier",
    metalLot: "R-2607-ON",
  },
  {
    code: "OB303-0426",
    setAt: "2026-08-19",
    setter: "camille-thibodeau",
    polisher: "anouk-pelletier",
    metalLot: "R-2607-ON",
  },
  {
    code: "OB304-0433",
    setAt: "2026-09-02",
    setter: "yara-haddad",
    polisher: "anouk-pelletier",
    metalLot: "R-2608-ON",
  },
  {
    code: "OB305-0451",
    setAt: "2026-09-23",
    setter: "mathieu-lavoie",
    polisher: "anouk-pelletier",
    metalLot: "R-2608-PT",
  },
];

export function provenanceRecord(code: string) {
  return provenanceRecords.find((r) => r.code === code) ?? null;
}

export function artisan(id: ArtisanId): Artisan {
  return artisans.find((a) => a.id === id)!;
}
